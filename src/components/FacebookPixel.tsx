/**
 * Facebook Pixel integration
 * Tracks page views, tool usage, and conversions
 */
import { useEffect } from 'react';

const FB_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID || '';

export function FacebookPixel() {
  useEffect(() => {
    if (!FB_PIXEL_ID) return;

    // Initialize pixel
    const fbe = window as any;
    fbe.fbq = fbe.fbq || function() {
      (fbe.fbq.q = fbe.fbq.q || []).push(arguments);
    };
    fbe._fbq = fbe._fbq || fbe.fbq;
    fbe.fbq('init', FB_PIXEL_ID);
    fbe.fbq('track', 'PageView');

    // Load script
    const script = document.createElement('script');
    script.defer = true;
    script.src = `https://connect.facebook.net/en_US/fbevents.js`;
    document.head.appendChild(script);

    // NoScript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, []);

  return null;
}

/** Track a Facebook conversion event */
export function trackFbEvent(eventName: string, params?: Record<string, unknown>) {
  const fbe = window as any;
  if (fbe.fbq) {
    fbe.fbq('track', eventName, params);
  }
}
