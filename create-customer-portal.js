import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY in Vercel Environment Variables.' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const origin = req.headers.origin || `https://${req.headers.host}`;

    if (!body.customerId) {
      return res.status(400).json({ error: 'Missing Stripe customerId. Complete checkout first.' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: body.customerId,
      return_url: `${origin}/?portal=return`
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to create Stripe customer portal session.' });
  }
}
