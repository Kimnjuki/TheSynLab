/**
 * View tracking hook — counts page views per content and sends to GA4.
 * Falls back to localStorage when Convex is unavailable.
 * Used for measuring the 10x traffic growth target.
 */
import { useEffect, useState } from 'react';

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
    // Increment local view counter
    const newCount = incrementView(contentKey);
    setTotalViews(newCount);

    // Track session views (unique per session)
    const sessionViews = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
    if (!sessionViews.includes(contentKey)) {
      sessionViews.push(contentKey);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionViews));
      
      // Send to GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'content_view', {
          content_type: contentType,
          content_slug: slug,
          view_count: newCount,
          engagement_time_msec: 1
        });
      }
    }
  }, [contentKey]);

  return { totalViews, contentKey };
}

export function trackConversion(contentType: string, slug: string, conversionType: 'affiliate_click' | 'newsletter' | 'signup' | 'tool_use') {
  const contentKey = `${contentType}:${slug}:${conversionType}`;
  
  // Track in storage
  const stored = JSON.parse(localStorage.getItem('synlab_conversions') || '[]');
  stored.push({ contentKey, timestamp: Date.now() });
  localStorage.setItem('synlab_conversions', JSON.stringify(stored));

  // Send to GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', conversionType, {
      content_type: contentType,
      content_slug: slug,
      engagement_time_msec: 1
    });
  }
}

export function getConversionMetrics() {
  const stored = JSON.parse(localStorage.getItem('synlab_conversions') || '[]');
  const totals: Record<string, number> = {};
  for (const item of stored as { contentKey: string }[]) {
    totals[item.contentKey] = (totals[item.contentKey] || 0) + 1;
  }
  return totals;
}
