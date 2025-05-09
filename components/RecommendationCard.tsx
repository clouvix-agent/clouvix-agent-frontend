import React from "react"

interface Recommendation {
  resource_type: string
  arn: string
  recommendation_text: string
  updated_timestamp: string
}

interface Props {
  recommendation: Recommendation
}

export default function RecommendationCard({ recommendation }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="mb-2 text-sm text-muted-foreground">{recommendation.resource_type}</div>
      <div className="text-sm font-medium break-all mb-2">{recommendation.arn}</div>
      <div className="text-base">{recommendation.recommendation_text}</div>
      <div className="mt-4 text-xs text-right text-muted-foreground">
        Last updated: {new Date(recommendation.updated_timestamp).toLocaleString()}
      </div>
    </div>
  )
}
