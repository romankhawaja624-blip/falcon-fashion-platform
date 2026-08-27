import { useState } from 'react';
import { adminCustomers } from '../../data/admin';
import { Search, Download, UserCheck, Shield, Sparkles } from 'lucide-react';
import { useToast } from '../../features/toast/ToastContext';

export function AdminCustomersPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Atelier' | 'Premium' | 'Standard'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Review'>('All');

  const filteredRows = adminCustomers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalOrdersSum = adminCustomers.reduce((sum, c) => sum + c.orders, 0);

  const handleExport = () => {
    showToast('Customer directory exported as CSV.', 'success');
  };

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Customer Directory
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            Atelier Roster ({adminCustomers.length} clients)
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Client relationships, membership privileges, and order statistics.
          </p>
        </div>
        <button
          className="button button--secondary"
          type="button"
          onClick={handleExport}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={16} /> Export directory
        </button>
      </header>

      {/* Customer Summary Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.25rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>Registered Clients</span>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: '0.25rem 0' }}>{adminCustomers.length}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>Active atelier profiles</p>
        </div>

        <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.25rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>Atelier Tier Members</span>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: '0.25rem 0' }}>
            {adminCustomers.filter((c) => c.tier === 'Atelier' || c.tier === 'Premium').length}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>VIP & Pro tier status</p>
        </div>

        <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.25rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>Average Lifetime Orders</span>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '1.75rem', margin: '0.25rem 0' }}>
            {(totalOrdersSum / adminCustomers.length).toFixed(1)}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>Orders per account</p>
        </div>
      </section>

      {/* Toolbar & Filters */}
      <div className="admin-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            aria-label="Search customers"
            placeholder="Search customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', height: '40px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.9rem' }}
          />
        </div>

        {/* Tier Filter */}
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as any)}
          aria-label="Filter by membership tier"
          style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
        >
          <option value="All">Tier: All Tiers</option>
          <option value="Atelier">Tier: Atelier</option>
          <option value="Premium">Tier: Premium</option>
          <option value="Standard">Tier: Standard</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          aria-label="Filter by customer status"
          style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
        >
          <option value="All">Status: All Statuses</option>
          <option value="Active">Status: Active</option>
          <option value="Review">Status: Review</option>
        </select>
      </div>

      {/* Customer Table */}
      {filteredRows.length > 0 ? (
        <div className="admin-table-wrap" style={{ border: '1px solid var(--color-outline-muted)', borderRadius: '8px', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--color-surface, #141416)' }}>
            <thead style={{ background: 'var(--color-surface-low, #1c1c1f)', borderBottom: '1px solid var(--color-outline-muted)' }}>
              <tr>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Client Name</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Email Address</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Membership Tier</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Total Orders</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((c) => (
                <tr key={c.email} style={{ borderBottom: '1px solid var(--color-outline-muted)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{c.name}</strong>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {c.email}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        background: c.tier === 'Atelier' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.08)',
                        color: c.tier === 'Atelier' ? 'var(--color-champagne)' : 'var(--color-text)',
                        border: `1px solid ${c.tier === 'Atelier' ? 'var(--color-champagne)' : 'var(--color-outline-muted)'}`,
                      }}
                    >
                      {c.tier === 'Atelier' && <Sparkles size={12} />}
                      {c.tier} Member
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.9rem' }}>
                    <strong>{c.orders}</strong> orders
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        background: c.status === 'Active' ? 'rgba(40,167,69,0.15)' : 'rgba(255,193,7,0.15)',
                        color: c.status === 'Active' ? '#28a745' : '#ffc107',
                        border: `1px solid ${c.status === 'Active' ? '#28a745' : '#ffc107'}`,
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px' }}>
          <p className="eyebrow" style={{ color: 'var(--color-champagne)' }}>No Clients Found</p>
          <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', margin: '0.5rem 0' }}>No customer records match your filter</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try searching for a different name or clearing filters.
          </p>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => {
              setSearch('');
              setTierFilter('All');
              setStatusFilter('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}