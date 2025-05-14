import express from 'express';
import { 
  getMyServices, 
  getServiceById, 
  createService, 
  updateService, 
  toggleServiceStatus, 
  deleteService 
} from '../controllers/serviceController.js';
import { protect, serviceProvider } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// All routes are protected and require authentication and service provider role
router.use(protect, serviceProvider);

// GET /api/services - Get all services for the logged-in provider
router.get('/', getMyServices);

// GET /api/services/:id - Get a specific service by ID
router.get('/:id', getServiceById);

// POST /api/services - Create a new service
router.post('/', upload.single('image'), createService);

// PUT /api/services/:id - Update a service
router.put('/:id', upload.single('image'), updateService);

// PATCH /api/services/:id/toggle-status - Toggle service status
router.patch('/:id/toggle-status', toggleServiceStatus);

// DELETE /api/services/:id - Delete a service
router.delete('/:id', deleteService);

export default router;