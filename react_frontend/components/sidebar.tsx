import { CalendarIcon, Users } from 'lucide-react'

interface Project {
  name: string
  status: string
  progress: number
  dueDate: string
  members: number
  tasks: { pending: number; completed: number }
}

interface RecentFile {
  name: string
  type: string
  size: string
}

const projects: Project[] = [
  {
    name: "Project A: Website Redesign",
    status: "In Progress (60%)",
    progress: 60,
    dueDate: "Oct 25",
    members: 4,
    tasks: { pending: 3, completed: 2 }
  },
  {
    name: "Project B: Content Strategy",
    status: "2 Overdue tasks",
    progress: 30,
    dueDate: "Oct 30",
    members: 3,
    tasks: { pending: 5, completed: 1 }
  }
]

const recentFiles: RecentFile[] = [
  { name: "Project_Brief_v2.pdf", type: "PDF", size: "2.4 MB" },
  { name: "Homepage_Mockup.png", type: "PNG", size: "4.8 MB" }
]

export function Sidebar() {
  return (
    <div className="w-80 border-l p-4 space-y-6 bg-white">
      <div>
        <h2 className="font-medium mb-4">Active Projects</h2>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="bg-[#EEF1FF] p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <div className="text-sm text-gray-600">
                    {project.tasks.pending} tasks pending, {project.tasks.completed} completed
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status.includes('Overdue') 
                    ? 'bg-[#FF3B30] text-white' 
                    : 'bg-[#FFB800] text-white'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2.5 mb-2">
                <div className="bg-[#0039FF] h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Due: {project.dueDate}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{project.members} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-4">Recent Files</h2>
        <div className="space-y-3">
          {recentFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 ${
                file.type === 'PDF' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-[#0039FF]/10 text-[#0039FF]'
              } rounded flex items-center justify-center font-medium text-xs`}>
                {file.type}
              </div>
              <div>
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-gray-600">{file.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

