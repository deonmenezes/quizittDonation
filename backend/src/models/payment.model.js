import mongoose from 'mongoose';

const selfDonationSchema = new mongoose.Schema(
    {
        donorName: {
            type: String,
            required: true,
            trim: true,
            minlength: 1, // Ensure name is not empty
        },
        amount: {
            type: Number,
            required: true,
            min: 0, // Amount should be non-negative
        },
        currency: {
            type: String,
            default: 'INR', // Assuming INR for now
        },
        // You might want to add a status, e.g., 'reported', 'confirmed' (if you manually confirm later)
        status: {
            type: String,
            enum: ['reported', 'pending_verification', 'verified'], // Example statuses
            default: 'reported',
        },
        // Optional: Add a field to indicate the payment method user chose
        paymentMethodIndicated: {
            type: String,
            enum: ['upi', 'bank_transfer', 'other'],
            default: 'other',
        },
        // Optional: Add a timestamp for when the user reported the donation
        reportedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

const SelfDonation = mongoose.model('SelfDonation', selfDonationSchema);

export default SelfDonation;