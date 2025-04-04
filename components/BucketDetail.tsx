"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, X } from "lucide-react"
import { useState, useEffect } from "react"

interface EnvVariable {
  key: string
  value: string
}

interface BucketDetailProps {
  serviceName: string
  isNewBucket: boolean
  onSave: (bucketName: string, variables: EnvVariable[]) => void
  onCancel: () => void
  defaultKeys: EnvVariable[]
  existingBucketName?: string
}

const BucketDetail: React.FC<BucketDetailProps> = ({
  serviceName,
  isNewBucket,
  onSave,
  onCancel,
  defaultKeys,
  existingBucketName = "",
}) => {
  const [bucketName, setBucketName] = useState(existingBucketName)
  const [variables, setVariables] = useState<EnvVariable[]>([])

  useEffect(() => {
    // Initialize with default keys if provided
    if (defaultKeys && defaultKeys.length > 0) {
      setVariables(defaultKeys)
    } else {
      setVariables([{ key: "", value: "" }])
    }
  }, [defaultKeys])

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

  const handleSubmit = () => {
    if (!bucketName.trim()) {
      alert("Please enter a bucket name")
      return
    }
    onSave(bucketName, variables)
  }

  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle>{isNewBucket ? 'New Credential Bucket' : 'Edit Credential Bucket'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bucket Name</label>
          <Input
            placeholder="Enter bucket name"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            disabled={!isNewBucket} // Disable name editing for existing buckets
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Credentials</label>
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
            onClick={handleSubmit}
          >
            {isNewBucket ? 'Save Credentials' : 'Update Credentials'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BucketDetail 