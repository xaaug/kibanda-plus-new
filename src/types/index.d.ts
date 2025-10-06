/**
 * @file This file extends the Express `Request` interface to include a custom property.
 * @module types/express
 */
import 'express';

declare module 'express' {
  /**
   * Extends the Express `Request` interface to include the `safaricom_access_token`.
   * This allows the access token to be attached to the request object by middleware
   * and accessed in subsequent route handlers.
   */
  export interface Request {
    /**
     * The access token for the Safaricom API, obtained from the OAuth endpoint.
     * This is optional as it will only be present on routes protected by the
     * `accessToken` middleware.
     * @type {string | undefined}
     */
    safaricom_access_token?: string;
  }
}
