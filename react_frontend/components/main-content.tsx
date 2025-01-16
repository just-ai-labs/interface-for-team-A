'use client'

import { useState } from 'react'
import { Paperclip, Mic, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MainContent() {
  const [input, setInput] = useState('')

  return (
    <main className="flex-1 flex flex-col p-4">
      <div className="flex-1 space-y-4">
        <div className="border-2 border-dashed border-[#0039FF] rounded-lg p-8 text-center text-sm text-gray-600">
          Drag and drop files here or use the attachment button to share files with your team
        </div>
        <div className="bg-[#F2F2F2] p-4 rounded-lg">
          Hi there! I&apos;m your Project Assistant. Ready to create your project charter? Choose an action to get started!
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 bg-white p-2 rounded-lg">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try 'Show my tasks for today' or 'What's the deadline for Project X?'" 
          className="flex-1"
        />
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Mic className="h-5 w-5" />
        </Button>
        <Button className="bg-[#0039FF] hover:bg-[#0039FF]/90">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </main>
  )
}

