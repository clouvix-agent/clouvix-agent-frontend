import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface BucketCardProps {
  serviceName: string
  description: string
  bucketCount: number
  onAddBucket: () => void
  onClick: () => void
}

export default function BucketCard({ 
  serviceName, 
  description, 
  bucketCount,
  onAddBucket,
  onClick 
}: BucketCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{serviceName}</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onAddBucket();
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent onClick={onClick}>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-sm font-medium">
          {bucketCount} {bucketCount === 1 ? 'bucket' : 'buckets'} configured
        </p>
      </CardContent>
    </Card>
  )
} 