'use client';

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { clearAuth } from "@/app/utils/auth"

export default function Navbar() {
  const handleLogout = async () => {
    await clearAuth();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed right-4 top-4 z-50 bg-background/80 backdrop-blur-sm rounded-full shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </nav>
  )
} 