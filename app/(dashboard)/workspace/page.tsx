"use client"

import { useState, useEffect } from "react"
import WorkspaceCard from "@/components/WorkspaceCard"
import WorkspaceDetail from "@/components/WorkspaceDetail"

// Define TypeScript interfaces
interface Workspace {
  id: string
  projectName: string
  terraformStatus: string
  lastRun: string
  terraformFileLocation: string
  terraformStateFileLocation: string
}

interface InventoryItem {
  resource_type: string
  resource_name: string
  arn: string
}

export default function WorkspacePage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [workspaceStatus, setWorkspaceStatus] = useState<string | null>(null)
  const [workspaceInventory, setWorkspaceInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [inventoryLoading, setInventoryLoading] = useState(false)

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('https://backend.clouvix.com/api/workspaces', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - Please login again')
          }
          throw new Error('Failed to fetch workspaces')
        }

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

  const handleWorkspaceClick = async (workspace: Workspace) => {
    setSelectedWorkspace(workspace.id)
    setStatusLoading(true)
    setInventoryLoading(true)
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Fetch workspace status
      const statusResponse = await fetch(`https://backend.clouvix.com/api/workspace-status/${workspace.projectName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!statusResponse.ok) {
        throw new Error('Failed to fetch workspace status')
      }
      const statusData = await statusResponse.json()
      setWorkspaceStatus(statusData.status)

      // Fetch workspace inventory
      const inventoryResponse = await fetch(`https://backend.clouvix.com/api/inventory/${workspace.projectName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!inventoryResponse.ok) {
        throw new Error('Failed to fetch workspace inventory')
      }
      const inventoryData = await inventoryResponse.json()
      setWorkspaceInventory(inventoryData)

    } catch (error) {
      console.error('Error fetching workspace data:', error)
      setWorkspaceStatus(null)
      setWorkspaceInventory([])
    } finally {
      setStatusLoading(false)
      setInventoryLoading(false)
    }
  }

  const selectedWorkspaceData = workspaces.find(w => w.id === selectedWorkspace)

  if (loading) {
    return <div>Loading workspaces...</div>
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
                onClick={() => handleWorkspaceClick(workspace)}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => {
              setSelectedWorkspace(null)
              setWorkspaceStatus(null)
              setWorkspaceInventory([])
            }}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Workspaces
          </button>
          {selectedWorkspaceData && (
            <WorkspaceDetail
              projectName={selectedWorkspaceData.projectName}
              terraformFileLocation={selectedWorkspaceData.terraformFileLocation}
              terraformStateFileLocation={selectedWorkspaceData.terraformStateFileLocation}
              status={statusLoading ? "Loading status..." : workspaceStatus}
              inventory={inventoryLoading ? [] : workspaceInventory}
            />
          )}
        </div>
      )}
    </div>
  )
}
