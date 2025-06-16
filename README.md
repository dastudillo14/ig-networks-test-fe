# IG Networks Job Application Portal

A modern web application for managing job applications and postings, built with Angular and PrimeNG.

## Features

- Job posting management
- Application tracking system
- User authentication and authorization
- Responsive design
- Advanced filtering and search capabilities
- Role-based access control (Admin/Applicant)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dastudillo14/ig-networks-test-fe.git
cd ig-networks-test-fe
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

To build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

To build for a specific environment:

```bash
# For production
ng build --configuration production

# For staging
ng build --configuration staging
```

## Running Tests

```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## Project Structure

```
src/
├── app/
│   ├── core/           # Core modules, services, and models
│   ├── features/       # Feature modules
│   │   ├── applications/  # Application management
│   │   ├── auth/         # Authentication
│   │   └── jobs/         # Job management
│   └── shared/         # Shared components and utilities
├── assets/            # Static assets
└── environments/      # Environment configurations
```

## Technologies Used

- Angular 17
- PrimeNG
- Tailwind CSS
- TypeScript
- RxJS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
