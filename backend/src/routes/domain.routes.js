import express from 'express';
import {
  createDomain,
  getDomains,
  getDomainById,
  updateDomain,
  deleteDomain,
  verifyDomain,
} from '../controllers/domain.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createDomain);
router.get('/', getDomains);
router.get('/:id', getDomainById);
router.put('/:id', updateDomain);
router.delete('/:id', deleteDomain);
router.post('/:id/verify', verifyDomain);

export default router;
