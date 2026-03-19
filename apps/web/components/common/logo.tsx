export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/branding/logo.svg"
      alt="Shottrace Logo"
      className={`${className ?? 'h-12'}`}
    />
  );
}
