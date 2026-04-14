import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireBusinessOwner } from '../middleware/auth.js';
import axios from 'axios';
import { encrypt, decrypt } from '../utils/auth';

const router = Router();

// WhatsApp API base URL
const WHATSAPP_API_BASE = 'https://graph.facebook.com/v18.0';

// Helper to get business WhatsApp credentials
async function getWhatsAppCredentials(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { 
      waPhoneNumberId: true, 
      waAccessToken: true,
      waWebhookSecret: true 
    }
  });
  
  if (!business || !business.waPhoneNumberId || !business.waAccessToken) {
    throw new Error('WhatsApp not configured for this business');
  }
  
  return {
    phoneNumberId: business.waPhoneNumberId,
    accessToken: decrypt(business.waAccessToken),
  };
}

// WhatsApp webhook endpoint (public)
router.post('/webhook/:businessId', async (req: any, res: any) => {
  try {
    const { businessId } = req.params;
    const body = req.body;

    // Verify webhook
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || !business.waWebhookSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Handle verification (for Meta webhook setup)
    if (req.query['hub.verify_token']) {
      if (req.query['hub.verify_token'] === business.waWebhookSecret) {
        return res.send(req.query['hub.challenge']);
      }
      return res.status(403).send('Verification failed');
    }

    // Process incoming messages
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (value?.messages) {
      for (const message of value.messages) {
        // Find or create contact
        let contact = await prisma.contact.findFirst({
          where: {
            businessId,
            phone: message.from,
          },
        });

        if (!contact) {
          contact = await prisma.contact.create({
            data: {
              businessId,
              phone: message.from,
              source: 'whatsapp',
              whatsappOptIn: true,
            },
          });
        }

        // Save message
        const messageData: any = {
          businessId,
          contactId: contact.id,
          direction: 'inbound',
          type: message.type,
          status: 'received',
          waMessageId: message.id,
        };

        if (message.type === 'text') {
          messageData.content = message.text.body;
        } else if (message.type === 'image') {
          messageData.mediaUrl = message.image.id;
          messageData.content = message.image.caption;
        }

        await prisma.message.create({
          data: messageData,
        });

        // Update contact last activity
        await prisma.contact.update({
          where: { id: contact.id },
          data: { lastMessageAt: new Date() },
        });

        // Check if chatbot should respond
        const chatbotFlow = await prisma.chatbotFlow.findFirst({
          where: {
            businessId,
            isActive: true,
          },
        });

        if (chatbotFlow) {
          // Trigger chatbot response (async)
          // This would be handled by a queue in production
          console.log('Triggering chatbot for message:', message.id);
        }
      }
    }

    // Handle status updates
    if (value?.statuses) {
      for (const status of value.statuses) {
        await prisma.message.updateMany({
          where: {
            businessId,
            waMessageId: status.id,
          },
          data: {
            status: status.status,
            statusTimestamp: new Date(),
          },
        });
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get WhatsApp conversations
router.get('/conversations', authenticate, async (req: any, res: any) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const conversations = await prisma.contact.findMany({
      where: {
        businessId: req.user.businessId,
        source: 'whatsapp',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        lastMessageAt: true,
        _count: {
          select: { messages: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.contact.count({
      where: {
        businessId: req.user.businessId,
        source: 'whatsapp',
      },
    });

    res.json({
      success: true,
      data: {
        conversations,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations',
      details: error.message,
    });
  }
});

// Get conversation with a specific contact
router.get('/conversation/:contactId', authenticate, async (req: any, res: any) => {
  try {
    const { contactId } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        businessId: req.user.businessId,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        contactId,
        businessId: req.user.businessId,
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.message.count({
      where: {
        contactId,
        businessId: req.user.businessId,
      },
    });

    res.json({
      success: true,
      data: {
        contact,
        messages,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation',
      details: error.message,
    });
  }
});

// Send text message
router.post('/send/text', authenticate, async (req: any, res: any) => {
  try {
    const { contactId, content } = req.body;

    if (!contactId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Contact ID and content are required',
      });
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        businessId: req.user.businessId,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    if (!contact.phone) {
      return res.status(400).json({
        success: false,
        error: 'Contact has no phone number',
      });
    }

    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId },
    });

    if (!business?.waPhoneNumberId || !business?.waAccessToken) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp not configured for this business',
      });
    }

    // Decrypt access token before sending to API
    const accessToken = decrypt(business.waAccessToken);

    // Send via WhatsApp API
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${business.waPhoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: contact.phone,
        type: 'text',
        text: { body: content },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Save message to DB
    const message = await prisma.message.create({
      data: {
        businessId: req.user.businessId,
        contactId,
        direction: 'outbound',
        type: 'text',
        content,
        status: 'sent',
        waMessageId: response.data.messages?.[0]?.id,
      },
    });

    // Update business stats
    await prisma.business.update({
      where: { id: req.user.businessId },
      data: { totalMessages: { increment: 1 } },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        businessId: req.user.businessId,
        contactId,
        type: 'whatsapp_sent',
        content,
      },
    });

    res.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

// Send template message
router.post('/send/template', authenticate, async (req: any, res: any) => {
  try {
    const { contactId, templateName, languageCode = 'en', components } = req.body;

    if (!contactId || !templateName) {
      return res.status(400).json({
        success: false,
        error: 'Contact ID and template name are required',
      });
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        businessId: req.user.businessId,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found',
      });
    }

    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId },
    });

    if (!business?.waPhoneNumberId || !business?.waAccessToken) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp not configured',
      });
    }

    // Decrypt access token before sending to API
    const accessToken = decrypt(business.waAccessToken);

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${business.waPhoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: contact.phone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: components || [],
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const message = await prisma.message.create({
      data: {
        businessId: req.user.businessId,
        contactId,
        direction: 'outbound',
        type: 'template',
        templateName,
        templateLanguage: languageCode,
        status: 'sent',
        waMessageId: response.data.messages?.[0]?.id,
      },
    });

    res.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error('Send template error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send template message',
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

// Connect WhatsApp (Embedded Signup URL)
router.post('/connect', authenticate, requireBusinessOwner, async (req: any, res: any) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found',
      });
    }

    // Generate embedded signup URL
    // This would use Meta's Embedded Signup flow
    const signupUrl = `https://developers.facebook.com/dialog/whatsapp_business_api_embedded_signup?app_id=${process.env.META_APP_ID}&redirect_uri=${process.env.WHATSAPP_REDIRECT_URL}`;

    res.json({
      success: true,
      data: {
        signupUrl,
        message: 'Complete the signup flow to connect your WhatsApp Business number',
      },
    });
  } catch (error: any) {
    console.error('Connect WhatsApp error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate WhatsApp connection',
      details: error.message,
    });
  }
});

// Get WhatsApp templates
router.get('/templates', authenticate, async (req: any, res: any) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId },
    });

    if (!business?.waAccessToken) {
      return res.status(400).json({
        success: false,
        error: 'WhatsApp not configured',
      });
    }

    // Decrypt access token before sending to API
    const accessToken = decrypt(business.waAccessToken);

    // Fetch templates from Meta API
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${business.waPhoneNumberId}/message_templates`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    res.json({
      success: true,
      data: response.data.data || [],
    });
  } catch (error: any) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

export default router;
