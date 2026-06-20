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
    title: "Web Design Services",
    content:
      "We specialize in high-performance, custom web development including e-commerce platforms, SaaS dashboards, clinic web design, and bespoke corporate websites. We code everything from scratch to ensure pixel-perfect design and flawless user experiences.",
  },
  {
    id: "02",
    title: "SEO Optimization",
    content:
      "Our SEO strategy is built into the foundation of your website. We implement robust semantic HTML, schema markups, optimized metadata, and rapid page-load speeds, giving you the technical edge needed to rank higher on Google.",
  },
  {
    id: "03",
    title: "WhatsApp Automation",
    content:
      "We seamlessly integrate the official Meta WhatsApp Business API into your CRM or website. This enables automated booking confirmations, customer support flows, and patient engagement directly through WhatsApp.",
  },
  {
    id: "04",
    title: "Why avoid templates?",
    content:
      "Templates are bloated, slow, and limit your brand's unique identity. By using modern tech stacks like Next.js and React, we deliver fully customized digital experiences that load instantly, secure your data, and convert visitors into customers.",
  },
  {
    id: "05",
    title: "Ongoing Support",
    content:
      "Absolutely. We act as your long-term digital engineering partner. From continuous performance optimization to scaling your web architecture as your business grows, we ensure your platform remains cutting-edge.",
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
            Everything you need to know about our custom engineering, SEO, and automation services.
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
