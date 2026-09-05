// FALCON Customer Payment Selection & Proof Upload Form (Pakistan Launch)
// Supports JazzCash, Easypaisa, and Pakistani Bank Transfer (Meezan Bank)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../features/checkout/CheckoutContext';
import { Button } from '../ui/Button';
import { createPayment, submitPaymentProof, type PaymentMethod, type PaymentProviderName } from '../../services/api/paymentApi';

export function PaymentForm() {
  const { payment, setPayment, setStep } = useCheckout();
  const navigate = useNavigate();

  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderName>('BANK_TRANSFER');
  const [referenceNo, setReferenceNo] = useState('');
  const [senderName, setSenderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setFileBase64(undefined);
      return;
    }

    const file = e.target.files[0];
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
      setError('Invalid file type. Please upload a PNG, JPEG, WEBP image or PDF file.');
      setSelectedFile(null);
      setFileBase64(undefined);
      return;
    }

    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE_BYTES) {
      setError('File size exceeds 5MB limit.');
      setSelectedFile(null);
      setFileBase64(undefined);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!referenceNo.trim()) {
      setError('Transaction reference / deposit ID number is required.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Payment record for order
      const methodMap: Record<PaymentProviderName, PaymentMethod> = {
        JAZZCASH: 'JAZZCASH',
        EASYPAISA: 'EASYPAISA',
        BANK_TRANSFER: 'BANK_TRANSFER',
        STRIPE: 'CARD',
        PAYPAL: 'CARD',
        MOCK: 'MOCK',
      };

      // Mock order ID if not yet finalized in checkout flow
      const orderId = payment.orderId || `FAL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const createRes = await createPayment({
        orderId,
        provider: selectedProvider,
        method: methodMap[selectedProvider],
        currency: 'PKR',
        country: 'PK',
      });

      if (!createRes.success || !createRes.data) {
        if (createRes.error?.code === 'ALREADY_PAID') {
          setError('This order is already verified and paid.');
        } else {
          setError(createRes.error?.message || 'Failed to initiate payment.');
        }
        setLoading(false);
        return;
      }

      const paymentRecord = createRes.data.payment;

      // 2. Submit Payment Proof (Screenshot & Reference No)
      const proofRes = await submitPaymentProof(paymentRecord.id, {
        referenceNo: referenceNo.trim(),
        fileBase64,
        mimeType: selectedFile?.type,
        originalName: selectedFile?.name,
        senderName: senderName.trim() || undefined,
        bankName: bankName.trim() || undefined,
      });

      if (!proofRes.success) {
        if (proofRes.error?.code === 'DUPLICATE_REFERENCE') {
          setError('This transaction reference has already been submitted for another payment. Please check your reference number.');
        } else {
          setError(proofRes.error?.message || 'Failed to submit payment proof.');
        }
        setLoading(false);
        return;
      }

      // Update Checkout context state
      setPayment({
        ...payment,
        paymentId: paymentRecord.id,
        orderId,
        provider: selectedProvider,
        referenceNo: referenceNo.trim(),
        status: 'UNDER_REVIEW',
      });

      setSuccessMessage('Payment proof submitted successfully! Status is now UNDER REVIEW.');
      setTimeout(() => {
        setStep('review');
        navigate('/checkout/review');
      }, 1500);
    } catch (_err) {
      setError('Network or server error while submitting payment proof.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: '#141416', padding: '1.25rem', borderRadius: '8px', border: '1px solid #27272a' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Select Pakistan Payment Method</h3>
        <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '1.25rem' }}>
          Your payment will be strictly linked to this order reference.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Bank Transfer Option */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderRadius: '8px',
            background: selectedProvider === 'BANK_TRANSFER' ? '#1c1c1f' : '#141416',
            border: selectedProvider === 'BANK_TRANSFER' ? '1px solid #38bdf8' : '1px solid #27272a',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name="paymentProvider"
              value="BANK_TRANSFER"
              checked={selectedProvider === 'BANK_TRANSFER'}
              onChange={() => setSelectedProvider('BANK_TRANSFER')}
              style={{ marginTop: '0.2rem' }}
            />
            <div>
              <strong style={{ color: '#fff', display: 'block' }}>Pakistani Local Bank Transfer (Meezan Bank)</strong>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Direct IBAN / Account Transfer from any Pakistani bank app</span>
            </div>
          </label>

          {/* JazzCash Option */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderRadius: '8px',
            background: selectedProvider === 'JAZZCASH' ? '#1c1c1f' : '#141416',
            border: selectedProvider === 'JAZZCASH' ? '1px solid #38bdf8' : '1px solid #27272a',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name="paymentProvider"
              value="JAZZCASH"
              checked={selectedProvider === 'JAZZCASH'}
              onChange={() => setSelectedProvider('JAZZCASH')}
              style={{ marginTop: '0.2rem' }}
            />
            <div>
              <strong style={{ color: '#fff', display: 'block' }}>JazzCash Mobile Wallet</strong>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Transfer to JazzCash merchant account or wallet number</span>
            </div>
          </label>

          {/* Easypaisa Option */}
          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderRadius: '8px',
            background: selectedProvider === 'EASYPAISA' ? '#1c1c1f' : '#141416',
            border: selectedProvider === 'EASYPAISA' ? '1px solid #38bdf8' : '1px solid #27272a',
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name="paymentProvider"
              value="EASYPAISA"
              checked={selectedProvider === 'EASYPAISA'}
              onChange={() => setSelectedProvider('EASYPAISA')}
              style={{ marginTop: '0.2rem' }}
            />
            <div>
              <strong style={{ color: '#fff', display: 'block' }}>Easypaisa Wallet / Transfer</strong>
              <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Transfer to Easypaisa account number</span>
            </div>
          </label>
        </div>
      </div>

      {/* Account Details Box */}
      <div style={{ background: '#1c1c1f', padding: '1.25rem', borderRadius: '8px', border: '1px solid #3f3f46' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#38bdf8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Payment Instructions & Destination Details
        </h4>

        {selectedProvider === 'BANK_TRANSFER' && (
          <div style={{ fontSize: '0.9rem', color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p><strong>Bank Name:</strong> Meezan Bank Limited</p>
            <p><strong>Account Title:</strong> FALCON Atelier (Pvt) Ltd</p>
            <p><strong>Account Number:</strong> 01020304050607</p>
            <p><strong>IBAN:</strong> <span style={{ fontFamily: 'monospace', color: '#facc15' }}>PK36MEZN0001020304050607</span></p>
          </div>
        )}

        {selectedProvider === 'JAZZCASH' && (
          <div style={{ fontSize: '0.9rem', color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p><strong>Destination:</strong> JazzCash Mobile Wallet</p>
            <p><strong>Account Title:</strong> FALCON JazzCash Merchant Account</p>
            <p><strong>Account Number:</strong> <span style={{ fontFamily: 'monospace', color: '#facc15' }}>0300-1234567</span></p>
          </div>
        )}

        {selectedProvider === 'EASYPAISA' && (
          <div style={{ fontSize: '0.9rem', color: '#e4e4e7', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p><strong>Destination:</strong> Easypaisa Wallet</p>
            <p><strong>Account Title:</strong> FALCON Easypaisa Merchant Account</p>
            <p><strong>Account Number:</strong> <span style={{ fontFamily: 'monospace', color: '#facc15' }}>0345-7654321</span></p>
          </div>
        )}
      </div>

      {/* Transaction Proof Submission Form */}
      <div style={{ background: '#141416', padding: '1.25rem', borderRadius: '8px', border: '1px solid #27272a' }}>
        <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Submit Deposit Reference & Proof</h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#a1a1aa' }}>
            <span style={{ color: '#fff' }}>Transaction Reference / Deposit ID *</span>
            <input
              type="text"
              placeholder="e.g. TRX-99887766 or Bank Ref No."
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              required
              style={{ padding: '0.75rem', borderRadius: '6px', background: '#1c1c1f', color: '#fff', border: '1px solid #3f3f46' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#a1a1aa' }}>
            <span>Sender Name / Bank Name (Optional)</span>
            <input
              type="text"
              placeholder="e.g. Muhammad Ali / HBL Bank"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '6px', background: '#1c1c1f', color: '#fff', border: '1px solid #3f3f46' }}
            />
          </label>

          {/* Screenshot File Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#fff' }}>Payment Screenshot / PDF Proof (Max 5MB)</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onChange={handleFileChange}
              style={{ padding: '0.5rem', background: '#1c1c1f', borderRadius: '6px', color: '#a1a1aa', border: '1px dashed #3f3f46' }}
            />
            {selectedFile && (
              <div style={{ fontSize: '0.8rem', color: '#4ade80', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setFileBase64(undefined); }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: '6px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', borderRadius: '6px', fontSize: '0.9rem' }}>
          {successMessage}
        </div>
      )}

      <Button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Submitting Proof...' : 'Submit Payment Proof'}
      </Button>
    </form>
  );
}