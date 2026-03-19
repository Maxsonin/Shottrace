import Logo from '@/components/common/logo';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden">
      <Image
        src="/not-found-bg.jpg"
        alt="404 background"
        fill
        className="object-cover z-0"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent z-10" />

      <div className="relative z-30 p-6 md:p-10 text-white max-w-xl">
        <Logo className="h-10 mb-3" />

        <p className="text-sm md:text-base opacity-80 mb-2 w-90">
          Sorry, we can’t find the page you’ve requested. Please contact us if
          the problem persists.
        </p>

        <p className="text-xs opacity-60">
          Still from David Fincher’s Fight Club (1999)
        </p>
      </div>
    </div>
  );
}
