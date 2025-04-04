"use client"

import { useState, useEffect } from "react"
import WorkspaceCard from "@/components/WorkspaceCard"
import WorkspaceDetail from "@/components/WorkspaceDetail"

// Define TypeScript interface for workspace data
interface Workspace {
  id: string
  projectName: string
  terraformStatus: string
  lastRun: string
  terraformFileLocation: string
  terraformStateFileLocation: string
}

export default function WorkspacePage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/workspaces') // Adjust this endpoint to match your API
        const data = await response.json()
        setWorkspaces(data)
      } catch (error) {
        console.error('Error fetching workspaces:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])
  
  const selectedWorkspaceData = workspaces.find(w => w.id === selectedWorkspace)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {!selectedWorkspace ? (
        <>
          <h1 className="text-2xl font-bold">Workspaces Under your Organisation</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                projectName={workspace.projectName}
                terraformStatus={workspace.terraformStatus}
                lastRun={workspace.lastRun}
                onClick={() => setSelectedWorkspace(workspace.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedWorkspace(null)}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Workspaces
          </button>
          {selectedWorkspaceData && (
            <WorkspaceDetail
              projectName={selectedWorkspaceData.projectName}
              terraformFileLocation={selectedWorkspaceData.terraformFileLocation}
              terraformStateFileLocation={selectedWorkspaceData.terraformStateFileLocation}
            />
          )}
        </div>
      )}
    </div>
  )
}
