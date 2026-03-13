import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PolicyRule {
  id: string;
  level_id: number;
  level_name: string;
  severity: string;
  category: string;
  keywords: string[];
  instruction: string;
  requires_certification: boolean;
  age_restriction: number | null;
}

interface Violation {
  level: number;
  category: string;
  rule: string;
  matched_keywords: string[];
  severity: string;
  description: string;
  ai_confidence: number;
}

interface AdContent {
  title: string;
  description?: string;
  content: string;
  destination_url?: string;
  category?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adContent, adId } = await req.json() as { adContent: AdContent; adId?: string };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase configuration missing");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch active policy rules
    const { data: policyRules, error: rulesError } = await supabase
      .from("ad_policy_rules")
      .select("*")
      .eq("is_active", true)
      .order("level_id", { ascending: true });

    if (rulesError) throw rulesError;

    // Combine all ad content for analysis
    const fullContent = `
Title: ${adContent.title}
Description: ${adContent.description || ""}
Content: ${adContent.content}
Destination URL: ${adContent.destination_url || ""}
Category: ${adContent.category || ""}
    `.trim();

    // Step 1: Keyword-based pre-screening
    const keywordViolations: Violation[] = [];
    
    for (const rule of policyRules as PolicyRule[]) {
      const matchedKeywords: string[] = [];
      const contentLower = fullContent.toLowerCase();
      
      for (const keyword of rule.keywords || []) {
        if (contentLower.includes(keyword.toLowerCase())) {
          matchedKeywords.push(keyword);
        }
      }
      
      if (matchedKeywords.length > 0) {
        keywordViolations.push({
          level: rule.level_id,
          category: rule.category,
          rule: rule.instruction,
          matched_keywords: matchedKeywords,
          severity: rule.severity,
          description: `Keyword match detected: ${matchedKeywords.join(", ")}`,
          ai_confidence: 0.8,
        });
      }
    }

    // Step 2: AI-powered deep analysis
    const systemPrompt = `You are an advertising compliance expert. Analyze the following ad content for policy violations.

Policy Rules to check:
${policyRules?.map((r: PolicyRule) => `
Level ${r.level_id} (${r.level_name}) - ${r.severity}:
Category: ${r.category}
Keywords: ${r.keywords?.join(", ") || "N/A"}
Instruction: ${r.instruction}
`).join("\n")}

Analyze for:
1. Prohibited content (illegal, discriminatory, adult, misinformation, counterfeit, malware)
2. Restricted content requiring certification or age-gating (alcohol, gambling, healthcare, financial, political, dating)
3. Editorial standards (grammar, clickbait, personal attributes)
4. Landing page concerns (if URL provided)

Be thorough but avoid false positives. Consider context.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this ad content:\n\n${fullContent}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_violations",
              description: "Report any policy violations found in the ad content",
              parameters: {
                type: "object",
                properties: {
                  violations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        level: { type: "integer", enum: [1, 2, 3, 4] },
                        category: { type: "string" },
                        rule: { type: "string" },
                        severity: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                        description: { type: "string" },
                        confidence: { type: "number", minimum: 0, maximum: 1 }
                      },
                      required: ["level", "category", "rule", "severity", "description", "confidence"]
                    }
                  },
                  overall_risk_score: { type: "integer", minimum: 0, maximum: 100 },
                  recommendation: { type: "string", enum: ["approve", "reject", "requires_review", "flagged"] },
                  summary: { type: "string" }
                },
                required: ["violations", "overall_risk_score", "recommendation", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "report_violations" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    let aiAnalysis = {
      violations: [] as any[],
      overall_risk_score: 0,
      recommendation: "approve" as string,
      summary: "No issues detected"
    };

    if (toolCall?.function?.arguments) {
      try {
        aiAnalysis = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error("Failed to parse AI response:", e);
      }
    }

    // Merge keyword and AI violations
    const allViolations = [
      ...keywordViolations,
      ...aiAnalysis.violations.map((v: any) => ({
        level: v.level,
        category: v.category,
        rule: v.rule,
        matched_keywords: [],
        severity: v.severity,
        description: v.description,
        ai_confidence: v.confidence || 0.9,
      }))
    ];

    // Deduplicate violations by category
    const uniqueViolations = allViolations.reduce((acc, violation) => {
      const key = `${violation.level}-${violation.category}`;
      if (!acc[key] || acc[key].ai_confidence < violation.ai_confidence) {
        acc[key] = violation;
      }
      return acc;
    }, {} as Record<string, Violation>);

    const finalViolations = Object.values(uniqueViolations);

    // Determine final status
    let finalStatus = aiAnalysis.recommendation;
    const hasCritical = finalViolations.some(v => v.severity === "CRITICAL");
    const hasHigh = finalViolations.some(v => v.severity === "HIGH");

    if (hasCritical) {
      finalStatus = "rejected";
    } else if (hasHigh) {
      finalStatus = "requires_review";
    }

    // Calculate compliance score (0-100, higher is better)
    const complianceScore = Math.max(0, 100 - aiAnalysis.overall_risk_score);

    // Store violations if adId provided
    if (adId && finalViolations.length > 0) {
      const violationRecords = finalViolations.map(v => ({
        ad_id: adId,
        violation_level: v.level,
        violation_category: v.category,
        violation_rule: v.rule,
        matched_keywords: v.matched_keywords,
        severity: v.severity,
        description: v.description,
        ai_confidence: v.ai_confidence,
      }));

      const { error: insertError } = await supabase
        .from("ad_compliance_violations")
        .insert(violationRecords);

      if (insertError) {
        console.error("Failed to store violations:", insertError);
      }

      // Update ad submission status
      const { error: updateError } = await supabase
        .from("ad_submissions")
        .update({
          status: finalStatus,
          compliance_score: complianceScore,
        })
        .eq("id", adId);

      if (updateError) {
        console.error("Failed to update ad status:", updateError);
      }

      // Log audit entry
      await supabase.from("ad_compliance_audit_log").insert({
        ad_id: adId,
        action: "ai_scan",
        actor_type: "ai",
        new_status: finalStatus,
        details: {
          violations_count: finalViolations.length,
          compliance_score: complianceScore,
          summary: aiAnalysis.summary,
        },
      });
    }

    return new Response(
      JSON.stringify({
        status: finalStatus,
        compliance_score: complianceScore,
        violations: finalViolations,
        summary: aiAnalysis.summary,
        risk_score: aiAnalysis.overall_risk_score,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
