import { useState } from 'react';
import { AdminTable } from '../../components/admin/AdminTable';
import { adminCustomers } from '../../data/admin';

const columns = [
  { key: 'name', label: 'Customer' },
  { key: 'email', label: 'Email' },
  { key: 'tier', label: 'Tier' },
  { key: 'orders', label: 'Orders' },
  { key: 'status', label: 'Status' },
] as const;

export function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const filteredRows = adminCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Customer directory</p>
          <h1>Know the atelier.</h1>
          <p>Customer relationships, membership signals, and order history.</p>
        </div>
      </header>
      <div className="admin-toolbar">
        <input
          aria-label="Search customers"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="filter-chip" type="button">
          Export directory
        </button>
      </div>
      {filteredRows.length > 0 ? (
        <AdminTable columns={columns as never} rows={filteredRows as never} />
      ) : (
        <p className="empty-state">No customers match your criteria.</p>
      )}
    </div>
  );
}