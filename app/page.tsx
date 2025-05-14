import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <Image 
          src="/logo.png" 
          alt="Clouvix Logo" 
          width={850}  // Adjust width as needed
          height={100} 
          className="mb-4 sm:mb-6 md:mb-8"
        />

        <Link 
          href="/chat"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-lg sm:text-xl font-semibold flex items-center gap-2"
        >
          Chat <span className="text-xl sm:text-2xl">→</span>
        </Link>
      </div>
    </div>
  );
}
