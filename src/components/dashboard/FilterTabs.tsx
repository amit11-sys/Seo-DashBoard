import { Button } from "@/components/ui/button";

export default function FilterTabs() {
  const tabs = ["SEO", "GMB"];
  return (
    <div className="flex gap-2 my-4">
      {tabs.map((tab) => (
        <Button key={tab} variant="outline">
          {tab}
        </Button>
      ))}
    </div>
  );
}
