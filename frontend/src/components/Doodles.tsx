/** Ambient decorative layer: pendulum + floating shapes. Purely visual. */
export default function Doodles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Pendulum */}
      <div className="animate-swing absolute -top-2 right-[12%] h-35 w-1 origin-top bg-gray-500 [animation-duration:3s]">
        <span className="absolute -bottom-6 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border-[3px] border-ink bg-sun" />
      </div>

      {/* Floating shapes */}
      <span className="animate-spin-slow absolute left-[10%] top-60 h-5 w-5 border-[3px] border-ink bg-pink" />
      <span className="animate-bob absolute left-[20%] top-[60%] h-4 w-7 rounded-full border-[3px] border-ink bg-mint [animation-delay:1.2s]" />
      <span className="animate-spin-slow absolute right-[7%] top-[45%] h-5 w-7 rounded border-[3px] border-ink bg-sky [animation-direction:reverse]" />
      <span className="animate-bob absolute bottom-16 right-[16%] h-4 w-4 rotate-12 border-[3px] border-ink bg-butter [animation-delay:0.6s]" />

      {/* Triangle */}
      <svg
        viewBox="0 0 24 24"
        className="animate-bob absolute right-[22%] top-24 h-6 w-6 fill-lime stroke-ink [animation-delay:1.8s]"
        strokeWidth={2.5}
        strokeLinejoin="round"
      >
        <path d="M12 3.5 L21 20 H3 Z" />
      </svg>

      {/* Large circle */}
      <span className="animate-bob animate-pulse absolute right-[20%] bottom-60 h-8 w-8 rounded-full border-[3px] border-ink bg-grape-soft [animation-delay:2.4s] [animation-duration:4.5s]" />

      {/* Rotating triangle */}
      <svg
        viewBox="0 0 24 24"
        className="animate-spin-slow absolute bottom-40 left-[6%] h-7 w-7 fill-sky stroke-ink [animation-duration:16s]"
        strokeWidth={2.5}
        strokeLinejoin="round"
      >
        <path d="M12 3.5 L21 20 H3 Z" />
      </svg>

      {/* Gear */}
      <svg
        viewBox="0 0 24 24"
        className="animate-spin-slow absolute top-24 left-[5%] h-9 w-9 fill-tangerine stroke-ink [animation-duration:14s]"
        strokeWidth={2.4}
        strokeLinejoin="round"
      >
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect
              key={deg}
              x="9"
              y="0.5"
              width="6"
              height="8"
              rx="0.5"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
          <circle cx="12" cy="12" r="7.2" />
          <circle cx="12" cy="12" r="2.6" className="fill-paper" />
        </g>
      </svg>
    </div>
  );
}
