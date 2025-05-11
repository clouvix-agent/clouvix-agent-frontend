"use client"

import { useEffect, useState } from "react"
import RecommendationCard from "@/components/RecommendationCard"

interface Recommendation {
  resource_type: string
  arn: string
  recommendation_text: string
  updated_timestamp: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")

        const response = await fetch("https://backend.clouvix.com/api/recommendations", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }

        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recommended Actions for Your Resources</h1>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : recommendations.length === 0 ? (
        <p className="text-muted-foreground">No recommendations found.</p>
      ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-[80vh] overflow-y-auto pr-2">
            {recommendations.map((rec, index) => (
                <RecommendationCard
                key={index}
                recommendation={rec}
                onOptimize={(arn: string) => {
                    console.log(`Optimising ${arn}`)
                }}
                />
            ))}
            </div>
      )}
    </div>
  )
}
