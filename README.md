# 🤖 Chat with Website

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Harshith%20Vaddiparthy-orange.svg)](https://github.com/harshith-eth)

> An AI-powered web application that lets you chat with any website's content using natural language.

🔗 **[Live Demo](https://chat-with-website-beta.vercel.app/)** | [GitHub Repository](https://github.com/harshith-eth/chat-with-website)

![Project Demo](https://source.unsplash.com/random/1200x630/?chat,ai,website)

## 🎯 About

Chat with Website is an innovative open-source application that allows users to have natural conversations with any website's content. Built with modern web technologies and powered by Firecrawl and Azure OpenAI, this tool transforms static web content into an interactive chatbot that can answer questions about the website's content in real-time.

## 🌟 Features

- 🌐 Chat with any website by simply entering its URL
- 🤖 AI-powered responses using Azure OpenAI
- 🔍 Real-time website content processing with Firecrawl
- 💬 Natural language conversation interface
- 🎨 Beautiful, responsive UI with smooth animations
- ⚡ Fast and efficient content processing
- 🔒 Secure API key management
- 📱 Mobile-friendly design
- 🌙 Dark mode interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API keys for:
  - Firecrawl (Get it from [Firecrawl](https://firecrawl.dev))
  - Azure OpenAI (Get it from [Azure Portal](https://portal.azure.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/harshith-eth/chat-with-website.git
   cd chat-with-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys:
   ```env
   VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key_here
   VITE_AZURE_API_KEY=your_azure_api_key_here
   VITE_AZURE_ENDPOINT=your_azure_endpoint_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📖 How to Use

1. Visit the application in your browser
2. Enter the URL of any website you want to chat with
3. Wait for the content to be processed
4. Start asking questions about the website's content
5. Receive AI-powered responses based on the website's content

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Integration**:
  - Firecrawl for website content processing
  - Azure OpenAI for natural language understanding
- **Development Tools**:
  - ESLint for code linting
  - PostCSS for CSS processing
  - TypeScript for type safety
- **Deployment**: Vercel

## 📁 Project Structure

```
├── src/
│   ├── App.tsx                # Main application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles
│   └── types/
│       └── firecrawl.d.ts    # Firecrawl type definitions
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # Project documentation
```

## 🔒 Security

- API keys are stored in environment variables
- `.env` file is excluded from git repository
- Input validation for website URLs
- Error handling for API failures
- Secure deployment on Vercel

## 🚀 Deployment

The project is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Add your environment variables in Vercel's project settings
5. Deploy!

For local deployment:
```bash
npm run build
npm run preview
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

### Code Style

The project uses ESLint with TypeScript support. Configuration can be found in `eslint.config.js`.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Firecrawl](https://firecrawl.dev) for their powerful web scraping API
- [Azure OpenAI](https://azure.microsoft.com/services/openai) for AI capabilities
- [Vercel](https://vercel.com) for hosting
- All the amazing open-source libraries used in this project

## 👨‍💻 Author

**Harshith Vaddiparthy**
- GitHub: [@harshith-eth](https://github.com/harshith-eth)
- Twitter: [@harshithio](https://x.com/harshithio)
- LinkedIn: [Harshith Vaddiparthy](https://www.linkedin.com/in/harshith-vaddiparthy/)

## 📧 Contact

For any questions or feedback, feel free to reach out:

- Email: harshithvaddiparthy@gmail.com
- Twitter: [@harshithio](https://x.com/harshithio)

Project Link: [https://github.com/harshith-eth/chat-with-website](https://github.com/harshith-eth/chat-with-website)

---

<p align="center">
  Made with ❤️ by Harshith Vaddiparthy<br>
  <small>© 2024 Harshith Vaddiparthy. All rights reserved.</small>
</p> 