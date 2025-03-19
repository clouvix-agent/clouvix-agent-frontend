import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen">
      <Navbar />
      <Sidebar />
      <main className="ml-72 h-full p-4">
        {children}
      </main>
    </div>
  )
}
