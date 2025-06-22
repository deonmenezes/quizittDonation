import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, getPaymentDetails, getAllPayments, getCampaignProgress } from '../controllers/payment.controllers.js';

const router = express.Router();

router.post('/order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);
router.get('/details/:paymentId', getPaymentDetails);
router.get('/payments', getAllPayments);
router.get('/campaign-progress', getCampaignProgress); // NEW ROUTE

export default router;