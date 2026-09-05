import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from '../../features/account/AccountContext';
import { useToast } from '../../features/toast/ToastContext';
import { Button } from '../../components/ui/Button';
import { Award, Coins, Sparkles, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export function ProgressPage() {
  const { xp, coins, level, nextXp, loyaltyHistory, spendCoins } = useAccount();
  const { showToast } = useToast();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const progressPercent = Math.min(100, Math.round((xp / nextXp) * 100));

  const rewards = [
    { id: 'r1', title: '$20 Atelier Voucher', cost: 200, description: 'Redeem 200 coins for a $20 voucher toward your next bespoke commission.' },
    { id: 'r2', title: 'Early Access Pass', cost: 150, description: 'Get 48-hour priority access to upcoming seasonal archival drops.' },
    { id: 'r3', title: 'Private AI Styling Session', cost: 100, description: 'Complimentary deep-dive styling consultation with Falcon AI.' },
  ];

  const handleRedeem = (title: string, cost: number) => {
    const success = spendCoins(cost, title);
    if (success) {
      showToast(`Successfully redeemed "${title}"!`, 'success');
      setSelectedReward(title);
    } else {
      showToast(`Insufficient Falcon Coins (Need ${cost} Coins).`, 'error');
    }
  };

  return (
    <div className="atelier-page progress-page" style={{ paddingBottom: '5rem' }}>
      <header className="atelier-page-heading" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: 0 }}>
              LOYALTY & REWARDS
            </span>
            <span style={{ color: 'var(--color-outline-muted)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              ATELIER TIER COGNITION
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', fontWeight: 400, margin: '0.25rem 0 0.75rem', letterSpacing: '-0.02em' }}>
            Your Style Journey
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '640px', margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>
            Every commission, styling consultation, and wardrobe curation sharpens your personal style language and unlocks bespoke rewards.
          </p>
        </div>
      </header>

      {/* Hero Tier & XP Overview */}
      <section className="journey-hero" style={{
        background: 'var(--color-surface-low, #141416)',
        border: '1px solid var(--color-outline-muted)',
        borderRadius: '4px',
        padding: '2.5rem',
        marginBottom: '3.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={16} style={{ color: 'var(--color-champagne, #C2A878)' }} />
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-champagne, #C2A878)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              CURRENT TIER
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '2.2rem', fontWeight: 400, margin: '0 0 0.5rem 0' }}>
            {level} / Atelier Collector
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem 0', fontFamily: 'var(--font-mono)' }}>
            {xp.toLocaleString()} / {nextXp.toLocaleString()} XP to Level 05
          </p>

          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-champagne, #C2A878)', transition: 'width 0.5s ease' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
            {progressPercent}% COMPLETED TO NEXT MILESTONE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--color-surface-high, #1a1a1e)', padding: '1.5rem', borderRadius: '4px', minWidth: '140px', flex: 1, border: '1px solid var(--color-outline-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              <Coins size={14} style={{ color: 'var(--color-champagne, #C2A878)' }} />
              Falcon Coins
            </div>
            <strong style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '2rem', fontWeight: 400, display: 'block', margin: '8px 0 2px' }}>
              {coins.toLocaleString()}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Available to redeem</span>
          </div>

          <div style={{ background: 'var(--color-surface-high, #1a1a1e)', padding: '1.5rem', borderRadius: '4px', minWidth: '140px', flex: 1, border: '1px solid var(--color-outline-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              <Sparkles size={14} style={{ color: 'var(--color-champagne, #C2A878)' }} />
              Style Score
            </div>
            <strong style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '2rem', fontWeight: 400, display: 'block', margin: '8px 0 2px' }}>
              72 / 100
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Intelligence Level</span>
          </div>
        </div>
      </section>

      {/* Rewards Catalog */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: '0 0 0.25rem 0' }}>
            PRIVILEGES
          </p>
          <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.8rem', fontWeight: 400, margin: 0 }}>
            Redeem Falcon Coins
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {rewards.map((reward) => (
            <div key={reward.id} style={{
              background: 'var(--color-surface-low, #141416)',
              border: '1px solid var(--color-outline-muted)',
              borderRadius: '4px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.25rem', fontWeight: 400, margin: 0 }}>
                    {reward.title}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-champagne, #C2A878)', fontFamily: 'var(--font-mono)' }}>
                    {reward.cost} Coins
                  </span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                  {reward.description}
                </p>
              </div>

              <Button
                variant={coins >= reward.cost ? 'primary' : 'secondary'}
                onClick={() => handleRedeem(reward.title, reward.cost)}
                disabled={coins < reward.cost}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                {coins >= reward.cost ? 'Redeem Voucher' : `Need ${reward.cost - coins} More Coins`}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Activity History */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #C2A878)', margin: '0 0 0.25rem 0' }}>
            TRANSACTION LOG
          </p>
          <h2 style={{ fontFamily: 'var(--font-display, "Bodoni Moda", serif)', fontSize: '1.8rem', fontWeight: 400, margin: 0 }}>
            Recent Loyalty Activity
          </h2>
        </div>
        {loyaltyHistory.length > 0 ? (
          <div style={{ background: 'var(--color-surface-low, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', overflow: 'hidden' }}>
            {loyaltyHistory.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-outline-muted)',
              }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text, #fff)', display: 'block' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.date}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: item.type === 'coins_spent' ? '#ef4444' : 'var(--color-champagne, #C2A878)',
                }}>
                  {item.type === 'coins_spent' ? `-${item.amount} Coins` : `+${item.amount} ${item.type === 'xp_earned' ? 'XP' : 'Coins'}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', background: 'var(--color-surface-low, #141416)' }}>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>No recent loyalty activity recorded.</p>
          </div>
        )}
      </section>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link className="button button--primary" to="/stylist" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Consult AI Stylist <ArrowRight size={14} />
        </Link>
        <Link className="button button--secondary" to="/shop">
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}