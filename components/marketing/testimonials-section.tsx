import { Quote } from "lucide-react";
import { ContextHelp } from "@/components/help/context-help";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TESTIMONIALS } from "@/lib/data/venue";

export function TestimonialsSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <CardTitle className="font-display text-3xl font-semibold md:text-4xl">
          Trust signals that make the booking flow feel believable
        </CardTitle>
        <ContextHelp
          label="Testimonials help"
          tooltip="Testimonials build confidence and help the venue feel more realistic."
          title="Testimonials section"
          description="Testimonials help visitors feel more confident about the venue by showing how past customers experienced the hall, the service flow, and the booking process."
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <Card key={`${testimonial.name}-${testimonial.role}`}>
            <CardHeader className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/12 text-primary">
                <Quote className="size-5" />
              </div>
              <CardTitle className="text-xl">{testimonial.name}</CardTitle>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {testimonial.role}
              </p>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              <span>&ldquo;{testimonial.quote}&rdquo;</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
