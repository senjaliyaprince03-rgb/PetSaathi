import { z } from "zod";

const paragraphBlock = z.object({ type: z.literal("paragraph"), text: z.string().trim().min(1).max(3000) });
const headingBlock = z.object({ type: z.literal("heading"), text: z.string().trim().min(1).max(200) });
const listBlock = z.object({ type: z.literal("list"), items: z.array(z.string().trim().min(1).max(500)).min(1).max(20) });

export const contentBodySchema = z.array(z.discriminatedUnion("type", [paragraphBlock, headingBlock, listBlock])).min(1).max(100);
export const createContentSchema = z.object({ slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120), type: z.string().trim().min(2).max(60), title: z.string().trim().min(5).max(180), excerpt: z.string().trim().min(20).max(400).optional(), primaryJob: z.string().trim().min(3).max(120), city: z.string().trim().max(100).optional(), body: contentBodySchema });
