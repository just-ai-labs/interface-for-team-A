import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#0039FF] rounded flex items-center justify-center text-white font-bold">
          Lo
        </div>
        <span className="font-medium">Project Assistant</span>
      </div>
      <Button variant="default" className="bg-[#0039FF] hover:bg-[#0039FF]/90">
        <Star className="mr-2 h-4 w-4" />
        Label
      </Button>
    </header>
  )
}

