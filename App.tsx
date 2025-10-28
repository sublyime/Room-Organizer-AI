
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ChatWindow } from './components/ChatWindow';
import { Loader } from './components/Loader';
import { MessageAuthor, type ChatMessage } from './types';
import { WelcomeMessage } from './components/WelcomeMessage';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const handleImageSelect = useCallback(async (file: File) => {
    // Reset previous state
    setImageFile(file);
    setMessages([]);
    setError(null);
    setChatInstance(null);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        setImageBase64(reader.result as string);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        // First, get initial suggestions
        const imagePart = {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        };

        const textPart = {
          text: `You are an expert interior designer and professional organizer. Analyze this image of a room and provide detailed, actionable organization and decluttering suggestions. 
          Your advice should be practical, easy to follow, and tailored to the items and space visible in the photo. 
          Structure your response in markdown format with clear headings for different areas or categories of suggestions (e.g., "## On the Desk", "## Bookshelf Organization"). 
          Start with a friendly and encouraging opening sentence.`
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [imagePart, textPart] },
        });

        const initialSuggestion = response.text;

        setMessages([{ author: MessageAuthor.BOT, text: initialSuggestion }]);
        
        // Then, initialize the chat
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          history: [
            {
              role: 'user',
              parts: [
                imagePart,
                textPart,
              ],
            },
            {
              role: 'model',
              parts: [{ text: initialSuggestion }],
            },
          ],
          config: {
            systemInstruction: "You are an expert interior designer and professional organizer continuing the conversation about the room image provided earlier. Be helpful, encouraging, and provide specific, actionable advice based on the user's questions."
          }
        });
        setChatInstance(chat);
      };
      reader.readAsDataURL(file);

    } catch (e) {
      console.error(e);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatInstance || !text.trim()) return;

    setMessages(prev => [...prev, { author: MessageAuthor.USER, text }]);
    setIsChatLoading(true);

    try {
      const response = await chatInstance.sendMessage({ message: text });
      setMessages(prev => [...prev, { author: MessageAuthor.BOT, text: response.text }]);
    } catch (e) {
      console.error(e);
      const errorMessage = "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [...prev, { author: MessageAuthor.BOT, text: errorMessage }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInstance]);

  return (
    <div className="flex flex-col h-screen font-sans antialiased text-gray-800 bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden">
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Your Room</h2>
          <ImageUploader onImageSelect={handleImageSelect} imageSrc={imageBase64} />
        </div>
        
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">AI Suggestions</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {isAnalyzing && <Loader text="Analyzing your space... this may take a moment." />}
            {!isAnalyzing && error && <p className="text-red-500 text-center">{error}</p>}
            {!isAnalyzing && !error && messages.length === 0 && <WelcomeMessage />}
            {messages.length > 0 && 
              <ChatWindow 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading} 
              />
            }
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
