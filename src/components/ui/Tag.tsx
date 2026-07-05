interface TagProps {
  label: string;
}

export default function Tag({ label }: TagProps) {
  return (
    <span className="inline-block rounded-full border border-border px-2.5 py-0.5 font-body text-xs font-medium text-muted">
      {label}
    </span>
  );
}
