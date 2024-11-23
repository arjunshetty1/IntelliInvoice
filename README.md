```markdown
# IntelliInvoice Backend

IntelliInvoice is a backend server for managing invoice generation and email communication. It is built using Node.js, Express, and several other libraries for functionality like email handling, PDF parsing, and OCR.

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/arjunshetty1/IntelliInvoice.git
   cd IntelliInvoice
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   Create a `.env` file in the root directory and add the necessary environment variables (e.g., database URI, email credentials, etc.):

   ```
   MONGO_URI=your_mongo_database_uri
   EMAIL_HOST=your_email_service_host
   EMAIL_PORT=your_email_service_port
   EMAIL_USER=your_email_username
   EMAIL_PASS=your_email_password
   ```

   *Make sure the `.env` file is added to `.gitignore`.*

## Usage

To run the server in production mode:

```bash
npm start
```

To run the server in development mode (with live reloading):

```bash
npm run dev
```

## Dependencies

- `express`: Web framework for Node.js
- `mongoose`: MongoDB object modeling
- `dotenv`: For loading environment variables
- `nodemailer`: For sending emails
- `node-imap`: For email inbox interactions
- `pdf-parse`: For parsing PDFs
- `tesseract.js`: For OCR (Optical Character Recognition)
- `cors`: For enabling Cross-Origin Resource Sharing

### Development Dependencies

- `nodemon`: For automatic server restarts during development.
