"use client"

import { useState } from "react"
import WorkspaceCard from "@/components/WorkspaceCard"
import WorkspaceDetail from "@/components/WorkspaceDetail"

// Mock data for demonstration
const mockWorkspaces = [
  {
    id: "test1",
    projectName: "test1",
    terraformStatus: "Done",
    lastRun: "Yesterday",
    terraformFileLocation: "github/s3 location",
    terraformStateFileLocation: ""
  },
  {
    id: "test2",
    projectName: "test2",
    terraformStatus: "Done",
    lastRun: "Yesterday",
    terraformFileLocation: "github/s3 location",
    terraformStateFileLocation: ""
  },
  {
    id: "test3",
    projectName: "test3",
    terraformStatus: "Done",
    lastRun: "Yesterday",
    terraformFileLocation: "github/s3 location",
    terraformStateFileLocation: ""
  }
]

export default function WorkspacePage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  
  const selectedWorkspaceData = mockWorkspaces.find(w => w.id === selectedWorkspace)

  return (
    <div className="space-y-6">
      {!selectedWorkspace ? (
        <>
          <h1 className="text-2xl font-bold">Workspaces Under your Organisation</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockWorkspaces.map((workspace) => (
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
