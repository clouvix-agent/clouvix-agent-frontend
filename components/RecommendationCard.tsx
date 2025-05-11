import React from "react"

interface Recommendation {
  resource_type: string
  arn: string
  recommendation_text: string
  updated_timestamp: string
}

interface Props {
  recommendation: Recommendation
  onOptimize?: (arn: string, resource_type: string, recommendation_text: string) => void
}

export default function RecommendationCard({ recommendation, onOptimize }: Props) {
  return (
    <div className="flex flex-col justify-between h-full rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-2 overflow-y-auto text-sm max-h-40">
        <div className="text-xs font-semibold text-gray-500">{recommendation.resource_type}</div>
        <div className="text-xs break-all text-gray-700">{recommendation.arn}</div>
        <div className="text-sm whitespace-pre-line text-gray-800">{recommendation.recommendation_text}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Updated: {new Date(recommendation.updated_timestamp).toLocaleString()}
        </span>
        <button
          onClick={() =>
            onOptimize?.(
              recommendation.arn,
              recommendation.resource_type,
              recommendation.recommendation_text
            )
          }
          className="text-xs px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Optimise
        </button>
      </div>
    </div>
  )
}
