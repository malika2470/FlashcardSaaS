import { buffer } from 'micro';
import Stripe from 'stripe';
import { getAuth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    // Update the user's metadata in Clerk
    const { users } = getAuth();
    await users.updateUser(userId, {
      publicMetadata: {
        plan: plan,
      },
    });
  }

  res.status(200).json({ received: true });
}
