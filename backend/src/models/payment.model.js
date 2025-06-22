// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true }, // Amount in paise
    currency: { type: String, required: true, default: 'INR' },
    status: { type: String, default: 'created' },
    method: { type: String },
    email: { type: String },
    contact: { type: String },
    razorpaySignature: { type: String, sparse: true },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;