"use client";

import { Ban, Eye, Search } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

import { StatusPill } from "@/components/portal/dashboard-ui";
import { Button } from "@/components/ui/button";

type Partner = {
  id: string;
  slug: string;
  displayName: string;
  category: string;
  status: string;
  contactEmail: string | null;
  _count: {
    verifications: number;
    services: number;
  };
};

export function AdminPartnerTable({ partners }: { partners: Partner[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(partners.map((p) => p.category)))];

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = partner.displayName.toLowerCase().includes(search.toLowerCase()) || 
                          (partner.contactEmail && partner.contactEmail.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "ALL" || partner.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${activeCategory === category ? "bg-indigo text-paper" : "bg-cream/50 text-ink/80 hover:bg-cream"}`}
            >
              {category.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/80" />
          <input
            type="text"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-11 w-full rounded-full border border-ink/12 bg-cream/45 pl-10 pr-4 text-sm font-normal outline-none transition focus:border-indigo focus:ring-3 focus:ring-indigo/10"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-ink/[0.07] bg-paper shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/5 bg-cream/30 text-xs uppercase tracking-wider text-ink/80">
              <tr>
                <th className="px-6 py-4 font-semibold">Partner</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Services</th>
                <th className="px-6 py-4 font-semibold text-center">Verifications</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="transition hover:bg-cream/20">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{partner.displayName}</p>
                      <p className="text-xs text-ink/80">{partner.contactEmail || "No email"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-saffron/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink/80">
                        {partner.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={partner.status} />
                    </td>
                    <td className="px-6 py-4 text-center text-ink/80 font-medium">
                      {partner._count.services}
                    </td>
                    <td className="px-6 py-4 text-center text-ink/80 font-medium">
                      {partner._count.verifications}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/partners/${partner.id}` as Route} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo/5 text-indigo transition hover:bg-indigo/15">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-coral/5 text-coral transition hover:bg-coral/15" title="Suspend Partner">
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-ink/80">
                    No partners found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
