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
- **Routing**: Wouter for lightweight client-side routing with individual task URLs
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **Development**: Hot module replacement via Vite integration in development
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses

### Data Storage Solutions
- **Database**: Supabase PostgreSQL with direct client integration for real-time capabilities
- **Primary Storage**: SupabaseStorage class implementing IStorage interface for all data operations
- **Schema Management**: SQL-based schema with UUID primary keys and foreign key relationships
- **Connection**: Supabase client with environment variable configuration
- **Development Storage**: Supabase development database (replaced in-memory storage)

### Database Schema Design
- **Tasks Table**: UUID primary keys, stores test scenarios with titles, descriptions, image URLs, active status, and creation timestamps
- **Clicks Table**: UUID primary keys with foreign key references to tasks, records user interactions with x/y coordinates as percentages, timestamps, user agents, and session tracking
- **Indexes**: Performance optimized with indexes on active status, timestamps, task relationships, and session IDs
- **Row Level Security**: Enabled with public access policies for development (configurable for production)
- **Validation**: Zod schemas for runtime type checking and API validation with Supabase data transformation

### Authentication and Authorization
- **Current State**: No authentication implemented - open access system
- **Session Tracking**: Basic session ID tracking for click attribution without user accounts

### Component Architecture
- **Design System**: Modular UI components with variant-based styling using class-variance-authority
- **Testing Interface**: 
  - Task List View: Grid-based display of available tasks with individual access
  - Individual Task Pages: Single-task testing with direct URL sharing capability
  - Interactive image clicking with visual feedback and completion tracking
- **Admin Dashboard**: Analytics dashboard with heatmap visualization and data export capabilities
- **Task Management**: Full CRUD operations with task creation modal and dropdown menus
- **Heatmap Visualization**: Canvas-based rendering with gradient overlays for click density

### Development Workflow
- **Type Safety**: Shared TypeScript schemas between client and server
- **Hot Reloading**: Vite dev server with Express integration for full-stack development
- **Build Process**: Separate client (Vite) and server (ESBuild) build pipelines
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## External Dependencies

### Database Services
- **Supabase**: Backend-as-a-Service with PostgreSQL database, real-time subscriptions, and authentication capabilities
- **Supabase Client**: Official JavaScript client library for database operations and real-time features

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