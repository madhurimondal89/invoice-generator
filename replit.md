# Invoice Home - Full Stack Invoice Generator

## Overview

Invoice Home is a comprehensive full-stack invoice generator application that allows users to create, manage, and send professional invoices. The application features a modern React frontend with TypeScript, a Node.js/Express backend, and PostgreSQL database integration using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX Preference: World-class, ultra-modern, animated, fast, and user-friendly interfaces.

## Recent Changes

### January 17, 2025 - Ultra-Modern Home Page Transformation
- Completely redesigned home page with world-class, ultra-modern design
- Added animated background elements with gradients and blur effects
- Implemented smooth entrance animations with staggered delays
- Enhanced hero section with large gradient text and call-to-action buttons
- Created ultra-modern document type cards with hover effects and gradients
- Added glassmorphism design elements with backdrop blur
- Implemented modern stats dashboard with animated trends
- Added sophisticated hover animations and scale transforms
- Created stunning call-to-action section with gradient background
- Updated branding to use "Invoice Pro" instead of "DocGen Pro" throughout
- Added brand logo styling with blue "invoice" text and purple "Pro" badge
- Added comprehensive global currency support with 150+ world currencies
- Implemented searchable currency selector with major/regional groupings
- Enhanced invoice forms with currency formatting and selection
- Updated database schema to include currency field for all documents
- Overall result: Professional, modern, animated interface that feels premium

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Session management, authentication, and error handling
- **Development**: Hot reload with tsx for development server

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with TypeScript support
- **Connection**: Connection pooling with @neondatabase/serverless
- **Migrations**: Drizzle Kit for schema migrations
- **Schema**: Shared schema definitions between frontend and backend

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **Security**: HTTP-only cookies with secure flags
- **User Management**: User profile management and persistence

### Invoice Management
- **Creation**: Form-based invoice creation with line item management
- **Templates**: Pre-built invoice templates with customizable designs
- **Preview**: Real-time preview of invoice formatting
- **Storage**: Complete invoice data persistence with relationships

### PDF Generation
- **Library**: jsPDF for client-side PDF generation
- **Features**: Logo support, custom branding, professional layouts
- **Export**: Download functionality for generated invoices

### Email Integration
- **Service**: Amazon SES integration for email delivery (cost-effective alternative to SendGrid)
- **Features**: Invoice email sending with PDF attachments
- **Templates**: Professional HTML email templates with invoice details
- **Cost**: Nearly free compared to SendGrid (up to 62,000 emails per month for $0)

## Data Flow

### User Authentication Flow
1. User accesses protected routes
2. Replit Auth middleware validates session
3. User profile loaded from database
4. React components receive user context

### Invoice Creation Flow
1. User fills out invoice form with React Hook Form
2. Form validation using Zod schemas
3. Line items managed with dynamic form arrays
4. Real-time preview updates as form changes
5. Data submitted to Express API endpoints
6. Drizzle ORM persists to PostgreSQL
7. Success response triggers UI updates

### Template System Flow
1. Templates stored in database with JSON configuration
2. Frontend fetches available templates
3. User selects template for new invoice
4. Template data populates form defaults
5. User customizes and saves invoice

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router alternative)
- Express.js with middleware stack
- TypeScript for type safety
- Vite for development and build tooling

### Database and ORM
- Drizzle ORM for type-safe database operations
- PostgreSQL with Neon serverless driver
- Connection pooling and session storage

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Lucide React for consistent iconography
- shadcn/ui for pre-built components

### Authentication and Security
- Replit Auth for OAuth integration
- Express session management
- OpenID Connect client library

### External Services
- Amazon SES for email delivery (cost-effective email solution)
- Neon for PostgreSQL hosting
- File upload handling for logos

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **API Development**: tsx with nodemon-like behavior
- **Database**: Development database with migrations
- **Environment**: Environment variables for configuration

### Production Build
- **Frontend**: Vite production build to static assets
- **Backend**: esbuild compilation to single JavaScript file
- **Database**: Production PostgreSQL with connection pooling
- **Deployment**: Single build process for both frontend and backend

### Environment Configuration
- **Development**: Local environment with development database
- **Production**: Environment variables for all external services
- **Security**: Secure session configuration and HTTPS enforcement
- **Monitoring**: Request logging and error handling

### Scalability Considerations
- **Database**: Connection pooling for concurrent users
- **Sessions**: PostgreSQL-based session storage
- **Static Assets**: Vite optimized bundles with code splitting
- **API**: Stateless design for horizontal scaling