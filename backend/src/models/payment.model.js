// payment.model.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
    },
    razorpayPaymentId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values, but still unique if present
    },
    razorpaySignature: {
        type: String,
        sparse: true,
    },
    amount: {
        type: Number, // Stored in paise
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: 'INR',
    },
    status: {
        type: String, // e.g., 'created', 'captured', 'failed'
        required: true,
    },
    donorName: { // Added donorName field
        type: String,
        required: true, // Make it required if you always expect a name
    },
    method: { // Payment method, e.g., 'netbanking', 'card', 'upi'
        type: String,
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;