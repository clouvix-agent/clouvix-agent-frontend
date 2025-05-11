interface Recommendation {
    resource_type: string
    arn: string
    recommendation_text: string
    updated_timestamp: string
  }
  
  interface Props {
    recommendation: Recommendation
    onOptimize?: (arn: string) => void
  }
  
  export default function RecommendationCard({ recommendation, onOptimize }: Props) {
    return (
      <div className="flex flex-col justify-between h-64 max-h-64 overflow-hidden rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition">
        <div className="overflow-y-auto text-sm space-y-2 pr-1">
          <div className="text-muted-foreground font-semibold">{recommendation.resource_type}</div>
          <div className="font-medium break-words text-xs">{recommendation.arn}</div>
          <div className="whitespace-pre-line text-sm text-gray-700">{recommendation.recommendation_text}</div>
        </div>
        <div className="mt-3">
          <div className="text-xs text-right text-muted-foreground">
            Updated: {new Date(recommendation.updated_timestamp).toLocaleString()}
          </div>
          <button
            onClick={() => onOptimize?.(recommendation.arn)}
            className="mt-2 w-full rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:from-blue-700 hover:to-indigo-700"
          >
            Optimise
          </button>
        </div>
      </div>
    )
  }
  