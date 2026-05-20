# AnchorStack Functional Stripe App

This version includes:

- Working PCS budget calculator
- Working deployment savings tracker
- Working budget planner
- Local device saving with localStorage
- Premium subscription button
- Vercel serverless Stripe Checkout endpoint
- Accessibility fixes

## Vercel settings

Application Preset: Vite  
Root Directory: ./  
Build Command: npm run build  
Output Directory: dist  
Install Command: npm install  

## Required Vercel Environment Variables

Go to Vercel → Your Project → Settings → Environment Variables.

Add:

```text
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_stripe_price_id
STRIPE_MODE=subscription
```

Then redeploy.

## Stripe setup for payouts to your bank

1. Create or log in to Stripe.
2. Complete identity/business verification.
3. Add your bank account in Stripe Dashboard → Settings → Business → External payout accounts and scheduling.
4. Create a Product named AnchorStack Premium.
5. Create a recurring monthly Price for $7.99.
6. Copy the Price ID, starting with `price_`, into Vercel as `STRIPE_PRICE_ID`.
7. Copy your Stripe secret key, starting with `sk_test_` for testing or `sk_live_` for live mode, into Vercel as `STRIPE_SECRET_KEY`.
8. Redeploy the Vercel project.

Stripe collects customer payments, then pays out to the bank account attached to your Stripe account based on your payout schedule. Do not paste your bank routing/account numbers into this app or into GitHub.

## Testing

In Stripe test mode, use the card number:

```text
4242 4242 4242 4242
```

Use any future expiration date and any three-digit CVC.

## Important production note

This MVP unlocks premium locally after a successful checkout redirect. For a real paid member system across devices, add user login and a database, then use Stripe webhooks to store subscription status securely.
