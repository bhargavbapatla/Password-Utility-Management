import express from 'express';
import { checkPasswordBreach } from '../services/vulnerabilityService.js';

const router = express.Router();

router.post('/check-breach', checkPasswordBreach);

export default router;