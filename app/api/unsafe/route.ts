import { clerkClient } from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { plan, userId } = req.body;

  await clerkClient.users.updateUserMetadata(userId, {
    unsafeMetadata: {
      plan,
    },
  });

  res.status(200).json({ success: true });
}
