"use client"

import { useEffect, useState } from "react"

const awsLogo = "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch("http://backend.clouvix.com/api/inventory", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again')
        }
        throw new Error('Failed to fetch inventory')
      }

      const data = await response.json()
      setInventoryData(data)
    } catch (err: any) {
      console.error("Failed to fetch inventory", err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  if (isLoading) {
    return <div className="text-white p-8">Loading AWS Inventory...</div>
  }

  if (error) {
    return <div className="text-red-500 p-8">Error: {error}</div>
  }

  if (!inventoryData) {
    return <div className="text-white p-8">No inventory data available.</div>
  }

  const serviceKeys = Object.keys(inventoryData)

  return (
    <div className="p-8 space-y-6">
      {/* AWS Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src={awsLogo} alt="AWS Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-white">AWS Inventory</h1>
      </div>

      {/* Service List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {serviceKeys.map((service) => (
          <button
            key={service}
            onClick={() => setSelectedService(service)}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
          >
            {service}
          </button>
        ))}
      </div>

      {/* Service Details */}
      {selectedService && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{selectedService} Details</h2>
          {inventoryData[selectedService].length === 0 ? (
            <p className="text-gray-700">No resources found.</p>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(inventoryData[selectedService], null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
