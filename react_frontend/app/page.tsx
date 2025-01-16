import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <Header />
      <div className="flex flex-1">
        <MainContent />
        <Sidebar />
      </div>
    </div>
  )
}

