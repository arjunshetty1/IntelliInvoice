

```markdown
# IntelliInvoice Backend

IntelliInvoice is a backend server for managing invoice generation and email communication. This repo provides the backend functionalities such as handling requests, parsing PDFs, and sending emails, built with Node.js, Express, and several other useful libraries.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Development](#development)
- [License](#license)

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/arjunshetty1/intelli-invoice-backend.git
   cd intelli-invoice-backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   Create a `.env` file in the root directory and add your environment variables (e.g., database URI, email credentials, etc.):

   ```
   MONGO_URI=your_mongo_database_uri
   EMAIL_HOST=your_email_service_host
   EMAIL_PORT=your_email_service_port
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   ```

   *Ensure you don't share this `.env` file in public repositories, and add it to `.gitignore` to keep it secure.*

## Usage

To run the server in production mode, use:

```bash
npm start
```

To run the server in development mode (with live reloading), use:

```bash
npm run dev
```

### Available Endpoints

- **POST /send-invoice** - Endpoint to send an invoice email.
- **POST /parse-pdf** - Endpoint to parse an uploaded PDF and extract text.

Please refer to the API documentation (if available) for detailed endpoint usage.

## Dependencies

This project uses the following dependencies:

- `express` - Web framework for Node.js.
- `mongoose` - MongoDB object modeling.
- `dotenv` - For loading environment variables from `.env` files.
- `nodemailer` - For sending emails.
- `node-imap` - To interact with email inboxes.
- `pdf-parse` - To parse and extract text from PDF files.
- `tesseract.js` - For OCR (optical character recognition) in case the PDFs are scanned images.
- `cors` - For enabling Cross-Origin Resource Sharing.

### Development Dependencies:

- `nodemon` - For automatically restarting the server during development.

## Development

To run the server in development mode, use:

```bash
npm run dev
```

This will run the server with `nodemon`, which automatically restarts the server whenever file changes are detected.
