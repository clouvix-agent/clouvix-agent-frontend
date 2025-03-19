export default function GridPattern() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '1cm 1cm',
        backgroundPosition: 'center',
      }}
    />
  );
} 