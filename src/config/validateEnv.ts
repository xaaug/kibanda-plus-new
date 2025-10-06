/**
 * Retrieves the value of an environment variable and ensures it is not undefined.
 *
 * This function gets the value of an environment variable by its key.
 * If the value is not found (i.e., it's `undefined` or `null`), it throws an error
 * to prevent the application from running with missing configuration.
 *
 * @param {string} key - The key of the environment variable to retrieve.
 * @returns {string} The value of the environment variable.
 * @throws {Error} If the environment variable is not set.
 */
export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Environment variable ${key} is missing`);
  }
  return value;
};
