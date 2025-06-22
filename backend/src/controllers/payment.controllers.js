import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/payment.model.js';
import dotenv from 'dotenv';

dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
    const { amount } = req.body; // Amount in rupees from frontend (e.g., 600 for ₹6)

    if (!amount || amount < 1) { // Check for minimum 1 Rupee (converted to paise below)
        return res.status(400).json({ message: 'Amount is required and must be at least ₹1.' });
    }

    const options = {
        amount: amount * 100, // <<-- This is where rupees are converted to paise
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
        notes: {
            purpose: 'Donation for Quizitt.com Education',
            source: 'web_donation_page'
        },
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        const newPayment = new Payment({
            razorpayOrderId: order.id,
            amount: order.amount, // amount in paise from Razorpay response
            currency: order.currency,
            status: order.status, // 'created'
        });
        await newPayment.save();
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Missing payment verification parameters.' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            // Fetch full payment details from Razorpay for robust verification
            const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);

            // Find the payment record in your database and update its status and other details
            const dbPayment = await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    razorpayPaymentId: razorpay_payment_id,
                    status: paymentDetails.status, // Should be 'captured' if successful
                    method: paymentDetails.method,
                    email: paymentDetails.email,
                    contact: paymentDetails.contact,
                    razorpaySignature: razorpay_signature, // Save signature for audit
                },
                { new: true }
            );

            if (!dbPayment) {
                console.warn(`Payment record not found for order ID: ${razorpay_order_id}. This should not happen if order creation saves.`);
                // Even if DB record not found, payment was authentic. Decide how to handle this.
                // For now, we'll return an error but acknowledge authenticity.
                return res.status(404).json({ message: 'Payment verified, but corresponding record not found in database for update.' });
            }

            res.status(200).json({ message: 'Payment verified successfully', payment: dbPayment });
        } catch (error) {
            console.error('Error fetching payment details or updating DB after verification:', error);
            res.status(500).json({ message: 'Payment verified, but failed to process details or update database.', error: error.message });
        }
    } else {
        res.status(400).json({ message: 'Payment verification failed: Signature mismatch' });
    }
};

export const getPaymentDetails = async (req, res) => {
    const { paymentId } = req.params;

    if (!paymentId) {
        return res.status(400).json({ message: 'Payment ID is required.' });
    }

    try {
        const payment = await Payment.findOne({ razorpayPaymentId: paymentId });

        if (payment) {
            return res.status(200).json(payment);
        }

        const razorpayPayment = await razorpayInstance.payments.fetch(paymentId);
        res.status(200).json(razorpayPayment);
    } catch (error) {
        console.error('Error fetching payment details:', error);
        if (error.statusCode === 400 && error.error.code === 'BAD_REQUEST_ERROR') {
            return res.status(404).json({ message: 'Payment not found or invalid Payment ID.' });
        }
        res.status(500).json({ message: 'Failed to fetch payment details', error: error.message });
    }
};