import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment, getPaymentDetails } from '../controllers/payment.controllers.js';

const router = express.Router();

router.post('/order', createRazorpayOrder);         // Frontend will POST to this
router.post('/verify-payment', verifyRazorpayPayment); // Frontend will POST to this after successful Razorpay payment

// You can keep this for testing, but it's not directly related to the fix
router.get('/details/:paymentId', getPaymentDetails);

export default router;