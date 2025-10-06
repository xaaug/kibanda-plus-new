/**
 * An array of subscription package objects available for users.
 *
 * Each object in the array represents a subscription package with its details.
 *
 * @property {string} id - A unique identifier for the package.
 * @property {string} name - The display name of the package.
 * @property {number} price - The price of the package.
 * @property {string} description - A short description of the package.
 * @property {string} type - The type of the package (e.g., 'one-time', 'weekly', 'monthly').
 * @property {number | null} duration - The duration of the subscription in milliseconds. `null` for one-time packages.
 * @property {number | null} contentLimit - The number of movies a user can access. `null` for unlimited access.
 */
export const subscriptionPackages = [
  {
    id: 'one-time',
    name: 'One-Time Access',
    price: 2,
    description: 'Access 1 movie. Expires after download.',
    type: 'one-time',
    duration: null,
    contentLimit: 1,
  },
  {
    id: 'weekly',
    name: 'Weekly Pass',
    price: 50,
    description: 'Unlimited access for 7 days.',
    type: 'weekly',
    duration: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    contentLimit: null,
  },
  {
    id: 'monthly',
    name: 'Monthly Pass',
    price: 100,
    description: 'Unlimited access for 30 days.',
    type: 'monthly',
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days
    contentLimit: null,
  }
];
