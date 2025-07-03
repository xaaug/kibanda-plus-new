export const subscriptionPackages = [
  {
    id: 'one-time',
    name: '🎟️ One-Time Access',
    price: 10,
    description: 'Access 1 movie. Expires after download.',
    type: 'one-time',
    duration: null,
    contentLimit: 1,
  },
  {
    id: 'weekly',
    name: '🗓️ Weekly Pass',
    price: 50,
    description: 'Unlimited access for 7 days.',
    type: 'weekly',
    duration: 7 * 24 * 60 * 60 * 1000,
    contentLimit: null,
  },
  {
    id: 'monthly',
    name: '📅 Monthly Pass',
    price: 100,
    description: 'Unlimited access for 30 days.',
    type: 'monthly',
    duration: 30 * 24 * 60 * 60 * 1000,
    contentLimit: null,
  }
];
