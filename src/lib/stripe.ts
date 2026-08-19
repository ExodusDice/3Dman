import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_secret_key';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20' as any,
  typescript: true,
});
