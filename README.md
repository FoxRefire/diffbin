# Diffbin

A Pastebin-like diff sharing site. Store encrypted data client-side and view diffs through text input or file upload.

## Features

- **Text Input**: Enter two texts directly to view the diff
- **File Upload**: Upload two files to view the diff
- **Client-Side Encryption**: Encrypt data with AES-256-GCM (only encrypted data is stored on the server)
- **Multiple View Formats**: View diffs in three formats: Unified, Side-by-Side, and Inline
- **Secure**: Encryption keys are included in URL fragments and are never sent to the server

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (development) / PostgreSQL (recommended for production)
- **Encryption**: Web Crypto API (AES-256-GCM)
- **Diff Calculation**: diff-match-patch

## Setup

### Requirements

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and set the following environment variables:

```env
API_BASE_URL=http://localhost:3001
PORT=3001
DATABASE_PATH=./data/diffbin.db
```

### Starting the Development Server

1. Start the backend server:

```bash
npm run dev:server
```

2. Start the frontend in a separate terminal:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Text Input Mode**:
   - Enter the old text and new text in the respective input fields
   - Use the upload buttons next to each field to upload files
   - The diff preview will appear on the right side
   - Click "Create Diff" to save

2. **File Upload Mode**:
   - Click the upload button next to "Old Text" or "New Text"
   - Select a file to upload
   - The file content will be automatically loaded into the text area
   - Repeat for the other field
   - The diff preview will update automatically
   - Click "Create Diff" to save

3. **Viewing Diffs**:
   - After creating a post, you will be automatically redirected to the diff view page
   - Choose from three formats: Unified, Side-by-Side, or Inline
   - The URL contains the encryption key, so sharing this URL allows others to view the diff

## Security

- Data is encrypted client-side using AES-256-GCM
- Encryption keys are never sent to the server and are included in URL fragments
- Only encrypted data is stored on the server
- HTTPS usage is recommended

## Project Structure

```
diffbin/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── posts/             # Post view page
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── DiffViewer.tsx     # Diff viewer component
│   ├── FileUpload.tsx     # File upload component
│   └── TextInput.tsx      # Text input component
├── lib/                   # Utilities
│   ├── crypto.ts          # Encryption/decryption
│   └── diff.ts            # Diff calculation
└── server/                # Express backend
    ├── db/                # Database
    ├── models/            # Data models
    ├── routes/            # API routes
    └── index.ts           # Server entry point
```
