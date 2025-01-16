'use client'

import { useState } from 'react'
import { Paperclip, Mic, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatInput } from './chat-input'

interface ChatInterfaceProps {
  messages: { role: 'user' | 'assistant'; content: string }[]
  setMessages: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; content: string }[]>>
}

export function ChatInterface({ messages, setMessages }: ChatInterfaceProps) {
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: input }]);
      const userMessage = input;
      setInput('');

      try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        } else {
          setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: Unable to connect to the server.' }]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: Unable to connect to the server.' }]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-md classic-shadow bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-md max-w-[70%] ${
              message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}