import { render } from "@react-email/render";
import React from "react";

/**
 * Renders a React Email component to HTML string.
 */
export async function renderEmailToHtml(element: React.ReactElement): Promise<string> {
  return render(element);
}

/**
 * Renders a React Email component to plain text string.
 */
export async function renderEmailToText(element: React.ReactElement): Promise<string> {
  return render(element, { plainText: true });
}
