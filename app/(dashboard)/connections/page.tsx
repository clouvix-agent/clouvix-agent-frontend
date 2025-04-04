"use client"

import { useState, useEffect } from "react"
import BucketCard from "@/components/BucketCard"
import BucketDetail from "@/components/BucketDetail"

const cloudServices = [
  {
    id: "aws",
    name: "AWS",
    description: "Amazon Web Services credentials and configuration",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    defaultKeys: [
      { key: "AWS_ACCESS_KEY_ID", value: "" },
      { key: "AWS_SECRET_ACCESS_KEY", value: "" },
      { key: "AWS_REGION", value: "" }
    ]
  },
  {
    id: "github",
    name: "GitHub",
    description: "GitHub tokens and repository access configurations",
    logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    defaultKeys: [
      { key: "GITHUB_TOKEN", value: "" }
    ]
  },
  {
    id: "azure",
    name: "Azure",
    description: "Microsoft Azure credentials and configuration",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
    defaultKeys: []
  },
  {
    id: "gcp",
    name: "GCP",
    description: "Google Cloud Platform credentials and configuration",
    logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
    defaultKeys: []
  }
]

interface Bucket {
  id: string
  name: string
  variables: { key: string; value: string }[]
}

export default function ConnectionsPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [showBucketForm, setShowBucketForm] = useState(false)
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const service = cloudServices.find(s => s.id === selectedService)

  const fetchBuckets = async (serviceId: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`http://localhost:8000/api/connections/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again')
        }
        throw new Error('Failed to fetch buckets')
      }

      const data = await response.json()
      
      const transformedBuckets = data.map((bucket: any) => ({
        id: bucket.bucketName,
        name: bucket.bucketName,
        variables: bucket.variables
      }))

      setBuckets(transformedBuckets)
    } catch (error) {
      console.error('Error fetching buckets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedService) {
      fetchBuckets(selectedService)
    }
  }, [selectedService])

  const handleSaveVariables = async (bucketName: string, variables: { key: string; value: string }[]) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      const response = await fetch('http://localhost:8000/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: selectedService,
          bucketName,
          variables
        }),
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized error (invalid or expired token)
          throw new Error('Unauthorized - Please login again')
        }
        throw new Error('Failed to save credentials')
      }

      // Add the new bucket to the list
      setBuckets([...buckets, { 
        id: Date.now().toString(), // temporary ID
        name: bucketName,
        variables
      }])
      setShowBucketForm(false)
    } catch (error) {
      console.error('Error saving credentials:', error)
      // You might want to add proper error handling here
      // // For example, redirect to login page if token is invalid
      // if (error.message === 'Unauthorized - Please login again') {
      //   // Redirect to login page or show login modal
      //   // router.push('/login')
      // }
    }
  }

  const handleBucketClick = (bucket: Bucket) => {
    setSelectedBucket(bucket)
    setShowBucketForm(true)
  }

  if (selectedService && service) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedService(null)
            setBuckets([])
            setShowBucketForm(false)
            setSelectedBucket(null)
          }}
          className="mb-6 text-sm text-white hover:text-white cursor-pointer"
        >
          ← Back to Connections
        </button>

        <div className="text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 relative">
              <img
                src={service.logo}
                alt={`${service.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold">{service.name} Credentials</h2>
          </div>
          <button
            onClick={() => {
              setSelectedBucket(null)
              setShowBucketForm(true)
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 mx-auto"
          >
            Create New Bucket
          </button>
        </div>

        {showBucketForm && (
          <BucketDetail
            serviceName={service.name}
            isNewBucket={!selectedBucket}
            onSave={handleSaveVariables}
            defaultKeys={selectedBucket ? selectedBucket.variables : service.defaultKeys}
            existingBucketName={selectedBucket?.name}
            onCancel={() => {
              setShowBucketForm(false)
              setSelectedBucket(null)
            }}
          />
        )}

        {isLoading ? (
          <div className="text-center py-4">Loading buckets...</div>
        ) : (
          buckets.length > 0 && (
            <div className="grid gap-4 mt-6">
              <h3 className="text-lg font-semibold text-white">Existing Connection Buckets</h3>
              {buckets.map(bucket => (
                <div 
                  key={bucket.id} 
                  className="p-4 border rounded-lg bg-white cursor-pointer transition-colors hover:bg-accent/90"
                  onClick={() => handleBucketClick(bucket)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-black">{bucket.name}</h4>
                      <p className="text-sm text-gray-600">
                        {bucket.variables.length} credentials
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      Click to view or edit
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cloud Service Credentials</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cloudServices.map((service) => (
          <BucketCard
            key={service.id}
            serviceName={service.name}
            description={service.description}
            logo={service.logo}
            onClick={() => setSelectedService(service.id)}
          />
        ))}
      </div>
    </div>
  )
}
