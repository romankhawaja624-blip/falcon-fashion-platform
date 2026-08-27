import { useState, useEffect } from 'react';
import { supportTickets as defaultTickets } from '../../data/admin';
import { Search, MessageSquare, Send, CheckCircle, Clock, AlertTriangle, User, ArrowLeft, Filter } from 'lucide-react';
import { useToast } from '../../features/toast/ToastContext';

interface SupportTicket {
  id: string;
  subject: string;
  customer?: string;
  category?: string;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
  lastUpdate?: string;
}

interface TicketMessage {
  sender: string;
  time: string;
  text: string;
  isCustomer?: boolean;
}

export function AdminSupportPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Normal'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Assigned' | 'In Progress' | 'Resolved'>('All');

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('falcon_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: any) => ({
            id: t.id,
            subject: t.subject,
            customer: t.customer ?? 'Atelier Member',
            category: t.category ?? 'General Inquiry',
            priority: t.priority ?? 'Normal',
            status: t.status ?? 'Open',
            lastUpdate: t.lastUpdate ?? 'Today',
          }));
        }
      }
    } catch {
      // fallback
    }
    return defaultTickets.map((t) => ({ ...t, priority: t.priority as any, status: t.status as any }));
  });

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyText, setReplyText] = useState('');

  // Persist tickets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('falcon_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to save tickets', e);
    }
  }, [tickets]);

  // Load active ticket messages when selected
  useEffect(() => {
    if (activeTicket) {
      try {
        const savedMsgs = localStorage.getItem(`falcon_ticket_messages_${activeTicket.id}`);
        if (savedMsgs) {
          setMessages(JSON.parse(savedMsgs));
          return;
        }
      } catch {
        // fallback
      }
      setMessages([
        {
          sender: activeTicket.customer ?? 'Client',
          time: '10:15 AM',
          text: `Inquiry regarding ${activeTicket.subject}. Seeking concierge assistance.`,
          isCustomer: true,
        },
      ]);
    }
  }, [activeTicket]);

  // Save messages on update
  const saveMessages = (id: string, updatedMsgs: TicketMessage[]) => {
    try {
      localStorage.setItem(`falcon_ticket_messages_${id}`, JSON.stringify(updatedMsgs));
    } catch (e) {
      console.error('Failed to save ticket messages', e);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    const newReply: TicketMessage = {
      sender: 'Falcon Client Concierge (Admin)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText.trim(),
      isCustomer: false,
    };

    const nextMsgs = [...messages, newReply];
    setMessages(nextMsgs);
    saveMessages(activeTicket.id, nextMsgs);
    setReplyText('');

    // Update ticket status to In Progress
    if (activeTicket.status === 'Open') {
      updateTicketStatus(activeTicket.id, 'In Progress');
    }

    showToast('Reply dispatched to client concierge thread.', 'success');
  };

  const updateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    if (activeTicket && activeTicket.id === ticketId) {
      setActiveTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Ticket ${ticketId} status set to ${newStatus}`, 'info');
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      (t.customer && t.customer.toLowerCase().includes(search.toLowerCase()));

    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="admin-page container-fluid" style={{ padding: '2rem 1rem' }}>
      <header className="admin-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--color-champagne, #d4af37)' }}>
            Client Concierge Service Desk
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', fontSize: '2.25rem', margin: '0.25rem 0' }}>
            Support Center
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            Resolve client inquiries with atelier attention. Live sync with customer Help Center.
          </p>
        </div>
      </header>

      {/* Toolbar & Filters */}
      <div className="admin-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            aria-label="Search support tickets"
            placeholder="Search ticket ID, subject, or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', height: '40px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.9rem' }}
          />
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          aria-label="Filter by priority"
          style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
        >
          <option value="All">Priority: All Priorities</option>
          <option value="High">Priority: High</option>
          <option value="Normal">Priority: Normal</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          aria-label="Filter by status"
          style={{ height: '40px', padding: '0 12px', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
        >
          <option value="All">Status: All Statuses</option>
          <option value="Open">Status: Open</option>
          <option value="In Progress">Status: In Progress</option>
          <option value="Resolved">Status: Resolved</option>
        </select>
      </div>

      {/* Main Split View: Ticket List & Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: activeTicket ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Ticket List */}
        <div className="admin-table-wrap" style={{ border: '1px solid var(--color-outline-muted)', borderRadius: '8px', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'var(--color-surface, #141416)' }}>
            <thead style={{ background: 'var(--color-surface-low, #1c1c1f)', borderBottom: '1px solid var(--color-outline-muted)' }}>
              <tr>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>ID</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Subject</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Client</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Priority</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Status</th>
                <th scope="col" style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => {
                const isActive = activeTicket?.id === t.id;
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--color-outline-muted)', background: isActive ? 'var(--color-surface-low, #1c1c1f)' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.85rem', color: 'var(--color-champagne)' }}>
                      {t.id}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500 }}>{t.subject}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>{t.customer}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: t.priority === 'High' ? '#ff6b6b' : 'var(--color-text-muted)' }}>
                        {t.priority}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          background: t.status === 'Resolved' ? 'rgba(40,167,69,0.15)' : t.status === 'In Progress' ? 'rgba(212,175,55,0.15)' : 'rgba(0,123,255,0.15)',
                          color: t.status === 'Resolved' ? '#28a745' : t.status === 'In Progress' ? 'var(--color-champagne)' : '#007bff',
                          border: `1px solid ${t.status === 'Resolved' ? '#28a745' : t.status === 'In Progress' ? 'var(--color-champagne)' : '#007bff'}`,
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTicket(t)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          borderRadius: '4px',
                          border: '1px solid var(--color-outline-muted)',
                          background: isActive ? 'var(--color-champagne)' : 'var(--color-surface-low, #1c1c1f)',
                          color: isActive ? '#000' : 'var(--color-text)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                        }}
                      >
                        {isActive ? 'Inspecting' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTickets.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', margin: 0 }}>
              No support tickets match your search filters.
            </p>
          )}
        </div>

        {/* Ticket Inspector & Reply Desk */}
        {activeTicket && (
          <div style={{ background: 'var(--color-surface, #141416)', border: '1px solid var(--color-outline-muted)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-outline-muted)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <p className="eyebrow" style={{ color: 'var(--color-champagne)', margin: 0 }}>
                  Ticket Inspector / {activeTicket.id}
                </p>
                <h3 style={{ fontFamily: 'var(--font-heading, "Bodoni Moda", serif)', margin: '0.25rem 0' }}>
                  {activeTicket.subject}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Client: <strong>{activeTicket.customer}</strong>
                </p>
              </div>

              {/* Status toggle select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Status:</span>
                <select
                  value={activeTicket.status}
                  onChange={(e) => updateTicketStatus(activeTicket.id, e.target.value as any)}
                  aria-label="Set ticket status"
                  style={{ padding: '0.3rem 0.6rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-champagne)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.85rem' }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.25rem', padding: '0 4px' }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: '0.75rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    maxWidth: '85%',
                    marginLeft: msg.isCustomer ? '0' : 'auto',
                    marginRight: msg.isCustomer ? 'auto' : '0',
                    background: msg.isCustomer ? 'var(--color-surface-low, #1c1c1f)' : 'rgba(212,175,55,0.1)',
                    border: `1px solid ${msg.isCustomer ? 'var(--color-outline-muted)' : 'var(--color-champagne)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    <strong style={{ color: msg.isCustomer ? 'var(--color-text)' : 'var(--color-champagne)' }}>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Admin Reply Form */}
            <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-outline-muted)' }}>
              <input
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type response as Falcon Client Concierge..."
                aria-label="Type response to client"
                style={{ flex: 1, padding: '0.75rem', background: 'var(--color-surface-low, #1c1c1f)', border: '1px solid var(--color-outline-muted)', borderRadius: '4px', color: 'var(--color-text)', fontSize: '0.9rem' }}
              />
              <button
                type="submit"
                className="button button--primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 1.25rem' }}
              >
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}