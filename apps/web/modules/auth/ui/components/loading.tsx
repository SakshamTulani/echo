"use client";

function EchoLogo({ className }: { className?: string }) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1014 40.3232C31.1472 40.3232 40.1014 31.3689 40.1014 20.3232C40.1014 9.27754 31.1472 0.323242 20.1014 0.323242C9.05573 0.323242 0.10144 9.27754 0.10144 20.3232C0.10144 31.3689 9.05573 40.3232 20.1014 40.3232ZM23.1884 15.7758C24.8932 14.0709 24.8932 11.3068 23.1884 9.6019C21.4835 7.89702 18.7194 7.89702 17.0145 9.6019C15.3097 11.3068 15.3097 14.0709 17.0145 15.7758L20.1014 18.8627L23.1884 15.7758ZM24.6489 23.4102C26.3538 25.1151 29.1179 25.1151 30.8228 23.4102C32.5276 21.7053 32.5276 18.9412 30.8228 17.2363C29.1179 15.5315 26.3538 15.5315 24.6489 17.2363L21.562 20.3233L24.6489 23.4102ZM23.1884 31.0446C24.8932 29.3397 24.8932 26.5756 23.1884 24.8707L20.1014 21.7838L17.0145 24.8707C15.3097 26.5756 15.3097 29.3397 17.0145 31.0446C18.7194 32.7495 21.4835 32.7495 23.1884 31.0446ZM9.38007 23.4102C7.67523 21.7053 7.67523 18.9412 9.38007 17.2363C11.085 15.5315 13.8491 15.5315 15.554 17.2363L18.6409 20.3233L15.554 23.4102C13.8491 25.1151 11.085 25.1151 9.38007 23.4102Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-background relative overflow-hidden">
      {/* Subtle background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo container */}
        <div className="relative">
          {/* Outer pulsing ring */}
          <div
            className="absolute inset-0 -m-4 rounded-full bg-primary/20 animate-ping"
            style={{ animationDuration: "2s" }}
          />

          {/* Inner glowing ring */}
          <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 animate-pulse" />

          {/* Logo with gentle scale animation */}
          <div
            className="relative animate-pulse"
            style={{ animationDuration: "2s" }}>
            <EchoLogo className="text-primary drop-shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
