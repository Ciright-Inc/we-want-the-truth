import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripe) stripe = new Stripe(key, { typescript: true });
  return stripe;
}

/** Product/price IDs — configure in Stripe Dashboard and env for production */
export const STRIPE_PRODUCT_KEYS = {
  advancedAdmin: process.env.STRIPE_PRICE_ADVANCED_ADMIN,
  videoManagement: process.env.STRIPE_PRICE_VIDEO,
  commentManagement: process.env.STRIPE_PRICE_COMMENTS,
  domainSetup: process.env.STRIPE_PRICE_DOMAIN_SETUP,
} as const;
