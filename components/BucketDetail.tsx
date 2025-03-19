import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface EnvVariable {
  key: string
  value: string
}

interface BucketDetailProps {
  serviceName: string
  bucketName: string
  variables: EnvVariable[]
  onSave: (variables: EnvVariable[]) => void
}

export default function BucketDetail({
  serviceName,
  bucketName,
  variables: initialVariables,
  onSave,
}: BucketDetailProps) {
  const [variables, setVariables] = useState<EnvVariable[]>(initialVariables)

  const addVariable = () => {
    setVariables([...variables, { key: "", value: "" }])
  }

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index))
  }

  const updateVariable = (index: number, field: "key" | "value", value: string) => {
    const newVariables = [...variables]
    newVariables[index][field] = value
    setVariables(newVariables)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{serviceName}</h2>
        <p className="text-sm text-muted-foreground">Bucket: {bucketName}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {variables.map((variable, index) => (
            <div key={index} className="flex items-center gap-4">
              <Input
                placeholder="Key"
                value={variable.key}
                onChange={(e) => updateVariable(index, "key", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value"
                value={variable.value}
                onChange={(e) => updateVariable(index, "value", e.target.value)}
                className="flex-1"
                type="password"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeVariable(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addVariable}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variable
          </Button>

          <Button 
            className="w-full"
            onClick={() => onSave(variables)}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 