import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY in Vercel Environment Variables.' });
  }

  const sessionId = req.query.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id.' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    const subscriptionStatus =
      typeof session.subscription === 'object' && session.subscription
        ? session.subscription.status
        : session.payment_status;

    const customerEmail =
      session.customer_details?.email ||
      (typeof session.customer === 'object' && session.customer ? session.customer.email : '') ||
      session.customer_email ||
      '';

    return res.status(200).json({
      paid: session.payment_status === 'paid',
      mode: session.mode,
      customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id || '',
      customerEmail,
      subscriptionStatus,
      metadata: session.metadata || {}
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to verify Stripe Checkout session.' });
  }
}
