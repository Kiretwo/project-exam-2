# Holidaze - Accommodation Booking Platform

A modern, responsive accommodation booking platform built with React, TypeScript, and Vite. This application allows users to browse, search, and book accommodations while providing venue managers with tools to create and manage their properties.

## 🚀 Features

### For Customers

- **Browse Accommodations**: Explore a curated selection of venues with detailed information
- **Advanced Search**: Search venues by location, name, or description
- **Interactive Booking**: Book accommodations with real-time availability checking
- **Booking Management**: View and manage your booking history
- **User Profiles**: Create and customize your profile with avatar and bio

### For Venue Managers

- **Venue Creation**: Add new accommodations with detailed descriptions and images
- **Venue Management**: Edit existing venues and manage their details
- **Booking Overview**: Track and manage received bookings for your venues
- **Rich Media Support**: Upload multiple images with descriptions for each venue
- **Amenities Management**: Configure amenities (WiFi, Parking, Breakfast, Pets allowed)
- **Location Services**: Set precise location data including coordinates

### Technical Features

- **Responsive Design**: Optimized for all device sizes
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, intuitive interface with SCSS modules
- **State Management**: Zustand for efficient state handling
- **Date Handling**: Advanced date picker with conflict detection
- **Image Carousel**: Interactive image galleries for venues
- **Authentication**: Secure user authentication and authorization
- **API Integration**: RESTful API integration with Noroff Holidaze API

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Type System**: TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS Modules
- **Routing**: React Router DOM
- **State Management**: Zustand
- **HTTP Client**: Fetch API with custom wrappers
- **Date Handling**: date-fns, react-datepicker
- **Icons**: React Icons
- **Image Carousel**: React Responsive Carousel
- **Development Tools**: ESLint, TypeScript ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd project-exam-2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
VITE_API_KEY="your-api-key-here"
VITE_NOROFF_API_BASE_URL="https://v2.api.noroff.dev"
```

**Note**: You'll need to obtain an API key from the Noroff API. The current example key in the project may be for demonstration purposes only.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── api/                    # API utilities and constants
│   ├── constants.ts        # API endpoints and configuration
│   ├── headers.ts          # HTTP headers utility
│   └── auth/              # Authentication API functions
├── components/            # Reusable UI components
│   ├── auth/              # Authentication forms
│   ├── bookings/          # Booking-related components
│   ├── venue-card/        # Venue display components
│   └── ...               # Other UI components
├── pages/                 # Main application pages
│   ├── search-page/       # Home/search functionality
│   ├── venue-detail/      # Individual venue pages
│   ├── profile-page/      # User profile management
│   ├── create-venue/      # Venue creation for managers
│   └── ...               # Other pages
├── stores/                # Zustand state management
├── styles/                # Global styles and utilities
│   ├── base/              # Reset and typography
│   ├── layout/            # Layout styles
│   └── utils/             # SCSS variables, mixins, functions
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🔗 API Integration

This application integrates with the Noroff Holidaze API v2. Key endpoints include:

- **Authentication**: User registration and login
- **Venues**: CRUD operations for accommodations
- **Bookings**: Create and manage reservations
- **Profiles**: User profile management
- **Search**: Venue search functionality

## 🎨 Styling Architecture

The project uses a modular SCSS approach:

- **CSS Modules**: Component-scoped styling
- **SCSS Variables**: Consistent theming and colors
- **Mixins**: Reusable styling patterns
- **Responsive Design**: Mobile-first approach with breakpoint mixins

## 🧪 Development Guidelines

### Code Style

- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error handling
- Write descriptive component and function names

### Component Structure

- Each component has its own directory with `.tsx` and `.module.scss` files
- Props are properly typed with TypeScript interfaces
- Components are designed for reusability

### State Management

- Global state handled by Zustand stores
- Local component state using React hooks
- Proper state typing with TypeScript

## 🔒 Authentication Flow

1. **Registration**: Users can register as regular customers or venue managers
2. **Login**: Authentication provides access tokens for API requests
3. **Protected Routes**: Certain features require authentication
4. **Role-Based Access**: Venue managers have additional capabilities

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first design approach**
- **Flexible grid layouts**
- **Optimized touch interactions**
- **Responsive typography and spacing**

## 🚧 Known Issues & Limitations

- SCSS deprecation warnings are currently suppressed
- Image uploads are URL-based only (no file upload support)

## 📄 License

This project is part of an educational program and is intended for academic purposes.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your environment variables are correctly set
3. Ensure you have a valid API key
4. Check that all dependencies are installed

For development support, refer to the documentation of the main technologies:

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)

---
