type Session = {
  chatId: number;
  phone: string;
  packageId: string;
  checkoutRequestId: string;
  timeout: NodeJS.Timeout;
};

const sessions = new Map<number, Session>();

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

  sessions.set(chatId, {
    chatId,
    phone,
    packageId,
    checkoutRequestId,
    timeout,
  });
}

export function clearPaymentSession(chatId: number) {
  const session = sessions.get(chatId);
  if (session) {
    clearTimeout(session.timeout);
    sessions.delete(chatId);
  }
}

export function getPaymentSession(chatId: number): Session | undefined {
  return sessions.get(chatId);
}
