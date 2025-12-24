import Image from 'next/image';

type Props = {
  path?: string;
};

const height = 600;
const contentOffset = 0.8;

export default function BackgroundImage({ path }: Props) {
  if (!path) return null;

  return (
    <>
      <div className="absolute inset-0 flex justify-center pointer-events-none z-[-1]">
        <div className="relative w-full max-w-7xl" style={{ height }}>
          <Image
            src={`https://image.tmdb.org/t/p/w1280${path}`}
            alt="Background image"
            fill
            className="object-cover mask-fade"
            priority
          />
        </div>
      </div>

      {/* Spacer to push content down */}
      <div style={{ height: height * contentOffset }} />
    </>
  );
}
