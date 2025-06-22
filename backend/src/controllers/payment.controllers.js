import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/payment.model.js'; // Assuming you have a Payment model
import dotenv from 'dotenv';

dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
    const { amount, donorName } = req.body; // Receive donorName from frontend

    if (!amount || amount < 1) {
        return res.status(400).json({ message: 'Amount is required and must be at least ₹1.' });
    }

    if (!donorName) { // Validate donorName
        return res.status(400).json({ message: 'Donor name is required.' });
    }

    const options = {
        amount: amount * 100, // Convert rupees to paise
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
        notes: {
            purpose: 'Donation for Quizitt.com Education',
            source: 'web_donation_page',
            donorName: donorName // Store donor name in Razorpay notes (optional, but good for reference)
        },
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        const newPayment = new Payment({
            razorpayOrderId: order.id,
            amount: order.amount, // amount in paise from Razorpay response
            currency: order.currency,
            status: order.status, // 'created'
            donorName: donorName // Store donor name in your database
        });
        await newPayment.save();
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donorName } = req.body; // Also receive donorName here to re-associate

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
                    razorpaySignature: razorpay_signature, // Save signature for audit
                    donorName: donorName // Update donor name in case it wasn't saved or needs confirmation
                },
                { new: true }
            );

            if (!dbPayment) {
                console.warn(`Payment record not found for order ID: ${razorpay_order_id}. This should not happen if order creation saves.`);
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

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({}); // Find all payments in the database
        res.status(200).json(payments); // Send the list of payments as a response
    } catch (error) {
        console.error('Error fetching all payments:', error);
        res.status(500).json({ message: 'Failed to fetch all payments', error: error.message });
    }
};

// NEW CONTROLLER FUNCTION FOR CAMPAIGN PROGRESS
export const getCampaignProgress = async (req, res) => {
    try {
        // Find all successfully captured payments
        const capturedPayments = await Payment.find({ status: 'captured' });

        let totalRaisedAmount = 0;
        const uniqueDonors = new Set();

        capturedPayments.forEach(payment => {
            totalRaisedAmount += payment.amount; // amount is already in paise, sum it up
            if (payment.donorName) {
                uniqueDonors.add(payment.donorName.toLowerCase()); // Use lowercase for uniqueness
            }
        });

        // Convert totalRaisedAmount from paise to rupees for display
        const totalRaisedRupees = totalRaisedAmount / 100;

        res.status(200).json({
            totalRaised: totalRaisedRupees,
            donorCount: uniqueDonors.size,
            // You can optionally add a 'goal' here if it's dynamic, or keep it static on the frontend
            // For now, it's better to keep the 'goal' in the frontend's static props unless it's a dynamic setting in your backend.
        });

    } catch (error) {
        console.error('Error fetching campaign progress:', error);
        res.status(500).json({ message: 'Failed to fetch campaign progress', error: error.message });
    }
};