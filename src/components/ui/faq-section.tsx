import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils"; 

const items = [
  {
    id: "01",
    title: "What kind of projects do you build?",
    content:
      "We build custom websites and web applications in React and Next.js. That covers retail stores, clinic booking systems, and company landing pages. We write our own styles and components, so pages load fast and there are no plugin conflicts.",
  },
  {
    id: "02",
    title: "How do you handle SEO?",
    content:
      "We handle technical on-page SEO directly in the code. Every page gets clean semantic HTML, structured JSON-LD schema, open graph social tags, and automatic sitemaps. Search engines index clean markup much faster than heavy page builders.",
  },
  {
    id: "03",
    title: "How does WhatsApp automation work?",
    content:
      "We connect your website or booking form to the official Meta WhatsApp Business API. When someone requests an appointment or submits an enquiry, the system immediately sends a confirmed WhatsApp message to both you and the customer.",
  },
  {
    id: "04",
    title: "Why avoid WordPress templates?",
    content:
      "Commercial themes pack dozens of unused scripts and stylesheets that slow down mobile load times. Custom code only includes what your site actually needs, keeping speeds high and eliminating third-party plugin vulnerabilities.",
  },
  {
    id: "05",
    title: "What happens after launch?",
    content:
      "You own the finished codebase 100%. If you need updates or new features later on, you can hire us on an hourly or project basis, or hand the code to your in-house team. No mandatory retainers.",
  },
];

export function FaqSection() {
  return (
    <div className="w-full relative z-20 py-24 md:py-32 bg-background">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
        <div className="mb-12 md:mb-20 px-4 md:px-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">
              Common Questions
            </p>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-none text-foreground">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-sm opacity-60 max-w-[40ch] leading-relaxed">
            Clear answers about our development process, tech stack, and pricing structure.
          </p>
        </div>

        <Accordion type="single" defaultValue="01" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem value={item.id} key={item.id} className="border-white/10 last:border-b">
              <AccordionTrigger className="text-left py-6 md:py-8 pl-6 md:pl-14 overflow-hidden text-foreground/40 duration-300 hover:no-underline cursor-pointer data-[state=open]:text-foreground [&>svg]:hidden relative group">
                <div className="flex flex-1 items-center gap-6 md:gap-12">
                  <p className="text-sm md:text-base font-medium opacity-50 group-hover:opacity-100 transition-opacity">{item.id}</p>
                  <h3 className="uppercase text-xl md:text-3xl lg:text-4xl font-semibold tracking-tight transition-all">
                    {item.title}
                  </h3>
                </div>
              </AccordionTrigger>

              <AccordionContent className="text-muted-foreground pb-8 pl-6 md:pl-[6.5rem] pr-6 md:pr-12 text-base md:text-lg leading-relaxed max-w-4xl">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
