function parseDate(val: number): string {
  return val < 10 ? '0' + val : val.toString();
}

export const getTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = parseDate(now.getMonth() + 1);
  const day = parseDate(now.getDate());
  const hour = parseDate(now.getHours());
  const minute = parseDate(now.getMinutes());
  const second = parseDate(now.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
};
