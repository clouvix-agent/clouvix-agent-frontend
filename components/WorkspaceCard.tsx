import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkspaceCardProps {
  projectName: string
  terraformStatus: string
  lastRun: string
  onClick: () => void
}

export default function WorkspaceCard({ projectName, terraformStatus, lastRun, onClick }: WorkspaceCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">Project Name: {projectName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Terraform Run Status: {terraformStatus}
        </p>
        <p className="text-sm text-muted-foreground">
          Last Run: {lastRun}
        </p>
      </CardContent>
    </Card>
  )
} 