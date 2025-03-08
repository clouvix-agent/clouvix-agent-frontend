import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-bold text-black mb-4 sm:mb-6 md:mb-8 [transform:perspective(1000px)_rotateX(10deg)_translateZ(50px)] [transform-style:preserve-3d] [text-shadow:-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff,1px_1px_0_#fff,2px_2px_0_#fff] md:[text-shadow:-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff,1px_1px_0_#fff,2px_2px_0_#fff,3px_3px_0_#fff,4px_4px_0_#fff,6px_6px_0_#fff,8px_8px_0_#fff]">
          Clouvix
        </h1>
        
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
