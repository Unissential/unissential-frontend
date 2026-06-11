import { Router, Request, Response } from 'express';
import { authMiddleware, asyncHandler, validateRequest } from '@/middleware';
import { AuthController } from '@/controllers/auth.controller';
import { ListingController } from '@/controllers/listing.controller';
import { MarketplaceController } from '@/controllers/marketplace.controller';
import { RoommateController } from '@/controllers/roommate.controller';
import { HealthController } from '@/controllers/health.controller';
import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  createListingSchema,
  updateListingSchema,
  createMarketplaceProductSchema,
  updateMarketplaceProductSchema,
  createRoommateProfileSchema,
  updateRoommateProfileSchema,
} from '@/validations';

const router = Router();

// ==================== AUTH ROUTES ====================
const authRouter = Router();

authRouter.post('/signup', validateRequest(signupSchema), asyncHandler(AuthController.signup));
authRouter.post('/login', validateRequest(loginSchema), asyncHandler(AuthController.login));
authRouter.post('/verify-email', validateRequest(verifyEmailSchema), asyncHandler(AuthController.verifyEmail));
authRouter.post('/resend-verification', asyncHandler(AuthController.resendVerification));
authRouter.get('/me', authMiddleware, asyncHandler(AuthController.getMe));
authRouter.put('/profile', authMiddleware, asyncHandler(AuthController.updateProfile));

router.use('/auth', authRouter);

// ==================== LISTING ROUTES ====================
const listingRouter = Router();

listingRouter.get('/', asyncHandler(ListingController.getAll));
listingRouter.get('/user/:userId', asyncHandler(ListingController.getUserListings));
listingRouter.get('/:id', asyncHandler(ListingController.getById));
listingRouter.post('/', authMiddleware, validateRequest(createListingSchema), asyncHandler(ListingController.create));
listingRouter.put('/:id', authMiddleware, validateRequest(updateListingSchema), asyncHandler(ListingController.update));
listingRouter.patch('/:id/availability', authMiddleware, asyncHandler(ListingController.toggleAvailability));
listingRouter.delete('/:id', authMiddleware, asyncHandler(ListingController.delete));

router.use('/listings', listingRouter);

// ==================== MARKETPLACE ROUTES ====================
const marketplaceRouter = Router();

// Public routes
marketplaceRouter.get('/', asyncHandler(MarketplaceController.getAll));
marketplaceRouter.get('/user/:userId', asyncHandler(MarketplaceController.getUserProducts));

// Get product by ID must come after other specific routes
marketplaceRouter.get('/:id', asyncHandler(MarketplaceController.getById));

// Protected routes - specific routes before generic routes with parameters
marketplaceRouter.get('/:id/saved', authMiddleware, asyncHandler(MarketplaceController.isProductSaved));

// Create/update/delete
marketplaceRouter.post('/', authMiddleware, validateRequest(createMarketplaceProductSchema), asyncHandler(MarketplaceController.create));
marketplaceRouter.put('/:id', authMiddleware, validateRequest(updateMarketplaceProductSchema), asyncHandler(MarketplaceController.update));
marketplaceRouter.patch('/:id/sold', authMiddleware, asyncHandler(MarketplaceController.markSold));
marketplaceRouter.delete('/:id', authMiddleware, asyncHandler(MarketplaceController.delete));

// Save/unsave routes
marketplaceRouter.post('/:id/save', authMiddleware, asyncHandler(MarketplaceController.saveProduct));
marketplaceRouter.delete('/:id/save', authMiddleware, asyncHandler(MarketplaceController.unsaveProduct));

// Get saved products (authenticated user's saved products)
marketplaceRouter.get('/saved', authMiddleware, asyncHandler(MarketplaceController.getSavedProducts));

router.use('/marketplace', marketplaceRouter);

// ==================== ROOMMATE ROUTES ====================
const roommateRouter = Router();

roommateRouter.get('/', asyncHandler(RoommateController.getAll));
roommateRouter.get('/compatible', authMiddleware, asyncHandler(RoommateController.findCompatible));
roommateRouter.get('/:id', asyncHandler(RoommateController.getById));
roommateRouter.post('/', authMiddleware, validateRequest(createRoommateProfileSchema), asyncHandler(RoommateController.create));
roommateRouter.put('/', authMiddleware, validateRequest(updateRoommateProfileSchema), asyncHandler(RoommateController.update));
roommateRouter.delete('/', authMiddleware, asyncHandler(RoommateController.delete));
roommateRouter.get('/user/:userId', asyncHandler(RoommateController.getUserProfile));

router.use('/roommates', roommateRouter);

// ==================== HEALTH CHECK ====================
router.get('/health', asyncHandler(HealthController.getHealth));
router.get('/health/full', asyncHandler(HealthController.getHealthWithDatabase));
router.get('/health/db', asyncHandler(HealthController.getHealthDatabase));
router.get('/ready', asyncHandler(HealthController.getReady));
router.get('/live', asyncHandler(HealthController.getLive));

export default router;
