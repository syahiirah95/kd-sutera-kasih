import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HIGHLIGHT_ITEMS } from "@/lib/data/venue";

export function HighlightsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {HIGHLIGHT_ITEMS.map((item) => (
        <Card key={item.title}>
          <CardHeader className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
              <item.icon className="size-5" />
            </div>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            {item.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
