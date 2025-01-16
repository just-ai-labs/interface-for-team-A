'use client'

import { Paperclip, Mic } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChatInput({ onSend }: { onSend: () => void }) {
  return (
    <div className="flex items-center gap-2 p-4 border-t bg-gray-50">
      <Input 
        placeholder="Try 'Show my tasks for today' or 'What's the deadline for Project X?'" 
        className="flex-1"
      />
      <Button variant="ghost" size="icon">
        <Paperclip className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <Mic className="h-5 w-5" />
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSend}>
        Send
      </Button>
    </div>
  );
}


