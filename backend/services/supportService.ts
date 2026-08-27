// FALCON Support / Concierge Service — PostgreSQL-backed
// Customer ownership enforced on all read/write operations

import { query } from '../db/pool';

export interface Ticket {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: string;
  text: string;
  isCustomer: boolean;
  createdAt: string;
}

/** Create a new support ticket */
export async function createTicket(input: {
  userId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  priority?: string;
  message: string;
}): Promise<{ ticket: Ticket; message: TicketMessage }> {
  const ticketId = `SUP-${Date.now().toString(36).toUpperCase()}`;
  const msgId    = `msg-${ticketId}-1`;

  await query(
    `INSERT INTO support_tickets (id, user_id, customer_name, customer_email, subject, category, priority, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'Open')`,
    [ticketId, input.userId, input.customerName, input.customerEmail, input.subject, input.category, input.priority || 'Normal']
  );

  await query(
    `INSERT INTO ticket_messages (id, ticket_id, sender, text, is_customer)
     VALUES ($1,$2,$3,$4,true)`,
    [msgId, ticketId, input.customerName, input.message]
  );

  const ticket = (await query<any>('SELECT * FROM support_tickets WHERE id = $1', [ticketId])).rows[0];
  return {
    ticket: mapTicket(ticket),
    message: { id: msgId, ticketId, sender: input.customerName, text: input.message, isCustomer: true, createdAt: new Date().toISOString() },
  };
}

/** Get tickets for a specific customer */
export async function getCustomerTickets(userId: string): Promise<Ticket[]> {
  const res = await query<any>(
    'SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return res.rows.map(mapTicket);
}

/** Get all tickets (admin) */
export async function getAllTickets(): Promise<Ticket[]> {
  const res = await query<any>('SELECT * FROM support_tickets ORDER BY created_at DESC');
  return res.rows.map(mapTicket);
}

/** Get ticket messages — enforces ownership for customers */
export async function getTicketThread(
  ticketId: string,
  requestingUserId: string,
  requestingRole: 'CUSTOMER' | 'ADMIN'
): Promise<{ ticket: Ticket; messages: TicketMessage[] }> {
  const ticketRes = await query<any>('SELECT * FROM support_tickets WHERE id = $1', [ticketId]);
  if (ticketRes.rowCount === 0) {
    const err: any = new Error('Ticket not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  const ticket = ticketRes.rows[0];

  // Ownership: customers can only see their own tickets
  if (requestingRole !== 'ADMIN' && ticket.user_id !== requestingUserId) {
    const err: any = new Error('Ticket not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }

  const msgRes = await query<any>(
    'SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC',
    [ticketId]
  );

  return {
    ticket: mapTicket(ticket),
    messages: msgRes.rows.map(mapMessage),
  };
}

/** Post a reply to a ticket */
export async function postReply(input: {
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'CUSTOMER' | 'ADMIN';
  text: string;
}): Promise<TicketMessage> {
  // Verify ticket exists and check ownership
  const ticketRes = await query<any>('SELECT * FROM support_tickets WHERE id = $1', [input.ticketId]);
  if (ticketRes.rowCount === 0) {
    const err: any = new Error('Ticket not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  const ticket = ticketRes.rows[0];
  if (input.senderRole !== 'ADMIN' && ticket.user_id !== input.senderId) {
    const err: any = new Error('Ticket not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }

  const msgId = `msg-${input.ticketId}-${Date.now().toString(36)}`;
  await query(
    `INSERT INTO ticket_messages (id, ticket_id, sender, text, is_customer)
     VALUES ($1,$2,$3,$4,$5)`,
    [msgId, input.ticketId, input.senderName, input.text, input.senderRole === 'CUSTOMER']
  );

  return { id: msgId, ticketId: input.ticketId, sender: input.senderName, text: input.text, isCustomer: input.senderRole === 'CUSTOMER', createdAt: new Date().toISOString() };
}

/** Update ticket status (admin or owner) */
export async function updateTicketStatus(
  ticketId: string,
  newStatus: string,
  requestingUserId: string,
  requestingRole: 'CUSTOMER' | 'ADMIN'
): Promise<Ticket> {
  const ALLOWED_STATUSES = ['Open', 'Assigned', 'In Progress', 'Resolved'];
  if (!ALLOWED_STATUSES.includes(newStatus)) {
    const err: any = new Error(`Invalid ticket status "${newStatus}". Allowed: ${ALLOWED_STATUSES.join(', ')}`);
    err.statusCode = 400; err.code = 'INVALID_REQUEST';
    throw err;
  }
  const ticketRes = await query<any>('SELECT * FROM support_tickets WHERE id = $1', [ticketId]);
  if (ticketRes.rowCount === 0) {
    const err: any = new Error('Ticket not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }
  if (requestingRole !== 'ADMIN' && ticketRes.rows[0].user_id !== requestingUserId) {
    const err: any = new Error('Ticket not found.');
    err.statusCode = 404; err.code = 'NOT_FOUND';
    throw err;
  }

  const res = await query<any>(
    'UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [newStatus, ticketId]
  );
  return mapTicket(res.rows[0]);
}

function mapTicket(r: any): Ticket {
  return {
    id: r.id, userId: r.user_id,
    customerName: r.customer_name, customerEmail: r.customer_email,
    subject: r.subject, category: r.category,
    priority: r.priority, status: r.status,
    createdAt: r.created_at?.toISOString?.() ?? r.created_at,
    updatedAt: r.updated_at?.toISOString?.() ?? r.updated_at ?? r.created_at,
  };
}

function mapMessage(r: any): TicketMessage {
  return {
    id: r.id, ticketId: r.ticket_id,
    sender: r.sender, text: r.text,
    isCustomer: r.is_customer,
    createdAt: r.created_at?.toISOString?.() ?? r.created_at,
  };
}
