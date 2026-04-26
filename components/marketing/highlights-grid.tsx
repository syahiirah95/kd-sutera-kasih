import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HIGHLIGHT_ITEMS } from "@/lib/data/venue";

export function HighlightsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {HIGHLIGHT_ITEMS.map((item) => (
        <Card
          className="h-full rounded-[var(--radius-sm)] border-white/75 bg-white/68 shadow-[0_16px_38px_rgba(114,76,43,0.12)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(114,76,43,0.16)]"
          key={item.title}
        >
          <CardHeader className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-full border border-[#d49b6a]/35 bg-[linear-gradient(135deg,rgba(220,164,83,0.18)_0%,rgba(255,250,244,0.92)_100%)] text-[#9b5f20] shadow-[0_10px_24px_rgba(114,76,43,0.1)]">
              <item.icon className="size-5" />
            </div>
            <CardTitle className="font-display text-[1.35rem]">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm leading-7 text-muted-foreground">
            {item.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
