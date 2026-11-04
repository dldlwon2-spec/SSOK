interface SectionCardProps {
  title: string;
  badge?: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, badge, description, children }: SectionCardProps) {
  return (
    <section className="mt-5 rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-5 @md:p-7">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        {badge && (
          <span className="rounded-full bg-secondary px-3.5 py-1 text-sm font-bold whitespace-nowrap">{badge}</span>
        )}
      </div>
      {description && <p className="mb-6 text-muted-foreground">{description}</p>}
      {children}
    </section>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">{children}</p>;
}
