import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-[12rem] font-bold text-black mb-8" style={{
          transform: 'perspective(1000px) rotateX(10deg) translateZ(50px)',
          transformStyle: 'preserve-3d',
          textShadow: `
            -1px -1px 0 #fff,
            1px -1px 0 #fff,
            -1px 1px 0 #fff,
            1px 1px 0 #fff,
            2px 2px 0 #fff,
            4px 4px 0 #fff,
            6px 6px 0 #fff,
            8px 8px 0 #fff,
            10px 10px 0 #fff
          `,
        }}>
          Clouvix
        </h1>
        
        <Link 
          href="/chat"
          className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-xl font-semibold flex items-center gap-2"
        >
          Chat <span className="text-2xl">→</span>
        </Link>
      </div>
    </div>
  );
}
