// studio/sanity.config.ts
// Configuration for PetSaathi Content Studio

const sanityConfig = {
  name: "default",
  title: "PetSaathi Content Studio",
  projectId: process.env.SANITY_PROJECT_ID || "petsaathi",
  dataset: process.env.SANITY_DATASET || "production",
  schema: {
    types: [
      {
        name: "article",
        title: "Journal Article",
        type: "document",
        fields: [
          { name: "title", type: "string", title: "Title" },
          { name: "slug", type: "slug", options: { source: "title" } },
          { name: "body", type: "text", title: "Body Content" },
          { name: "publishedAt", type: "datetime", title: "Published Date" },
          { name: "expertReviewed", type: "boolean", title: "Veterinary Expert Reviewed" },
        ],
      },
    ],
  },
};

export default sanityConfig;
