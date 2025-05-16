import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Globe, Send, Loader2, ArrowLeft } from 'lucide-react';
import FirecrawlApp, { ScrapeResponse, CrawlResponse } from '@mendable/firecrawl-js';

// Initialize Firecrawl client
const firecrawl = new FirecrawlApp({
  apiKey: import.meta.env.VITE_FIRECRAWL_API_KEY
});

// Azure OpenAI configuration
const azureEndpoint = import.meta.env.VITE_AZURE_ENDPOINT;
const azureApiKey = import.meta.env.VITE_AZURE_API_KEY;

function App() {
  const [url, setUrl] = useState('https://www.stack-ai.com/');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; content: string; isTyping?: boolean }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [crawledContent, setCrawledContent] = useState<string>('');
  const [processingSteps, setProcessingSteps] = useState<Array<string>>([]);

  const resetChat = () => {
    setIsChatReady(false);
    setMessages([]);
    setCurrentMessage('');
    setCrawledContent('');
  };

  const checkCrawlProgress = async (crawlId: string): Promise<string> => {
    try {
      const result = await firecrawl.checkCrawlStatus(crawlId);
      if (result.success && result.data?.markdown) {
        return result.data.markdown;
      }
      throw new Error('No content available in crawl result');
    } catch (error: any) {
      throw new Error(`Failed to check crawl status: ${error.message}`);
    }
  };

  const addProcessingStep = (step: string) => {
    setProcessingSteps(prev => [...prev, step]);
  };

  const processWebsite = async () => {
    if (!url) return;
    
    setIsProcessing(true);
    setProcessingSteps([]);
    try {
      addProcessingStep('Starting up Firecrawl engine...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addProcessingStep('Initializing website processing...');
      console.log('Starting website processing with Firecrawl...');
      
      addProcessingStep('Crawling website content...');
      const result = await firecrawl.scrapeUrl(url, {
        formats: ['markdown', 'html']
      });

      addProcessingStep('Processing website data...');
      console.log('Firecrawl result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to scrape website');
      }

      const markdownContent = result.data?.markdown || (result as any).markdown;
      
      if (!markdownContent) {
        throw new Error('No markdown content available from the website');
      }

      addProcessingStep('Preparing chat interface...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setCrawledContent(markdownContent);
      setIsChatReady(true);
      setMessages([{ 
        type: 'bot', 
        content: `I've processed ${url} and I'm ready to chat about it! Ask me anything about the website's content.` 
      }]);
      
    } catch (error: any) {
      console.error('Detailed error processing website:', {
        type: error?.constructor?.name,
        message: error?.message,
        stack: error?.stack
      });
      
      setMessages([{ 
        type: 'bot', 
        content: `Error: ${error?.message || 'Failed to process website'}. Please try again.` 
      }]);
    } finally {
      setIsProcessing(false);
      setProcessingSteps([]);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !crawledContent) return;
    
    const userMessage = currentMessage;
    setCurrentMessage('');
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setMessages(prev => [...prev, { type: 'bot', content: '', isTyping: true }]);
    
    try {
      // Construct the complete Azure OpenAI API URL with proper URL handling
      const baseUrl = azureEndpoint.trim();
      // Ensure the base URL ends with a slash
      const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const apiUrl = `${formattedBaseUrl}openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview`;
      
      console.log("Using Azure API URL:", apiUrl); // Debug the constructed URL
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that answers questions about the following website content. Format your responses for readability:
              - Use short, clear sentences
              - Add line breaks between main points
              - Limit lists to 3-4 key points
              - Keep responses concise and focused
              - Avoid special characters or markdown
              
              Website content: ${crawledContent}`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure API error:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Failed to get response from Azure OpenAI: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let botResponse = data.choices[0].message.content;
      
      // Clean up the response formatting
      botResponse = botResponse
        .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .replace(/([.!?])\s+/g, '$1\n'); // Add line break after sentences

      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 ? { type: 'bot', content: botResponse } : msg
      ));
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 ? { type: 'bot', content: `Sorry, I encountered an error. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}` } : msg
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-4 border border-gray-700"
      >
        <AnimatePresence mode="wait">
          {!isChatReady ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8"
            >
              <motion.div 
                initial={{ scale: 0.9, rotate: 0 }}
                animate={{ 
                  scale: [0.9, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="flex items-center justify-center mb-8"
              >
                <Globe className="w-12 h-12 text-indigo-400" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-center text-white mb-2"
              >
                Chat with Any Website
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-gray-300 mb-8"
              >
                Enter a website URL and I'll process it for our conversation
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-2"
              >
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={processWebsite}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 transition-all duration-200"
                >
                  {isProcessing ? (
                    <motion.div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    'Process'
                  )}
                </motion.button>
              </motion.div>
              
              {/* Processing Steps */}
              <AnimatePresence mode="popLayout">
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-2"
                  >
                    {processingSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
                        />
                        {step}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-[600px] flex flex-col"
            >
              <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetChat}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-300" />
                </motion.button>
                <h2 className="text-lg font-semibold text-white">Chat with {url}</h2>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center"
                      >
                        <span role="img" aria-label="fire" className="text-xl">🔥</span>
                      </motion.div>
                    )}
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.type === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      {message.isTyping ? (
                        <motion.div 
                          className="flex gap-1 h-6 items-center"
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        >
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        </motion.div>
                      ) : (
                        <div className="whitespace-pre-line leading-relaxed">
                          {message.content}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-t border-gray-700"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask anything about the website..."
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={sendMessage}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="text-center text-gray-300 space-y-1">
        <p className="text-sm">Built by Harshith Vaddiparthy</p>
      </div>
    </div>
  );
}

export default App;