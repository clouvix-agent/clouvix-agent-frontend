"use client"

import { Button } from "@/components/ui/button"
import { Bot, Boxes, LayoutGrid, Network, Gift } from "lucide-react"  // ✅ Added Gift
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-64 flex-col rounded-lg bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex flex-col space-y-2">
        <Link href="/chat" className="w-full">
          <Button 
            variant={pathname === "/chat" ? "secondary" : "ghost"}
            className="w-full justify-start rounded-lg"
          >
            <Bot className="mr-2 h-4 w-4" />
            AI Engineer
          </Button>
        </Link>
        <Link href="/workspace" className="w-full">
          <Button 
            variant={pathname === "/workspace" ? "secondary" : "ghost"}
            className="w-full justify-start rounded-lg"
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Workspaces
          </Button>
        </Link>
        <Link href="/inventory" className="w-full">
          <Button 
            variant={pathname === "/inventory" ? "secondary" : "ghost"}
            className="w-full justify-start rounded-lg"
          >
            <Boxes className="mr-2 h-4 w-4" />
            Inventory
          </Button>
        </Link>
        <Link href="/connections" className="w-full">
          <Button 
            variant={pathname === "/connections" ? "secondary" : "ghost"}
            className="w-full justify-start rounded-lg"
          >
            <Network className="mr-2 h-4 w-4" />
            Connections
          </Button>
        </Link>
        <Link href="/recommendation" className="w-full">
          <Button 
            variant={pathname === "/recommendation" ? "secondary" : "ghost"}  // ✅ Correct path check
            className="w-full justify-start rounded-lg"
          >
            <Gift className="mr-2 h-4 w-4" />   {/* ✅ Added Gift icon */}
            Recommendations
          </Button>
        </Link>
      </div>
    </div>
  )
}
