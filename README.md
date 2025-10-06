# Kibanda Plus Bot

Kibanda Plus is a Telegram-based bot that allows users to subscribe to a movie service using M-Pesa for payments. It provides a seamless way for users to choose a subscription package, pay via an STK push, and gain access to content.

## 🌟 Features

- **Telegram Bot Interface**: Easy-to-use commands for interacting with the service.
- **Subscription Packages**: Offers multiple subscription tiers (e.g., one-time, weekly, monthly).
- **M-Pesa Integration**: Secure and automated payment handling via Safaricom's M-Pesa STK push.
- **Express API for Callbacks**: A dedicated server to handle payment callbacks from the M-Pesa API.
- **MongoDB Integration**: For persisting user and subscription data.
- **TypeScript**: A fully typed codebase for better developer experience and robustness.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)
- [ngrok](https://ngrok.com/) (for exposing the local callback server to the internet during development)

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd kibanda-plus-new
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables.

    ```env
    # Telegram Bot
    BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"

    # MongoDB
    MONGO_URI="YOUR_MONGODB_CONNECTION_STRING"

    # Safaricom M-Pesa API
    SAFARICOM_CONSUMER_KEY="YOUR_SAFARICOM_APP_CONSUMER_KEY"
    SAFARICOM_CONSUMER_SECRET="YOUR_SAFARICOM_APP_CONSUMER_SECRET"
    BUSINESS_SHORT_CODE="YOUR_MPESA_PAYBILL_OR_TILL_NUMBER"
    PASS_KEY="YOUR_MPESA_PASS_KEY"
    CALLBACK_URL="YOUR_PUBLICLY_ACCESSIBLE_CALLBACK_URL" # e.g., from ngrok

    # Optional
    MPESA_BASE_URL="https://sandbox.safaricom.co.ke" # Use sandbox for testing
    PORT=3500 # Port for the M-Pesa callback server
    ```

    **Note on `CALLBACK_URL`**: For local development, you need to expose your local server to the internet. You can use `ngrok` for this:
    ```bash
    ngrok http 3500
    ```
    `ngrok` will give you a public URL (e.g., `https://abcdef123456.ngrok.io`). Use this as your `CALLBACK_URL`.

## 🚀 Running the Application

### Development
For development with hot-reloading, run the bot and the M-Pesa server concurrently:
```bash
npm run dev:all
```
This command will:
- Start the Telegram bot using `ts-node-dev`.
- Start the M-Pesa Express server using `ts-node-dev`.

### Production
1.  **Build the TypeScript code:**
    ```bash
    npm run build
    ```
    This compiles the TypeScript files from `src/` into JavaScript in the `dist/` directory.

2.  **Start the application:**
    ```bash
    npm start
    ```
    This command runs the main M-Pesa server entry point from the compiled code. The bot itself is launched within this process.

## 🤖 How It Works

1.  **User Interaction**: A user starts the bot and uses the `/subscribe` command.
2.  **Package Selection**: The bot displays available subscription packages as inline keyboard buttons.
3.  **Phone Number Request**: After the user selects a package, the bot asks for their M-Pesa phone number.
4.  **STK Push**: The backend sends an STK push request to the Safaricom API, which triggers a payment prompt on the user's phone.
5.  **Payment Callback**: Once the user completes (or cancels) the payment, Safaricom sends a callback to the `CALLBACK_URL`.
6.  **Confirmation**: The Express server handles the callback, verifies the payment status, and notifies the user via the bot whether the subscription was successful.

## 📂 Project Structure

```
.
├── src/
│   ├── bot/                # Core bot logic
│   │   ├── commands/       # Handlers for bot commands (/start, etc.)
│   │   ├── handlers/       # Handlers for bot actions (button clicks, etc.)
│   │   └── mpesa/          # M-Pesa Express server and API logic
│   ├── config/             # Environment variables, packages config
│   ├── services/           # Business logic services (payment sessions, STK push)
│   ├── types/              # TypeScript type definitions
│   ├── webhooks/           # Logic for handling incoming webhooks/callbacks
│   └── index.ts            # Main application entry point
├── .env.example            # Example environment file
├── package.json
└── tsconfig.json
```