import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get reviews
router.get('/', authenticate, async (req: any, res: any) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const where: any = { businessId: req.user.businessId };
    if (status) where.isRead = status === 'unread' ? false : true;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({ where, skip: (Number(page) - 1) * Number(limit), take: Number(limit), orderBy: { createdAt: 'desc' } }),
      prisma.review.count({ where }),
    ]);

    res.json({ success: true, data: { reviews, pagination: { total, page: Number(page), limit: Number(limit) } } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch reviews', details: error.message });
  }
});

// Update review reply
router.put('/:id/reply', authenticate, async (req: any, res: any) => {
  try {
    const { replyText } = req.body;
    await prisma.review.update({
      where: { id: req.params.id },
      data: { replyText, repliedAt: new Date(), replyStatus: 'sent' },
    });
    res.json({ success: true, message: 'Reply sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to send reply', details: error.message });
  }
});

export default router;
