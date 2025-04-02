# Jay's Frames - Custom Framing E-commerce Platform

A modern e-commerce platform for Jay's Frames that leverages AI and modern web technologies to provide an innovative, user-centric frame design and purchasing experience.

## Features

- AI-powered frame design assistant
- Custom framing design interface
- Product catalog with multiple categories
- Order management system
- Intelligent chatbot assistant
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Database**: In-memory storage (production-ready for PostgreSQL)
- **AI**: OpenAI's GPT-4o integration

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- OpenAI API Key for AI features

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository
2. Install the dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5000.

## Deployment Instructions

### Using Replit Deployments

1. Make sure your OpenAI API key is added to the Replit Secrets with the key name `OPENAI_API_KEY`
2. Click the "Deploy" button in the Replit interface
3. Configure your deployment settings if needed
4. Deploy the application

### Manual Deployment

For deploying to other platforms:

1. Build the application:

```bash
npm run build
```

2. Set up your environment variables on your hosting platform
3. Start the server:

```bash
npm start
```

## API Endpoints

See the [API Documentation](API_DOCUMENTATION.md) for details about available endpoints.

## AI Features

The application integrates with OpenAI's GPT-4o model to provide:

1. **Frame Design Assistant**: Get personalized frame design recommendations
2. **Chatbot**: Answer customer questions and provide product recommendations
3. **Frame Recommendations**: Receive frame and mat suggestions based on artwork descriptions

## License

This project is proprietary and belongs to Jay's Frames. All rights reserved.

## Support

For any issues or questions, please contact the development team or open an issue on the repository.