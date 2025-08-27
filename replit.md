# ClickTest Application

## Overview

ClickTest is a full-stack web application built for conducting user experience research through click tracking on images. The application allows administrators to create tasks with images and descriptions, while testers can click on images to indicate where they would perform certain actions. The system captures and visualizes click data as heatmaps for analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **Development**: Hot module replacement via Vite integration in development
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Connection**: Neon Database serverless driver for PostgreSQL connectivity
- **Development Storage**: In-memory storage implementation for development/testing

### Database Schema Design
- **Tasks Table**: Stores test scenarios with titles, descriptions, image URLs, and active status
- **Clicks Table**: Records user interactions with x/y coordinates as percentages, timestamps, and session tracking
- **Validation**: Zod schemas for runtime type checking and API validation

### Authentication and Authorization
- **Current State**: No authentication implemented - open access system
- **Session Tracking**: Basic session ID tracking for click attribution without user accounts

### Component Architecture
- **Design System**: Modular UI components with variant-based styling using class-variance-authority
- **Testing Interface**: Interactive image clicking with visual feedback and progress tracking
- **Admin Dashboard**: Analytics dashboard with heatmap visualization and data export capabilities
- **Heatmap Visualization**: Canvas-based rendering with gradient overlays for click density

### Development Workflow
- **Type Safety**: Shared TypeScript schemas between client and server
- **Hot Reloading**: Vite dev server with Express integration for full-stack development
- **Build Process**: Separate client (Vite) and server (ESBuild) build pipelines
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Consistent icon library for UI elements

### Development Tools
- **Vite**: Frontend build tool with hot module replacement and development server
- **TanStack Query**: Data fetching and caching library for API state management
- **Wouter**: Minimalist router for single-page application navigation

### Image Hosting
- **Unsplash**: External image service for sample task images (placeholder implementation)

### Session Management
- **Connect PG Simple**: PostgreSQL session store for Express sessions (configured but not actively used)

### Utilities
- **Date-fns**: Date manipulation and formatting library
- **clsx/twMerge**: Conditional CSS class name utilities
- **Nanoid**: URL-safe unique ID generation