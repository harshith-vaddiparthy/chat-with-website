# Chat with Website

A React application that allows you to chat with any website using AI. Built with React, TypeScript, Vite, and powered by Firecrawl and Azure OpenAI.

## Features

- Chat with any website by entering its URL
- Real-time website content processing
- AI-powered responses about website content
- Beautiful UI with animations
- Responsive design

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Firecrawl
- Azure OpenAI

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/harshith-eth/chat-with-website.git
cd chat-with-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
VITE_AZURE_API_KEY=your_azure_api_key
VITE_AZURE_ENDPOINT=your_azure_endpoint
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Variables

- `VITE_FIRECRAWL_API_KEY`: Your Firecrawl API key
- `VITE_AZURE_API_KEY`: Your Azure OpenAI API key
- `VITE_AZURE_ENDPOINT`: Your Azure OpenAI endpoint URL

## License

MIT 