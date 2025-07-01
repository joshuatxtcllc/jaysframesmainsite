# Jay's Frames E-Commerce Platform

## Overview

Jay's Frames is a comprehensive e-commerce platform for a custom framing studio featuring an innovative hybrid production model. The application combines traditional craftsmanship with modern technology, including AI-powered design assistance, automated order processing, and real-time customer communication systems.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context for cart and authentication, TanStack Query for server state
- **UI Components**: Custom components built with Radix UI primitives and Tailwind CSS
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with ShadCN UI component library

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM (falls back to in-memory storage)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload**: Express-fileupload middleware for image handling
- **Real-time Communication**: WebSocket integration for live notifications

## Key Components

### AI Integration
- **Provider**: OpenAI GPT-4o model for frame design assistance
- **Features**: 
  - Artwork image analysis for frame recommendations
  - Interactive chat assistant for design guidance
  - Automated frame, mat, and glass option suggestions
- **Fallback**: Graceful degradation when API key is unavailable

### Authentication System
- JWT-based authentication with secure password hashing
- Role-based access control (customer, staff, admin)
- Protected routes with middleware authentication
- Cookie-based token storage for better security

### Product Management
- Dynamic product catalog with categories (frames, shadowboxes, moonmount)
- Frame options with pricing per inch calculations
- Mat and glass option management
- Inventory tracking with low stock alerts
- Product search and filtering capabilities

### Order Processing
- Automated order workflow system
- Real-time order status tracking
- Email and SMS notification system
- Payment processing integration ready
- Admin dashboard for order management

### Notification System
- Unified notification platform with WebSocket real-time updates
- Email notifications via Nodemailer
- SMS integration with Twilio
- Cross-application notification support
- Embeddable notification widgets

### Content Management
- Dynamic content blocks for easy site updates
- Image management system
- Blog system with categories and posts
- SEO optimization with structured data

## Data Flow

### Order Processing Flow
1. Customer designs frame using AI assistant or manual selection
2. Items added to cart with calculated pricing
3. Checkout process with customer information collection
4. Order creation triggers automated workflow
5. Inventory checks and status updates
6. Real-time notifications to customer and admin
7. Production tracking through various stages

### Authentication Flow
1. User registration with email verification
2. JWT token generation and secure storage
3. Protected route access based on user roles
4. Token refresh and session management

### AI Recommendation Flow
1. Customer uploads artwork image
2. AI analyzes image for colors, style, and composition
3. System matches analysis with available inventory
4. Recommendations returned with reasoning
5. Interactive refinement based on customer feedback

## External Dependencies

### Required Services
- **OpenAI API**: For AI-powered frame design assistance
- **PostgreSQL Database**: Primary data storage (with in-memory fallback)
- **Email Service**: SMTP for transactional emails
- **Twilio**: SMS notifications for order updates

### Optional Integrations
- **Payment Processing**: Stripe integration prepared but not active
- **SendGrid**: Alternative email service
- **External Catalog APIs**: Larson Juhl frame catalog integration

### Development Dependencies
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production bundle compilation
- **TypeScript**: Type checking and compilation

## Deployment Strategy

### Production Build
- Vite builds optimized frontend bundle
- ESBuild compiles server-side TypeScript
- Static assets served from dist/public directory
- Server bundle outputs to dist/index.js

### Environment Configuration
- Development: Hot reload with Vite dev server
- Production: Express serves static files and API routes
- Database: Automatic connection with multiple environment variable options
- SSL: HTTPS redirect middleware for production deployments

### Scaling Considerations
- WebSocket connections for real-time features
- Database connection pooling with Neon serverless
- File upload limits and temporary storage management
- Background job processing for order automation

## Changelog
- June 18, 2025: Initial setup
- June 18, 2025: Complete transformation to professional dark aesthetic with SEO-optimized copy
  - Updated hero section with Houston local keywords and premium archival framing messaging
  - Replaced aggressive "dominance" language with classy, professional terminology
  - Implemented SEO-focused content emphasizing museum-grade conservation materials
  - Added Houston local search terms: "Custom framing Houston", "frame shop near me Houston", etc.
  - Focused messaging on archival acid-free materials, conservation glass, and premium clientele

