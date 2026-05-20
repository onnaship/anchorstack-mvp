export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    app: 'AnchorStack',
    creator: 'Duane Moore',
    version: '4.0.0',
    features: [
      'Stripe Checkout',
      'Stripe Session Verification',
      'Stripe Customer Portal',
      'Stripe Webhook Endpoint',
      'Local Profile Membership State'
    ],
    message: 'Vercel API routes are working.'
  });
}
