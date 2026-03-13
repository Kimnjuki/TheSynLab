import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LandingPageResult {
  url: string;
  is_functional: boolean;
  status_code: number | null;
  has_privacy_policy: boolean;
  has_terms_of_service: boolean;
  has_cookie_notice: boolean;
  has_excessive_popups: boolean;
  load_time_ms: number | null;
  issues: string[];
  score: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result: LandingPageResult = {
      url,
      is_functional: false,
      status_code: null,
      has_privacy_policy: false,
      has_terms_of_service: false,
      has_cookie_notice: false,
      has_excessive_popups: false,
      load_time_ms: null,
      issues: [],
      score: 0,
    };

    const startTime = Date.now();

    try {
      // Validate URL format
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        result.issues.push("Invalid URL protocol - must be HTTP or HTTPS");
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch the landing page
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AdComplianceBot/1.0)",
        },
      });

      clearTimeout(timeoutId);

      result.status_code = response.status;
      result.load_time_ms = Date.now() - startTime;

      if (response.ok) {
        result.is_functional = true;
        const html = await response.text();
        const htmlLower = html.toLowerCase();

        // Check for privacy policy
        result.has_privacy_policy = 
          htmlLower.includes("privacy policy") ||
          htmlLower.includes("privacy-policy") ||
          htmlLower.includes("/privacy") ||
          htmlLower.includes("datenschutz");

        // Check for terms of service
        result.has_terms_of_service =
          htmlLower.includes("terms of service") ||
          htmlLower.includes("terms-of-service") ||
          htmlLower.includes("/terms") ||
          htmlLower.includes("terms and conditions") ||
          htmlLower.includes("nutzungsbedingungen");

        // Check for cookie notice
        result.has_cookie_notice =
          htmlLower.includes("cookie") ||
          htmlLower.includes("gdpr") ||
          htmlLower.includes("consent");

        // Check for excessive popups (heuristic)
        const popupIndicators = [
          "popup",
          "modal",
          "overlay",
          "lightbox",
          "interstitial",
        ];
        const popupCount = popupIndicators.filter(indicator => 
          (htmlLower.match(new RegExp(indicator, "g")) || []).length > 3
        ).length;
        result.has_excessive_popups = popupCount >= 2;

        // Collect issues
        if (!result.has_privacy_policy) {
          result.issues.push("Missing privacy policy link");
        }
        if (!result.has_terms_of_service) {
          result.issues.push("Missing terms of service link");
        }
        if (result.has_excessive_popups) {
          result.issues.push("Potentially excessive popups detected");
        }
        if (result.load_time_ms > 5000) {
          result.issues.push("Slow page load time (>5 seconds)");
        }

      } else {
        result.is_functional = false;
        result.issues.push(`Page returned error status: ${response.status}`);
        
        if (response.status === 404) {
          result.issues.push("Page not found (404)");
        } else if (response.status >= 500) {
          result.issues.push("Server error detected");
        }
      }

    } catch (fetchError) {
      result.is_functional = false;
      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          result.issues.push("Page load timeout (>10 seconds)");
        } else {
          result.issues.push(`Failed to load page: ${fetchError.message}`);
        }
      }
    }

    // Calculate score (0-100)
    let score = 100;
    if (!result.is_functional) score -= 50;
    if (!result.has_privacy_policy) score -= 20;
    if (!result.has_terms_of_service) score -= 10;
    if (result.has_excessive_popups) score -= 15;
    if (result.load_time_ms && result.load_time_ms > 5000) score -= 5;
    
    result.score = Math.max(0, score);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Landing page check error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
