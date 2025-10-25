import express from 'express';
import {
  runSpfTest,
  runDkimTest,
  runDmarcTest,
  runSmtpTest,
  runBlacklistTest,
  getTestResults,
  getTestById,
} from '../controllers/test.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/spf', runSpfTest);
router.post('/dkim', runDkimTest);
router.post('/dmarc', runDmarcTest);
router.post('/smtp', runSmtpTest);
router.post('/blacklist', runBlacklistTest);
router.get('/results', getTestResults);
router.get('/results/:id', getTestById);

export default router;
