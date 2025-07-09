
import dotenv from 'dotenv';
import path from 'path';

if (!process.env._ENV_ALREADY_LOADED) {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env'),
  });

  process.env._ENV_ALREADY_LOADED = 'true';
}
