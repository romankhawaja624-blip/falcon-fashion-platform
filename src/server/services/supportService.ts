// FALCON Support & Concierge Backend Service
import { db, type DbSupportTicket, type DbTicketMessage } from '../database/db';

export function getTickets(userId?: string): DbSupportTicket[] {
  const all = Array.from(db.tickets.values());
  if (userId) return all.filter((t) => t.userId === userId);
  return all;
}

export function getTicketById(ticketId: string): { ticket: DbSupportTicket; messages: DbTicketMessage[] } | null {
  const ticket = db.tickets.get(ticketId);
  if (!ticket) return null;
  const messages = db.ticketMessages.get(ticketId) ?? [];
  return { ticket, messages };
}

export function createTicket(input: {
  userId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  description: string;
}): DbSupportTicket {
  const ticketId = `SUP-${Math.floor(2000 + Math.random() * 9000)}`;
  const ticket: DbSupportTicket = {
    id: ticketId,
    userId: input.userId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    subject: input.subject,
    category: input.category,
    priority: 'Normal',
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tickets.set(ticketId, ticket);

  const initialMsg: DbTicketMessage = {
    id: `msg-${ticketId}-1`,
    ticketId,
    sender: input.customerName,
    text: input.description,
    isCustomer: true,
    createdAt: new Date().toISOString(),
  };

  db.ticketMessages.set(ticketId, [initialMsg]);
  return ticket;
}

export function addTicketReply(ticketId: string, sender: string, text: string, isCustomer: boolean): DbTicketMessage {
  const ticket = db.tickets.get(ticketId);
  if (!ticket) throw new Error(`Ticket "${ticketId}" not found.`);

  const message: DbTicketMessage = {
    id: `msg-${ticketId}-${Date.now()}`,
    ticketId,
    sender,
    text,
    isCustomer,
    createdAt: new Date().toISOString(),
  };

  const msgs = db.ticketMessages.get(ticketId) ?? [];
  msgs.push(message);
  db.ticketMessages.set(ticketId, msgs);

  if (!isCustomer && ticket.status === 'Open') {
    ticket.status = 'In Progress';
  }
  ticket.updatedAt = new Date().toISOString();

  return message;
}

export function updateTicketStatus(ticketId: string, status: DbSupportTicket['status']): DbSupportTicket {
  const ticket = db.tickets.get(ticketId);
  if (!ticket) throw new Error(`Ticket "${ticketId}" not found.`);
  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  return ticket;
}
