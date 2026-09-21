/**
 * View tracking hook — counts page views per content and sends to GA4.
 * Falls back to localStorage when Convex is unavailable.
 * Used for measuring the 10x traffic growth target.
 *
 * AN-3: events must NOT carry a hand-written `engagement_time_msec`. GA4 computes
 * engagement time from the gap between events; sending `engagement_time_msec: 1`
 * (the previous implementation) overrode that calculation for every content view
 * and collapsed "Average engagement time" to ~0.17s site-wide.
 */
import { useEffect, useState } from 'react';
import { isAnalyticsEnabled, trackEvent } from '@/lib/analytics';

const VIEW_STORAGE_KEY = 'synlab_view_counts';
const SESSION_KEY = 'synlab_session_views';

interface ViewCounts {
  [key: string]: number;
}

function getStoredViews(): ViewCounts {
  try {
    return JSON.parse(localStorage.getItem(VIEW_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function incrementView(contentKey: string): number {
  const views = getStoredViews();
  views[contentKey] = (views[contentKey] || 0) + 1;
  localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(views));
  return views[contentKey];
}

export function getViewCount(contentKey: string): number {
  return getStoredViews()[contentKey] || 0;
}

export function getAllViewCounts(): { key: string; views: number }[] {
  const counts = getStoredViews();
  return Object.entries(counts)
    .filter(([key]) => key.startsWith('product:') || key.startsWith('article:'))
    .map(([key, views]) => ({ key, views }))
    .sort((a, b) => b.views - a.views);
}

export function useViewTracking(contentType: 'article' | 'product' | 'tool' | 'hub', slug: string) {
  const [totalViews, setTotalViews] = useState(0);
  const contentKey = `${contentType}:${slug}`;

  useEffect(() => {
    if (!slug) return;

    // Increment local view counter
    const newCount = incrementView(contentKey);
    setTotalViews(newCount);

    // Track session views (unique per session)
    const sessionViews: string[] = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
    if (!sessionViews.includes(contentKey)) {
      sessionViews.push(contentKey);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionViews));

      // Send to GA4 (no-op for bots / localhost / unconsented clients — see lib/analytics)
      if (isAnalyticsEnabled()) {
        trackEvent('engagement', 'content_view', contentKey, newCount);
      }
    }
  }, [contentKey, contentType, slug]);

  return { totalViews, contentKey };
}

export function trackConversion(contentType: string, slug: string, conversionType: 'affiliate_click' | 'newsletter' | 'signup' | 'tool_use') {
  const contentKey = `${contentType}:${slug}:${conversionType}`;

  // Track in storage
  try {
    const stored: { contentKey: string; timestamp: number }[] = JSON.parse(
      localStorage.getItem('synlab_conversions') || '[]'
    );
    stored.push({ contentKey, timestamp: Date.now() });
    localStorage.setItem('synlab_conversions', JSON.stringify(stored));
  } catch {
    // storage unavailable — still send the analytics event below
  }

  // Send to GA4
  if (isAnalyticsEnabled()) {
    trackEvent('commerce', conversionType, `${contentType}:${slug}`);
  }
}

export function getConversionMetrics() {
  try {
    const stored = JSON.parse(localStorage.getItem('synlab_conversions') || '[]');
    const totals: Record<string, number> = {};
    for (const item of stored as { contentKey: string }[]) {
      totals[item.contentKey] = (totals[item.contentKey] || 0) + 1;
    }
    return totals;
  } catch {
    return {} as Record<string, number>;
  }
}

