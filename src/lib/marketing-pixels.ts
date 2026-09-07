/**
 * Marketing Pixel Tracking Utilities
 * 
 * Centralized helpers for firing conversion events to:
 * - Meta Pixel (Facebook Ads)
 * - Google Analytics 4
 * - Microsoft Clarity
 * 
 * Usage:
 * ```typescript
 * import { trackPurchase, trackLeadGeneration } from '@/lib/marketing-pixels';
 * 
 * trackPurchase({
 *   value: 1180,
 *   currency: 'INR',
 *   contentIds: ['booking_123'],
 * });
 * ```
 */

interface MetaPixelPurchaseEvent {
  value: number;
  currency: string;
  contentIds: string[];
  contentType?: string;
}

interface MetaPixelLeadEvent {
  contentName?: string;
  currency?: string;
  value?: number;
}

/**
 * Tracks purchase conversion in Meta Pixel
 * 
 * Fires after successful payment capture.
 * Required for Facebook Ads ROAS measurement.
 */
export function trackPurchase(data: MetaPixelPurchaseEvent): void {
  if (typeof window === "undefined") return;
  
  const fbq = (window as any).fbq;
  if (typeof fbq !== "function") {
    console.warn("[Marketing Pixels] Meta Pixel not loaded");
    return;
  }
  
  fbq("track", "Purchase", {
    value: data.value,
    currency: data.currency,
    content_type: data.contentType || "service",
    content_ids: data.contentIds,
  });
}

/**
 * Tracks lead generation in Meta Pixel
 * 
 * Fires when user submits lead magnet form (e.g., pet checklist download).
 */
export function trackLeadGeneration(data: MetaPixelLeadEvent): void {
  if (typeof window === "undefined") return;
  
  const fbq = (window as any).fbq;
  if (typeof fbq !== "function") {
    console.warn("[Marketing Pixels] Meta Pixel not loaded");
    return;
  }
  
  fbq("track", "Lead", {
    content_name: data.contentName,
    currency: data.currency,
    value: data.value,
  });
}

/**
 * Tracks booking initiation in Meta Pixel
 * 
 * Fires when user clicks "Book Now" or similar CTA.
 */
export function trackInitiateCheckout(data: { value: number; currency: string; contentIds: string[] }): void {
  if (typeof window === "undefined") return;
  
  const fbq = (window as any).fbq;
  if (typeof fbq !== "function") return;
  
  fbq("track", "InitiateCheckout", {
    value: data.value,
    currency: data.currency,
    content_ids: data.contentIds,
  });
}

/**
 * Tracks page view in Google Analytics 4
 * 
 * Note: Next.js @next/third-parties/google handles automatic page views.
 * Use this only for custom virtual page views.
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === "undefined") return;
  
  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") {
    console.warn("[Marketing Pixels] Google Analytics not loaded");
    return;
  }
  
  gtag("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Tracks custom event in Google Analytics 4
 */
export function trackGAEvent(eventName: string, parameters?: Record<string, any>): void {
  if (typeof window === "undefined") return;
  
  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") return;
  
  gtag("event", eventName, parameters);
}

/**
 * Tracks custom conversion event in Microsoft Clarity
 * 
 * Used for funnel analysis and session replay filtering.
 */
export function trackClarityEvent(eventName: string, properties?: Record<string, any>): void {
  if (typeof window === "undefined") return;
  
  const clarity = (window as any).clarity;
  if (typeof clarity !== "function") return;
  
  clarity("event", eventName, properties);
}
