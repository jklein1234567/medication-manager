# Medication Manager – Backend

This is the backend for the Medication Manager app, built using AWS Lambda, API Gateway, DynamoDB, and TypeScript. It is designed to be serverless and easily deployable via the Serverless Framework.

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── handlers/              # Lambda handler functions
│   ├── lib/                   # Utility functions and shared logic
│   ├── models/                # Type definitions and interfaces
│   └── config.ts              # Environment configuration
├── tests/                     # Unit tests for Lambda functions
├── serverless.ts              # Serverless Framework config
├── tsconfig.json              # TypeScript config
└── README.md                  # You're here!
```

---

## 🚀 Setup & Deployment

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure AWS Credentials

Ensure you’ve set up your AWS credentials locally. You can configure them using:

```bash
aws configure
```

Or set environment variables:

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 3. Deploy to AWS

Use the Serverless Framework to deploy:

```bash
npx serverless deploy
```

This will deploy all your Lambda functions, API Gateway routes, and DynamoDB tables defined in `serverless.ts`.

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```
REGION=us-east-1
DYNAMO_DB_TABLE=MedicationTable
```

Make sure `.env` is listed in your `.gitignore`.

---

## 📡 API Endpoints

These are set up via API Gateway and deployed by Serverless:

- `POST /users` – create a user
- `GET /users` – list users
- `GET /users/{id}` – get user by ID
- `POST /medications` – add a medication
- `GET /medications/{userId}` – get all medications for a user
- `PUT /medications/mark-as-taken/{id}` – update take log
- `PUT /medications/toggle-active/{id}` – toggle isActive field

---

## 🧪 Running Tests

```bash
npm run test
```

Make sure all test files are inside the `tests/` directory.

---

## 📦 Requirements

- Node.js v18+
- AWS CLI
- Serverless Framework (`npm install -g serverless`)
- An AWS account with sufficient IAM permissions

---

## 🗝️ API Key (Optional)

If your API Gateway requires an API key, follow these steps:

1. Go to the AWS API Gateway Console
2. Select your deployed API
3. Go to **Stages** → choose your stage
4. Under **Settings**, enable **API Key Required**
5. Go to **API Keys** and create a new key
6. Attach it to a usage plan and link it to the deployed stage

Update your frontend `.env` file with:

```
VITE_API_KEY=your-key-here
```

And make sure the frontend sends the key in request headers if needed.

---

## 💬 Questions?

Feel free to reach out or open an issue if something doesn't work as expected.