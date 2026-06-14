export function BadModal() {
  return (
    <div className="fixed z-[99999] inset-0 overflow-y-auto">
      {/* 
        Issues: 
        1. z-[99999] (arbitrary-z-index-slop)
        2. fixed and overflow-y-auto without max-height (modal-internal-scroll-risk)
        3. Missing portal (overlay-missing-portal)
      */}
      <div className="w-[500px] h-100vh bg-white">
        {/*
          Issues:
          1. w-[500px] (fixed-width-mobile-risk)
          2. h-100vh (height-100vh-mobile-risk)
        */}
        <h1 className="text-9xl leading-none">Huge Title</h1>
        {/*
          Issues:
          1. text-[120px] (oversized-typography-mobile-risk)
          2. leading-none on huge text (leading-none-cutoff-risk)
        */}
      </div>
    </div>
  )
}
