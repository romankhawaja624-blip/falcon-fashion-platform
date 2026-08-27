// FALCON Client API for Help Center & Support Desk
// Communicates with real Node.js backend via HTTP

import { apiRequest, type ApiResponse } from './client';

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

export async function fetchTickets(): Promise<ApiResponse<Ticket[]>> {
  return apiRequest<Ticket[]>('GET', '/api/support/tickets');
}

export async function fetchTicketById(ticketId: string): Promise<ApiResponse<{ ticket: Ticket; messages: TicketMessage[] }>> {
  return apiRequest<{ ticket: Ticket; messages: TicketMessage[] }>('GET', `/api/support/tickets/${ticketId}`);
}

export async function submitTicket(payload: {
  subject: string;
  category: string;
  priority?: string;
  message: string;
}): Promise<ApiResponse<{ ticket: Ticket; message: TicketMessage }>> {
  return apiRequest<{ ticket: Ticket; message: TicketMessage }>('POST', '/api/support/tickets', payload);
}

export async function postTicketReply(ticketId: string, text: string): Promise<ApiResponse<TicketMessage>> {
  return apiRequest<TicketMessage>('POST', `/api/support/tickets/${ticketId}/reply`, { text });
}

export async function adminChangeTicketStatus(ticketId: string, status: string): Promise<ApiResponse<Ticket>> {
  return apiRequest<Ticket>('PATCH', `/api/support/tickets/${ticketId}/status`, { status });
}

export async function adminFetchAllTickets(): Promise<ApiResponse<Ticket[]>> {
  return apiRequest<Ticket[]>('GET', '/api/support/admin/tickets');
}
