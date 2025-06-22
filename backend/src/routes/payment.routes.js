import express from 'express';
import { recordSelfDonation, getAllSelfDonations, getDonationCampaignProgress } from '../controllers/payment.controllers.js';

const router = express.Router();

// Route to handle self-reported donations from the frontend
// This is the endpoint the "I've Completed My Donation!" button will hit.
router.post('/report-donation', recordSelfDonation);

// Route to get all self-reported donations (e.g., for an admin dashboard)
router.get('/reported-donations', getAllSelfDonations);

// Route to get aggregated campaign progress (total raised, donor count)
router.get('/campaign-progress', getDonationCampaignProgress);

export default router;