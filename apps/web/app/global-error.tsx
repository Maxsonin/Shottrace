'use client';

import Logo from '@/components/common/logo';
import './globals.css';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html>
      <body className="h-screen w-screen m-0 overflow-hidden">
        <div className="relative h-full w-full">
          <img
            src="/error-bg.jpg"
            alt="Error"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent" />

          <div className="relative z-10 p-6 md:p-10 text-white max-w-xl">
            {/* <h2 className="text-2xl md:text-4xl font-bold mb-3">
              Something went wrong...
            </h2> */}
            <Logo className="h-10 mb-3" />

            <p className="text-sm md:text-base opacity-80 mb-2 w-95">
              An unexpected error occurred. Please try again later. If the
              problem persists, please contact us.
            </p>

            <p className="text-xs opacity-60">
              Still from Steven Spielberg’s Raiders of the Lost Ark (1981)
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
