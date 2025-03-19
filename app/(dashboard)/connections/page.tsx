"use client"

import { useState } from "react"
import BucketCard from "@/components/BucketCard"
import BucketDetail from "@/components/BucketDetail"

// Mock data for demonstration
const mockServices = [
  {
    id: "aws",
    name: "AWS",
    description: "Amazon Web Services credentials and configuration",
    buckets: [
      {
        id: "aws-prod",
        name: "Production",
        variables: [
          { key: "AWS_ACCESS_KEY_ID", value: "" },
          { key: "AWS_SECRET_ACCESS_KEY", value: "" },
          { key: "AWS_REGION", value: "" }
        ]
      }
    ]
  },
  {
    id: "github",
    name: "GitHub",
    description: "GitHub tokens and repository access configurations",
    buckets: [
      {
        id: "github-main",
        name: "Main",
        variables: [
          { key: "GITHUB_TOKEN", value: "" },
          { key: "GITHUB_ORG", value: "" }
        ]
      }
    ]
  }
]

export default function ConnectionsPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
  
  const service = mockServices.find(s => s.id === selectedService)
  const bucket = service?.buckets.find(b => b.id === selectedBucket)

  const handleAddBucket = (serviceId: string) => {
    // This will be implemented later with a modal for creating new buckets
    console.log("Add bucket to service:", serviceId)
  }

  const handleSaveVariables = (variables: { key: string; value: string }[]) => {
    // This will be implemented later with API calls
    console.log("Save variables:", variables)
  }

  if (selectedService && bucket) {
    return (
      <div>
        <button
          onClick={() => {
            setSelectedBucket(null)
            setSelectedService(null)
          }}
          className="mb-6 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Connections
        </button>
        {service && bucket && (
          <BucketDetail
            serviceName={service.name}
            bucketName={bucket.name}
            variables={bucket.variables}
            onSave={handleSaveVariables}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Environment Buckets</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <BucketCard
            key={service.id}
            serviceName={service.name}
            description={service.description}
            bucketCount={service.buckets.length}
            onAddBucket={() => handleAddBucket(service.id)}
            onClick={() => {
              setSelectedService(service.id)
              setSelectedBucket(service.buckets[0]?.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
