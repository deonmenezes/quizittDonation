import SelfDonation from '../models/payment.model.js';

// Controller to record a self-reported donation
export const recordSelfDonation = async (req, res) => {
    const { donorName, amount, paymentMethodIndicated } = req.body;

    // Basic validation
    if (!donorName || donorName.trim() === '') {
        return res.status(400).json({ message: 'Donor name is required.' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'A valid donation amount (greater than 0) is required.' });
    }
    // paymentMethodIndicated is optional for now, but good to capture if available
    const validPaymentMethods = ['upi', 'bank_transfer', 'other'];
    if (paymentMethodIndicated && !validPaymentMethods.includes(paymentMethodIndicated)) {
        return res.status(400).json({ message: 'Invalid payment method indicated.' });
    }

    try {
        const newSelfDonation = new SelfDonation({
            donorName,
            amount,
            paymentMethodIndicated: paymentMethodIndicated || 'other', // Default to 'other' if not provided
            status: 'reported', // Initial status when user clicks "I've Completed My Donation!"
        });

        await newSelfDonation.save();

        res.status(201).json({
            message: 'Thank you for reporting your donation! Your support is greatly appreciated.',
            donation: newSelfDonation,
        });
    } catch (error) {
        console.error('Error recording self-reported donation:', error);
        res.status(500).json({ message: 'Failed to record donation. Please try again.', error: error.message });
    }
};

// Controller to get all self-reported donations (for admin/tracking)
export const getAllSelfDonations = async (req, res) => {
    try {
        const donations = await SelfDonation.find({}).sort({ reportedAt: -1 }); // Sort by most recent
        res.status(200).json(donations);
    } catch (error) {
        console.error('Error fetching all self-reported donations:', error);
        res.status(500).json({ message: 'Failed to fetch donations.', error: error.message });
    }
};

// Controller to get total amount raised and donor count from self-reported donations
export const getDonationCampaignProgress = async (req, res) => {
    try {
        // Aggregate to sum amounts and count unique donors
        const result = await SelfDonation.aggregate([
            {
                $group: {
                    _id: null, // Group all documents together
                    totalRaised: { $sum: "$amount" },
                    uniqueDonors: { $addToSet: "$donorName" } // Get unique donor names
                }
            }
        ]);

        let totalRaised = 0;
        let donorCount = 0;

        if (result.length > 0) {
            totalRaised = result[0].totalRaised;
            donorCount = result[0].uniqueDonors.length;
        }

        res.status(200).json({
            totalRaised,
            donorCount,
            message: "Campaign progress fetched successfully."
        });

    } catch (error) {
        console.error('Error fetching donation campaign progress:', error);
        res.status(500).json({ message: 'Failed to fetch campaign progress.', error: error.message });
    }
};