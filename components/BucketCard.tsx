import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

interface BucketCardProps {
  serviceName: string
  description: string
  onClick: () => void
  logo: string
}

export default function BucketCard({
  serviceName,
  description,
  onClick,
  logo
}: BucketCardProps) {
  return (
    <Card
      className="hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-12 h-12 relative">
          <Image
            src={logo}
            alt={`${serviceName} logo`}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-semibold">{serviceName}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
} 