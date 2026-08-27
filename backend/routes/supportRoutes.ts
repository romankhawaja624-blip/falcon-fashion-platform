// FALCON Support / Concierge Routes — customer ownership + admin access

import { Router } from 'express';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth';
import {
  createTicket, getCustomerTickets, getAllTickets,
  getTicketThread, postReply, updateTicketStatus
} from '../services/supportService';

const router = Router();

/** POST /api/support/tickets — create a new ticket (authenticated customer) */
router.post('/tickets', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { subject, category, priority, message } = req.body;
    if (!subject || !message) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Subject and message are required.' } });
      return;
    }
    const result = await createTicket({
      userId: user.userId,
      customerName: `${user.email}`,
      customerEmail: user.email,
      subject, category: category || 'General',
      priority, message,
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
});

/** GET /api/support/tickets — customer: own tickets, admin: all tickets */
router.get('/tickets', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const tickets = user.role === 'ADMIN'
      ? await getAllTickets()
      : await getCustomerTickets(user.userId);
    res.status(200).json({ success: true, data: tickets });
  } catch (err) { next(err); }
});

/** GET /api/support/tickets/:id — ticket thread with ownership check */
router.get('/tickets/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const result = await getTicketThread(req.params.id as string, req.user!.userId, req.user!.role);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(err); }
});

/** POST /api/support/tickets/:id/reply — post a message */
router.post('/tickets/:id/reply', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Reply text is required.' } });
      return;
    }
    const msg = await postReply({
      ticketId: req.params.id as string,
      senderId: user.userId,
      senderName: user.email,
      senderRole: user.role,
      text,
    });
    res.status(201).json({ success: true, data: msg });
  } catch (err) { next(err); }
});

/** PATCH /api/support/tickets/:id/status — update ticket status */
router.patch('/tickets/:id/status', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ success: false, error: { code: 'INVALID_REQUEST', message: 'Status is required.' } });
      return;
    }
    const ticket = await updateTicketStatus(req.params.id as string, status, req.user!.userId, req.user!.role);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) { next(err); }
});

/** Admin-only routes */

/** GET /api/support/admin/tickets — all tickets (admin) */
router.get('/admin/tickets', authenticate, requireAdmin, async (_req, res, next) => {
  try {
    const tickets = await getAllTickets();
    res.status(200).json({ success: true, data: tickets });
  } catch (err) { next(err); }
});

export default router;
