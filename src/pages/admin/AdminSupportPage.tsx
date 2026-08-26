import { useState } from 'react';
import { AdminTable } from '../../components/admin/AdminTable';
import { supportTickets } from '../../data/admin';

const columns = [
  { key: 'id', label: 'Ticket' },
  { key: 'subject', label: 'Subject' },
  { key: 'customer', label: 'Customer' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
] as const;

export function AdminSupportPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Open' | 'High priority'>('All');

  const filteredTickets = supportTickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Open' && t.status !== 'Resolved') ||
      (filter === 'High priority' && t.priority === 'High');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Support center</p>
          <h1>Care, considered.</h1>
          <p>Resolve questions with the same attention as every atelier piece.</p>
        </div>
      </header>

      <div className="admin-toolbar">
        <input
          aria-label="Search support tickets"
          placeholder="Search ticket ID, subject, or customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-group" role="group" aria-label="Support status filter">
          {['All', 'Open', 'High priority'].map((opt) => (
            <button
              key={opt}
              className={`filter-chip ${filter === opt ? 'filter-chip--active' : ''}`}
              type="button"
              onClick={() => setFilter(opt as any)}
            >
              {opt === 'All' ? 'All tickets' : opt}
            </button>
          ))}
        </div>
      </div>

      {filteredTickets.length > 0 ? (
        <AdminTable columns={columns as never} rows={filteredTickets as never} />
      ) : (
        <p className="empty-state" style={{ color: 'var(--color-text-muted)', marginTop: '24px' }}>
          No support tickets match your search.
        </p>
      )}
    </div>
  );
}