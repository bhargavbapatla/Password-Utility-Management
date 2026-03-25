import express from 'express';
import { checkPasswordBreach } from '../services/vulnerabilityService.js';
import { generatePassword } from '../services/passwordGeneratorService.js';
import { sendToSlack } from '../services/slackService.js';

const router = express.Router();

router.post('/check-breach', checkPasswordBreach);
router.post('/generate-password', generatePassword);
router.post('/send-to-slack', sendToSlack);

export default router;
