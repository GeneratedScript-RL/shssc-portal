interface AchievementsListProps {
  title: string;
  items: string[];
}

export default function AchievementsList({ title, items }: AchievementsListProps) {
  return (
    <section className="panel">
      <h3 className="text-xl font-semibold text-brand-green">{title}</h3>
      {items.length ? (
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="rounded-2xl bg-brand-green/[0.03] px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No items have been recorded yet.</p>
      )}
    </section>
  );
}
