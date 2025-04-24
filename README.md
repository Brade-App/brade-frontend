# Brade - AI Financial Assistant

Brade is a financial management application designed initially for salon owners. It helps track expenses, revenues, and financial goals while providing AI-powered insights through BradeBot.

## Features

- **User Authentication**

  - Secure sign-up and login
  - OAuth 2.0 integration with major payment processors:
    - Stripe, Square, SumUp for revenue data sync
    - GoCardless for expense data sync
  - Test account available (test@bradehq.com / Test123)

- **Dashboard**

  - Overview of financial performance
  - Quick access to key metrics
  - Visual representation of data

- **Reports**

  - Detailed financial analysis
  - Customizable reporting periods
  - Export capabilities

- **BradeBot**

  - AI-powered financial assistant
  - Answers questions about your salon's finances
  - Provides insights and recommendations

- **Profile & Settings**
  - User profile management
  - Business information configuration
  - Account settings (disabled for test account)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd brade-web-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000)

### Test Account

For quick access to the app's features, use the test account:

- Email: test@bradehq.com
- Password: Test123

Note: The test account has limited functionality (Settings and Profile features are disabled).

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
│   ├── login/     # Login page
│   ├── onboarding/# Signup and onboarding
│   └── main_menu/ # Main application interface
├── api/           # API integration
└── assets/        # Images, icons, and other static files
```

## Technologies Used

- **Frontend**

  - React.js
  - React Router for navigation
  - Axios for API calls
  - CSS-in-JS for styling

- **AI Integration**
  - OpenAI API for BradeBot functionality
  - Custom financial analysis algorithms

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, email busayosalisu@gmail.com or open an issue in the repository.
