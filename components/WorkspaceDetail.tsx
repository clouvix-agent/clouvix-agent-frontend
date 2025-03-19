import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkspaceDetailProps {
  projectName: string
  terraformFileLocation: string
  terraformStateFileLocation: string
}

export default function WorkspaceDetail({ 
  projectName, 
  terraformFileLocation, 
  terraformStateFileLocation 
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
        <CardContent className="h-48">
          {/* This will be populated with actual outputs later */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Inventory</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          {/* This will be populated with actual inventory later */}
        </CardContent>
      </Card>
    </div>
  )
} 