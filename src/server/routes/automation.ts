
import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import axios from 'axios';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ==================== AUTOMATION RULES ====================

// Get all automation rules for business
router.get('/rules', async (req: any, res: any) => {
  try {
    const rules = await prisma.chatbotFlow.findMany({
      where: { businessId: req.user.businessId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: rules });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch automation rules',
      details: error.message,
    });
  }
});

// Create automation rule
router.post('/rules', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { name, description, triggerType, triggerValue, flowData, nodes, edges } = req.body;

    if (!name || !triggerType) {
      return res.status(400).json({
        success: false,
        error: 'Name and triggerType are required',
      });
    }

    const rule = await prisma.chatbotFlow.create({
      data: {
        businessId: req.user.businessId,
        name,
        description: description || '',
        triggerType,
        triggerValue: triggerValue || '',
        flowData: flowData || {},
        nodes: nodes || [],
        edges: edges || [],
        isActive: false,
      },
    });

    res.status(201).json({ success: true, data: rule });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to create automation rule',
      details: error.message,
    });
  }
});

// Update automation rule
router.put('/rules/:id', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const rule = await prisma.chatbotFlow.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Automation rule not found',
      });
    }

    const updated = await prisma.chatbotFlow.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update automation rule',
      details: error.message,
    });
  }
});

// Toggle automation rule
router.patch('/rules/:id/toggle', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const rule = await prisma.chatbotFlow.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Automation rule not found',
      });
    }

    const updated = await prisma.chatbotFlow.update({
      where: { id: req.params.id },
      data: { isActive: !rule.isActive },
    });

    res.json({
      success: true,
      message: `Automation ${updated.isActive ? 'activated' : 'deactivated'}`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle automation',
      details: error.message,
    });
  }
});

// Delete automation rule
router.delete('/rules/:id', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    await prisma.chatbotFlow.delete({
      where: { id: req.params.id, businessId: req.user.businessId },
    });

    res.json({ success: true, message: 'Automation rule deleted' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete automation rule',
      details: error.message,
    });
  }
});

// ==================== N8N INTEGRATION ====================

// Get n8n connection status
router.get('/n8n/status', async (req: any, res: any) => {
  try {
    const n8nUrl = process.env.N8N_URL || 'http://n8n:5678';

    try {
      const response = await axios.get(`${n8nUrl}/healthz`, { timeout: 5000 });
      res.json({
        success: true,
        data: {
          connected: true,
          url: n8nUrl,
          status: response.data,
        },
      });
    } catch {
      res.json({
        success: true,
        data: {
          connected: false,
          url: n8nUrl,
          message: 'n8n is not reachable',
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to check n8n status',
      details: error.message,
    });
  }
});

// Forward webhook to n8n workflow
router.post('/n8n/trigger/:workflowId', async (req: any, res: any) => {
  try {
    const { workflowId } = req.params;
    const n8nUrl = process.env.N8N_URL || 'http://n8n:5678';

    const response = await axios.post(
      `${n8nUrl}/webhook/${workflowId}`,
      req.body,
      { timeout: 30000 }
    );

    res.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('n8n trigger error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger n8n workflow',
      details: error.message,
    });
  }
});

// ==================== AUTO-REPLY TEMPLATES ====================

// Get auto-reply templates
router.get('/templates', async (req: any, res: any) => {
  try {
    const templates = await prisma.chatbotFlow.findMany({
      where: {
        businessId: req.user.businessId,
        triggerType: 'auto_reply',
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: templates });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
      details: error.message,
    });
  }
});

// ==================== BUSINESS AUTO-REPLY SETTINGS ====================

// Get auto-reply settings
router.get('/settings', async (req: any, res: any) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId },
      select: {
        autoReplyEnabled: true,
        autoReplyMessage: true,
        businessHours: true,
      },
    });

    res.json({ success: true, data: business });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings',
      details: error.message,
    });
  }
});

// Update auto-reply settings
router.put('/settings', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { autoReplyEnabled, autoReplyMessage, businessHours } = req.body;

    const business = await prisma.business.update({
      where: { id: req.user.businessId },
      data: {
        ...(autoReplyEnabled !== undefined && { autoReplyEnabled }),
        ...(autoReplyMessage !== undefined && { autoReplyMessage }),
        ...(businessHours !== undefined && { businessHours }),
      },
    });

    res.json({
      success: true,
      data: {
        autoReplyEnabled: business.autoReplyEnabled,
        autoReplyMessage: business.autoReplyMessage,
        businessHours: business.businessHours,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
      details: error.message,
    });
  }
});

export default router;
