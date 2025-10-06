/**
 * Formats a number by adding a leading zero if it is less than 10.
 *
 * This is a helper function used to ensure that date and time components
 * are always two digits long (e.g., '09' instead of '9').
 *
 * @param {number} val - The number to format.
 * @returns {string} The formatted string.
 */
function parseDate(val: number): string {
  return val < 10 ? '0' + val : val.toString();
}

/**
 * Generates a timestamp in the format YYYYMMDDHHMMSS.
 *
 * This specific format is required by the Safaricom M-Pesa API for creating
 * the password and for the transaction timestamp.
 *
 * @returns {string} The formatted timestamp string.
 */
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
