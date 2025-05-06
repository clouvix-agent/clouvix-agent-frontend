import { Card, CardContent } from "@/components/ui/card"

interface InventoryItemCardProps {
  resourceType: string
  resourceName: string
  arn: string
}

export default function InventoryItemCard({
  resourceType,
  resourceName,
  arn
}: InventoryItemCardProps) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-4 text-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="font-medium">
            <span className="text-muted-foreground">Type:</span> {resourceType}
          </div>
          <div className="break-words text-muted-foreground">
            <span className="text-muted-foreground">ARN:</span> {arn}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Name:</span> {resourceName}
        </div>
      </CardContent>
    </Card>
  )
}
