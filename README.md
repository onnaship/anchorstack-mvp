# AnchorStack Production Next Step

Professional military finance app created by Duane Moore.

## New production step completed

This version adds the next production payment layer:

- Stripe Checkout
- Stripe Checkout session verification
- Stripe Customer Portal API
- Stripe webhook endpoint
- Local browser membership activation after verified Stripe success
- Email field for Stripe receipts
- Premium status in Settings
- Manage Premium button
- Updated health API

## Vercel settings

Application Preset: Vite  
Root Directory: ./  
Build Command: npm run build  
Output Directory: dist  
Install Command: npm install  

## Required Vercel environment variables

STRIPE_SECRET_KEY  
STRIPE_PRICE_ID  
STRIPE_MODE=subscription  
STRIPE_WEBHOOK_SECRET  

## Test routes

After deploying, test:

/api/health

You should see JSON that says the API routes are working.

## Stripe webhook URL

In Stripe Dashboard, add this endpoint:

https://YOUR-DOMAIN.com/api/stripe-webhook

Recommended events:

checkout.session.completed  
customer.subscription.created  
customer.subscription.updated  
customer.subscription.deleted  
invoice.payment_succeeded  
invoice.payment_failed  

## Important production note

This version verifies Stripe payment and stores Premium locally in the browser. For full production, add a database and authentication so premium access follows the user across devices.