## Recent Changes
- January 1, 2025: Comprehensive SEO Recovery Implementation for Houston Framing Rankings
  - Enhanced homepage with keyword-rich Houston Heights Local SEO section targeting declining search terms
  - Added comprehensive local business schema with service catalogs and area coverage
  - Created strategic Houston custom framing guide blog post specifically targeting "picture framing houston," "houston frame shop," and "custom framing houston" keywords
  - Enhanced Hero section with "Houston Heights Custom Framing" focus for better local search targeting
  - Updated HTML meta tags throughout site with targeted Houston framing keywords
  - Enhanced robots.txt and sitemap.xml for improved search engine crawling
  - Added Open Graph and Twitter meta tags for enhanced social media sharing
  - Implemented local geo tags and business directory optimization
  - Fixed TypeScript compilation errors and frontend build issues
  - Created additional local SEO landing pages for Houston neighborhoods and art framing
  - Enhanced sitemap with new location-focused pages for better crawling
  - Added comprehensive neighborhood targeting for Heights, Montrose, River Oaks, Memorial, Galleria, Midtown
- June 24, 2025: Implemented complete Stripe payment processing system
  - Created secure server-side payment endpoints with payment intent creation
  - Built professional checkout page with customer information forms and order summary
  - Fixed cart context integration issues for proper payment flow
  - Added payment confirmation endpoint for order status updates
  - Enhanced error handling for payment processing edge cases
- June 20, 2025: Enhanced frame designer visual accuracy and functionality
  - Reduced mat width scaling from 20px to 8px per inch for realistic proportions (1"-4" range)
  - Made Save and Add to Cart buttons functional in frame preview section
  - Enhanced AI visual recommendations with clickable frame and mat options
  - Fixed text rendering clarity with optimized font smoothing
  - Updated business hours: Mon-Fri 9am-5pm, Sat 10am-3pm, Sun by appointment
- June 19, 2025: Implemented external API integration system for Kanban and POS applications
  - Created external API service for connecting to Kanban app (order status retrieval)
  - Created external API service for connecting to POS system (order push for records/pricing)
  - Enhanced order creation to automatically push orders to POS system
  - Enhanced order status lookup to fetch real-time status from Kanban app
  - Added configuration endpoints for managing external API credentials
  - Added connection testing endpoints for both Kanban and POS systems
  - Removed notification system in favor of external integration approach
- June 18, 2025: Enhanced AI system with Claude integration and UI improvements
  - Upgraded AI service to use Claude (Anthropic) as primary provider with OpenAI fallback
  - Removed Design Journey container for cleaner, focused interface
  - Removed interactive preview from hero section for simplified layout
  - Implemented image upload functionality in Custom Frame Designer
  - Added AI recommendations interface with scoring system for frames and mats
  - Positioned AI Frame Designer prominently in sidebar
  - Created dual workflow: AI analysis OR manual customization
  - Enhanced image upload button with larger size, gradient styling, and prominent placement
  - Updated business address to 218 W 27th St, Houston Heights, TX 77008
- June 18, 2025: Converted to pure visual image analysis system
  - Removed text description requirement from AI Frame Designer
  - Implemented automatic visual analysis when images are uploaded
  - AI now analyzes colors, style, composition, and mood directly from artwork
  - Enhanced user experience with immediate visual recommendations
  - Added visual analysis status indicators and progress feedback
- Professional rebranding with emphasis on archival museum-grade custom framing
- SEO optimization for Houston local search with premium positioning
- Dark aesthetic maintained with black, teal, and white color scheme
- Content strategy focused on high-end clientele and conservation materials

## User Preferences

Preferred communication style: Simple, everyday language.
Brand positioning: High-end, classy custom framing for affluent Houston clientele
SEO focus: Houston local keywords and archival/museum-grade terminology
Design aesthetic: Dark, professional with black, teal, and white colors