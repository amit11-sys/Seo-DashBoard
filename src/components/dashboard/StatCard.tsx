import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="flex flex-col border shadow-xl items-center  justify-center py-4">
      <CardContent className="flex flex-col items-center gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-muted-foreground">{title}</span>
      </CardContent>
    </Card>
  );
}
