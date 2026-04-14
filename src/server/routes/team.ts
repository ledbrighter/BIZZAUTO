import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { hashPassword } from '../utils/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ==================== LIST TEAM MEMBERS ====================

router.get('/', async (req: any, res: any) => {
  try {
    const { page = '1', limit = '20', search, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = { businessId: req.user.businessId };
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('List team error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list team members',
      details: error.message,
    });
  }
});

// ==================== INVITE USER ====================

router.post('/invite', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { email, name, role, phone } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Check if user already exists in this business
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        businessId: req.user.businessId,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists in your business',
      });
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const hashedPassword = await hashPassword(tempPassword);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        phone,
        role: role || 'MEMBER',
        businessId: req.user.businessId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        tempPassword,
        message: 'User created successfully. Share the temporary password with them.',
      },
    });
  } catch (error: any) {
    console.error('Invite user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to invite user',
      details: error.message,
    });
  }
});

// ==================== CHANGE USER ROLE ====================

router.put('/:id/role', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { role } = req.body;

    if (!role || !['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be one of: OWNER, ADMIN, MEMBER, VIEWER',
      });
    }

    // Only OWNER can assign OWNER role
    if (role === 'OWNER' && req.user.role !== 'OWNER') {
      return res.status(403).json({
        success: false,
        error: 'Only the current owner can assign the owner role',
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        businessId: req.user.businessId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found in your business',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update role',
      details: error.message,
    });
  }
});

// ==================== REMOVE USER ====================

router.delete('/:id', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        businessId: req.user.businessId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found in your business',
      });
    }

    // Prevent removing the last OWNER
    if (user.role === 'OWNER') {
      const ownerCount = await prisma.user.count({
        where: {
          businessId: req.user.businessId,
          role: 'OWNER',
        },
      });

      if (ownerCount <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Cannot remove the last owner. Transfer ownership first.',
        });
      }
    }

    // Prevent self-deletion
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot remove yourself',
      });
    }

    await prisma.user.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'User removed successfully',
    });
  } catch (error: any) {
    console.error('Remove user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove user',
      details: error.message,
    });
  }
});

// ==================== RESET PASSWORD ====================

router.post('/:id/reset-password', requireRole('OWNER', 'ADMIN'), async (req: any, res: any) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        businessId: req.user.businessId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const hashedPassword = await hashPassword(tempPassword);

    await prisma.user.update({
      where: { id: req.params.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password reset successfully',
      tempPassword,
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      details: error.message,
    });
  }
});

// ==================== TRANSFER OWNERSHIP ====================

router.post('/transfer-ownership', requireRole('OWNER'), async (req: any, res: any) => {
  try {
    const { newOwnerId } = req.body;

    if (!newOwnerId) {
      return res.status(400).json({
        success: false,
        error: 'New owner ID is required',
      });
    }

    const newOwner = await prisma.user.findFirst({
      where: {
        id: newOwnerId,
        businessId: req.user.businessId,
      },
    });

    if (!newOwner) {
      return res.status(404).json({
        success: false,
        error: 'User not found in your business',
      });
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Demote current owner to ADMIN
      await tx.user.update({
        where: { id: req.user.id },
        data: { role: 'ADMIN' },
      });

      // Promote new user to OWNER
      await tx.user.update({
        where: { id: newOwnerId },
        data: { role: 'OWNER' },
      });
    });

    res.json({
      success: true,
      message: `Ownership transferred to ${newOwner.name || newOwner.email}`,
    });
  } catch (error: any) {
    console.error('Transfer ownership error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transfer ownership',
      details: error.message,
    });
  }
});

export default router;
