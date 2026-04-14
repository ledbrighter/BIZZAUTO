import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get business analytics
router.get('/', authenticate, async (req: any, res: any) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(period));

    const [
      contactsCount,
      messagesCount,
      postsCount,
      campaignsCount,
      reviewsCount,
      recentContacts,
      recentMessages,
      pipelineStats,
    ] = await Promise.all([
      prisma.contact.count({ where: { businessId: req.user.businessId } }),
      prisma.message.count({
        where: {
          businessId: req.user.businessId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.socialPost.count({
        where: {
          businessId: req.user.businessId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.campaign.count({
        where: {
          businessId: req.user.businessId,
          status: 'active',
        },
      }),
      prisma.review.count({
        where: {
          businessId: req.user.businessId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.contact.findMany({
        where: { businessId: req.user.businessId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.message.findMany({
        where: { businessId: req.user.businessId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.contact.groupBy({
        by: ['stageId'],
        where: { businessId: req.user.businessId },
        _count: true,
      }),
    ]);

    // Message stats by type
    const messageStats = await prisma.message.groupBy({
      by: ['status'],
      where: {
        businessId: req.user.businessId,
        createdAt: { gte: startDate },
      },
      _count: true,
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalContacts: contactsCount,
          messagesSent: messagesCount,
          postsPublished: postsCount,
          activeCampaigns: campaignsCount,
          newReviews: reviewsCount,
        },
        messageStats: messageStats.reduce((acc: any, stat: any) => {
          acc[stat.status] = stat._count;
          return acc;
        }, {}),
        pipelineStats,
        recentContacts,
        recentMessages,
      },
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      details: error.message,
    });
  }
});

// Get detailed campaign analytics
router.get('/campaigns/:campaignId', authenticate, async (req: any, res: any) => {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: req.params.campaignId,
        businessId: req.user.businessId,
      },
      include: {
        messages: {
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    const stats = {
      total: campaign.messages.length,
      sent: campaign.messages.filter((m: any) => m.status === 'sent').length,
      delivered: campaign.messages.filter((m: any) => m.status === 'delivered').length,
      read: campaign.messages.filter((m: any) => m.status === 'read').length,
      failed: campaign.messages.filter((m: any) => m.status === 'failed').length,
    };

    res.json({
      success: true,
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.name,
          type: campaign.type,
          status: campaign.status,
        },
        stats,
        performance: {
          deliveryRate: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
          readRate: stats.delivered > 0 ? (stats.read / stats.delivered) * 100 : 0,
          failureRate: stats.total > 0 ? (stats.failed / stats.total) * 100 : 0,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch campaign analytics', details: error.message });
  }
});

export default router;
