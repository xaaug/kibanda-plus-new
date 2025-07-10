type Session = {
  chatId: number;
  phone: string;
  packageId: string;
  checkoutRequestId: string;
  timeout: NodeJS.Timeout;
};

export const sessions = new Map<number, Session>();

export function createPaymentSession(
  chatId: number,
  phone: string,
  packageId: string,
  checkoutRequestId: string,
  onTimeout: () => void,
  timeoutMs = 5 * 60 * 1000
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

export function clearPaymentSession(chatId: number) {
  const session = sessions.get(chatId);
  if (session) {
    clearTimeout(session.timeout);
    sessions.delete(chatId);
    console.log(`🗑️ Session cleared for chatId ${chatId}`);
  }
}

export function getPaymentSession(chatId: number): Session | undefined {
  return sessions.get(chatId);
}

export function findSessionByCheckoutId(checkoutId: string): Session | undefined {
  for (const [, session] of sessions.entries()) {
    if (session.checkoutRequestId === checkoutId) return session;
  }
  return undefined;
}
