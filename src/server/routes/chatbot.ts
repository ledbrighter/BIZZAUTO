import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get chatbot flows
router.get('/', authenticate, async (req: any, res: any) => {
  try {
    const flows = await prisma.chatbotFlow.findMany({
      where: { businessId: req.user.businessId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: flows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch flows', details: error.message });
  }
});

// Create chatbot flow
router.post('/', authenticate, async (req: any, res: any) => {
  try {
    const { name, triggerType, triggerValue, flowData, nodes, edges } = req.body;
    const flow = await prisma.chatbotFlow.create({
      data: {
        businessId: req.user.businessId,
        name,
        triggerType,
        triggerValue,
        flowData: flowData || {},
        nodes: nodes || [],
        edges: edges || [],
      },
    });
    res.status(201).json({ success: true, data: flow });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create flow', details: error.message });
  }
});

// Update chatbot flow
router.put('/:id', authenticate, async (req: any, res: any) => {
  try {
    const flow = await prisma.chatbotFlow.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    });
    if (!flow) return res.status(404).json({ success: false, error: 'Flow not found' });

    const updated = await prisma.chatbotFlow.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update flow', details: error.message });
  }
});

// Toggle chatbot flow
router.post('/:id/toggle', authenticate, async (req: any, res: any) => {
  try {
    const flow = await prisma.chatbotFlow.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    });
    if (!flow) return res.status(404).json({ success: false, error: 'Flow not found' });

    const updated = await prisma.chatbotFlow.update({
      where: { id: req.params.id },
      data: { isActive: !flow.isActive },
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to toggle flow', details: error.message });
  }
});

// Delete chatbot flow
router.delete('/:id', authenticate, async (req: any, res: any) => {
  try {
    const flow = await prisma.chatbotFlow.findFirst({
      where: { id: req.params.id, businessId: req.user.businessId },
    });
    if (!flow) return res.status(404).json({ success: false, error: 'Flow not found' });

    await prisma.chatbotFlow.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Flow deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to delete flow', details: error.message });
  }
});

export default router;
