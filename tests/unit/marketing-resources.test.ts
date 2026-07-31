import { describe, expect, it } from "vitest";

import {
  getLeadMagnetResource,
  leadMagnetSlugs,
} from "@/modules/marketing/resources";

describe("lead magnet resources", () => {
  it("exposes only registered, real resource routes", () => {
    expect(leadMagnetSlugs).toEqual(["new-pet-checklist"]);
    expect(getLeadMagnetResource("new-pet-checklist")).toMatchObject({
      title: "The calm first-week pet checklist",
      path: "/resources/new-pet-checklist",
    });
    expect(getLeadMagnetResource("new-pet-checklist").url).toMatch(
      /^https?:\/\/.+\/resources\/new-pet-checklist$/,
    );
  });
});
