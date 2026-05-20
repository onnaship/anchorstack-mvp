import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: 'Missing STRIPE_SECRET_KEY in Vercel Environment Variables.'
    });
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return res.status(500).json({
      error: 'Missing STRIPE_PRICE_ID in Vercel Environment Variables.'
    });
  }

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;
    const mode = process.env.STRIPE_MODE || 'subscription';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${origin}/?paid=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?paid=cancel`
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Unable to create Stripe Checkout session.'
    });
  }
}
