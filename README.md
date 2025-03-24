# Location Device Management Frontend

This is the frontend application for the Location Device Management system, built with Next.js, TypeScript, and Material-UI.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Getting Started

1. Navigate to the frontend directory:
```bash
cd Frontend/FinalLayoutFrontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Hook Form
- Axios
- TailwindCSS

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/store` - Redux store configuration and slices
- `/types` - TypeScript type definitions

## Features

- User authentication
- Device management
- Location tracking
- Real-time updates
- Responsive design

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is private and confidential.
