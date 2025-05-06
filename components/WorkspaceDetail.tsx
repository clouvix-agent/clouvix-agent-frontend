import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InventoryItemCard from "@/components/InventoryItemCard"

interface InventoryItem {
  resource_type: string
  resource_name: string
  arn: string
}

interface WorkspaceDetailProps {
  projectName: string
  terraformFileLocation: string
  terraformStateFileLocation: string
  status: string | null
  inventory: InventoryItem[]
}

export default function WorkspaceDetail({ 
  projectName, 
  terraformFileLocation, 
  terraformStateFileLocation,
  status,
  inventory
}: WorkspaceDetailProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Workspace: {projectName}</h2>
      
      <div className="flex space-x-4 text-sm text-muted-foreground">
        <p>Terraform File Location: {terraformFileLocation}</p>
        <p>Terraform State File Location: {terraformStateFileLocation}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terraform Run Outputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto whitespace-pre-wrap shadow-inner border border-gray-700">
            {status ? status : "No status data available."}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Inventory</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          {inventory.length > 0 ? (
            inventory.map((item, index) => (
              <InventoryItemCard
                key={index}
                resourceType={item.resource_type}
                resourceName={item.resource_name}
                arn={item.arn}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No inventory data available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
