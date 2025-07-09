import 'express';

declare module 'express' {
  export interface Request {
    safaricom_access_token?: string;
  }
}
