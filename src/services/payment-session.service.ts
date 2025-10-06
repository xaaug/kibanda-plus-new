/**
 * Represents a user's payment session.
 *
 * This object stores all the necessary information about a pending payment,
 * including user details, the selected package, and a timeout handle.
 *
 * @typedef {object} Session
 * @property {number} chatId - The Telegram chat ID of the user.
 * @property {string} phone - The user's M-Pesa phone number.
 * @property {string} packageId - The ID of the subscription package being purchased.
 * @property {string} checkoutRequestId - The CheckoutRequestID from the M-Pesa STK push.
 * @property {NodeJS.Timeout} timeout - The timeout handle for the session's expiration.
 */
type Session = {
  chatId: number;
  phone: string;
  packageId: string;
  checkoutRequestId: string;
  timeout: NodeJS.Timeout;
};

/**
 * A map that stores active payment sessions, with the chat ID as the key.
 * @type {Map<number, Session>}
 */
export const sessions = new Map<number, Session>();

/**
 * Creates and stores a new payment session for a user.
 *
 * This function clears any existing session for the user, sets a timeout
 * for the new session, and then stores the session details in the `sessions` map.
 *
 * @param {number} chatId - The user's chat ID.
 * @param {string} phone - The user's phone number.
 * @param {string} packageId - The ID of the selected package.
 * @param {string} checkoutRequestId - The CheckoutRequestID from the STK push.
 * @param {() => void} onTimeout - A callback function to execute when the session expires.
 * @param {number} [timeoutMs=300000] - The session duration in milliseconds (defaults to 5 minutes).
 */
export function createPaymentSession(
  chatId: number,
  phone: string,
  packageId: string,
  checkoutRequestId: string,
  onTimeout: () => void,
  timeoutMs = 5 * 60 * 1000 // 5 minutes
) {
  clearPaymentSession(chatId);

  const timeout = setTimeout(() => {
    onTimeout();
    sessions.delete(chatId);
  }, timeoutMs);

  const session: Session = {
    chatId,
    phone,
    packageId,
    checkoutRequestId,
    timeout,
  };

  sessions.set(chatId, session);
  console.log('🧾 Session created:', session);
}

/**
 * Clears an active payment session for a given chat ID.
 *
 * This function stops the session's timeout and removes it from the `sessions` map.
 *
 * @param {number} chatId - The chat ID for which to clear the session.
 */
export function clearPaymentSession(chatId: number) {
  const session = sessions.get(chatId);
  if (session) {
    clearTimeout(session.timeout);
    sessions.delete(chatId);
    console.log(`🗑️ Session cleared for chatId ${chatId}`);
  }
}

/**
 * Retrieves a payment session by chat ID.
 *
 * @param {number} chatId - The chat ID of the session to retrieve.
 * @returns {Session | undefined} The session object if found, otherwise undefined.
 */
export function getPaymentSession(chatId: number): Session | undefined {
  return sessions.get(chatId);
}

/**
 * Finds a payment session by its M-Pesa CheckoutRequestID.
 *
 * @param {string} checkoutId - The CheckoutRequestID to search for.
 * @returns {Session | undefined} The session object if found, otherwise undefined.
 */
export function findSessionByCheckoutId(checkoutId: string): Session | undefined {
  for (const [, session] of sessions.entries()) {
    if (session.checkoutRequestId === checkoutId) return session;
  }
  return undefined;
}
