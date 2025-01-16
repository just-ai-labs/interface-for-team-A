'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
    toast({
      title: "Files uploaded",
      description: `${acceptedFiles.length} file(s) have been uploaded successfully.`,
    })
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-md p-8 text-center text-sm text-gray-600 cursor-pointer transition-colors classic-shadow
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2">Drag and drop files here or click to select files</p>
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium">Uploaded files:</h4>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

