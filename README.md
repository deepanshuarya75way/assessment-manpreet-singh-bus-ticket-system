# Bus Ticket System

A web-based bus ticketing system for generating, printing, and verifying bus tickets digitally.

The system provides separate access for conductors and checkers. Conductors can generate tickets with passenger and journey details, while checkers can verify tickets using the ticket QR code.

## Features

- Conductor and checker login
- Generate bus tickets
- Calculate ticket fare
- Generate QR code for each ticket
- Print generated tickets
- Scan and verify tickets using QR code
- Verify tickets using ticket ID
- Store ticket information in MongoDB
- Responsive web interface

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML
- CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### QR Code
- QR code generation
- QR code scanning
- Browser-based ticket verification

## Project Structure

```text
bus-ticket-system/
├── frontend/
├── backend/
├── package.json
└── package-lock.json
