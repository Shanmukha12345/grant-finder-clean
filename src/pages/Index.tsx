
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 bg-gray-100">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-2 text-center text-chatbot-dark">Grant Finder</h1>
        <p className="text-center text-gray-600 mb-6">Discover funding opportunities tailored to your needs</p>
        
        <ChatBot />
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Grant Finder Assistant | Built with React and TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
