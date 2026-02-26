function Separator({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className="h-px bg-muted w-full" />
      <div className="px-2">{text}</div>
      <div className="h-px bg-muted w-full" />
    </div>
  );
}

export { Separator };
