import { contentBodySchema } from "@/modules/content/input";

export function StructuredContent({ value }: { value: unknown }) {
  const parsed = contentBodySchema.safeParse(value);
  if (!parsed.success) return <p className="text-ink/55">This article is temporarily unavailable while its structured content is reviewed.</p>;
  return <div className="prose-content">{parsed.data.map((block, index) => {
    if (block.type === "heading") return <h2 key={index} className="mt-10 font-display text-3xl font-semibold tracking-tight">{block.text}</h2>;
    if (block.type === "list") return <ul key={index} className="mt-5 grid gap-3">{block.items.map((item) => <li key={item} className="flex gap-3 leading-7 text-ink/68"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-coral" />{item}</li>)}</ul>;
    return <p key={index} className="mt-5 text-lg leading-8 text-ink/68">{block.text}</p>;
  })}</div>;
}
