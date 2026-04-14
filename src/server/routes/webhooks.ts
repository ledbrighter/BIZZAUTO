import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get webhooks
router.get('/', authenticate, async (req: any, res: any) => {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: { businessId: req.user.businessId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: webhooks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch webhooks', details: error.message });
  }
});

// Create webhook
router.post('/', authenticate, async (req: any, res: any) => {
  try {
    const { url, events } = req.body;
    const webhook = await prisma.webhook.create({
      data: { businessId: req.user.businessId, url, events, secret: crypto.randomUUID() },
    });
    res.status(201).json({ success: true, data: webhook });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create webhook', details: error.message });
  }
});

// Update webhook
router.put('/:id', authenticate, async (req: any, res: any) => {
  try {
    await prisma.webhook.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, message: 'Webhook updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update webhook', details: error.message });
  }
});

// Delete webhook
router.delete('/:id', authenticate, async (req: any, res: any) => {
  try {
    await prisma.webhook.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Webhook deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to delete webhook', details: error.message });
  }
});

export default router;
