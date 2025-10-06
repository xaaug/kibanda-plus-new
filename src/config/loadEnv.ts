
/**
 * Loads environment variables from a .env file into process.env.
 *
 * This script uses the `dotenv` package to load environment variables from a .env file
 * located in the root of the project. It ensures that the environment variables are
 * loaded only once by checking for a custom flag `_ENV_ALREADY_LOADED` in `process.env`.
 *
 * @module config/loadEnv
 */

import dotenv from 'dotenv';
import path from 'path';

if (!process.env._ENV_ALREADY_LOADED) {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
  });

  process.env._ENV_ALREADY_LOADED = 'true';
}
