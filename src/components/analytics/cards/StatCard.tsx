
interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
}

export const StatCard = ({ label, value, subtext }: StatCardProps) => (
  <div className="bg-card p-6 rounded-lg border border-border">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-2xl font-bold mt-2 text-foreground">{value}</div>
    {subtext && <div className="text-sm text-green-500">{subtext}</div>}
  </div>
);
