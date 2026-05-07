/**
 * Production-friendly seed mutation.
 * Seeds products, quiz data, and Trust Index snapshots.
 * Call from Convex dashboard or: npx convex run seedProductionData:seedProductionData
 */
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const seedProductionData = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Record<string, any> = {};

    // ── 1. Products ──────────────────────────────────────────────
    const existingProducts = await ctx.db.query("novaProducts").first();
    if (!existingProducts) {
      const productsData = [
        { productName:"ClickUp", productSlug:"clickup", manufacturer:"ClickUp", category:"Productivity Software", subcategory:"All-in-One Platform", productType:"saas", hub:"ai_workflow", price:5, priceCurrency:"USD", priceModel:"subscription", description:"All-in-one productivity platform", features:["Custom Views","Time Tracking","Docs","Goals"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","Win","Mac","iOS","Android"],mobile_app:true,integrations:"1000+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop", officialWebsite:"https://clickup.com" },
        { productName:"Todoist", productSlug:"todoist", manufacturer:"Doist", category:"Productivity Software", subcategory:"Task Management", productType:"saas", hub:"productivity", price:4, priceCurrency:"USD", priceModel:"subscription", description:"Simple task manager", features:["Natural Language Input","Project Templates","Labels","Reminders"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","Win","Mac","iOS","Android"],mobile_app:true,integrations:"60+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop", officialWebsite:"https://todoist.com" },
        { productName:"Asana", productSlug:"asana", manufacturer:"Asana", category:"Productivity Software", subcategory:"Project Management", productType:"saas", hub:"productivity", price:10.99, priceCurrency:"USD", priceModel:"subscription", description:"Work management platform", features:["Timeline","Portfolios","Workload","Goals"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","Win","Mac","iOS","Android"],mobile_app:true,integrations:"200+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop", officialWebsite:"https://asana.com" },
        { productName:"Notion", productSlug:"notion", manufacturer:"Notion Labs", category:"Productivity Software", subcategory:"All-in-One Workspace", productType:"saas", hub:"productivity", price:10, priceCurrency:"USD", priceModel:"subscription", description:"Unified workspace", features:["Block Editor","Databases","Templates","Wiki"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","Win","Mac","iOS","Android"],mobile_app:true,integrations:"100+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop", officialWebsite:"https://notion.so" },
        { productName:"Slack", productSlug:"slack", manufacturer:"Salesforce", category:"Collaboration", subcategory:"Messaging", productType:"saas", hub:"collaboration", price:8, priceCurrency:"USD", priceModel:"subscription", description:"Team messaging", features:["Channels","Direct Messages","Huddles","Canvas"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","Win","Mac","iOS","Android"],mobile_app:true,integrations:"2400+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&h=600&fit=crop", officialWebsite:"https://slack.com" },
        { productName:"Canva", productSlug:"canva", manufacturer:"Canva", category:"Design", subcategory:"Graphic Design", productType:"saas", hub:"productivity", price:12.99, priceCurrency:"USD", priceModel:"subscription", description:"Online graphic design", features:["Templates","Drag & Drop Editor","Brand Kit","Magic Studio"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","iOS","Android"],mobile_app:true,integrations:"100+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop", officialWebsite:"https://canva.com" },
        { productName:"HubSpot", productSlug:"hubspot", manufacturer:"HubSpot", category:"Marketing", subcategory:"CRM", productType:"saas", hub:"martech", price:45, priceCurrency:"USD", priceModel:"subscription", description:"All-in-one CRM", features:["CRM","Email Marketing","Social Media","Analytics"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","iOS","Android"],mobile_app:true,integrations:"500+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop", officialWebsite:"https://hubspot.com" },
        { productName:"GitHub", productSlug:"github", manufacturer:"Microsoft", category:"Developer Tools", subcategory:"Version Control", productType:"saas", hub:"productivity", price:4, priceCurrency:"USD", priceModel:"subscription", description:"Code hosting & collaboration", features:["Git Repos","Issues","Pull Requests","Actions"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web","Win","Mac","iOS","Android"],mobile_app:true,integrations:"1000+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop", officialWebsite:"https://github.com" },
        { productName:"Zapier", productSlug:"zapier", manufacturer:"Zapier", category:"Automation", subcategory:"Workflow Automation", productType:"saas", hub:"ai_workflow", price:19.99, priceCurrency:"USD", priceModel:"subscription", description:"No-code automation", features:["Zaps","Multi-step Workflows","Filters","Formatters"], specifications:{free_tier:true,max_users:"Unlimited",platforms:["Web"],mobile_app:true,integrations:"5000+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop", officialWebsite:"https://zapier.com" },
        { productName:"Grammarly", productSlug:"grammarly", manufacturer:"Grammarly", category:"Writing", subcategory:"AI Writing Assistant", productType:"saas", hub:"productivity", price:12, priceCurrency:"USD", priceModel:"subscription", description:"AI writing assistant", features:["Grammar Check","Tone Detection","Plagiarism Check","Generative AI"], specifications:{free_tier:true,max_users:"Individual",platforms:["Web","Win","Mac","iOS","Android"],mobile_app:true,integrations:"500k+"}, status:"active", isSponsored:false, sponsorDisclosed:false, featuredImageUrl:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop", officialWebsite:"https://grammarly.com" },
      ];
      for (const p of productsData) {
        await ctx.db.insert("novaProducts", p);
      }
      results.products = { seeded: true, count: productsData.length };
    } else {
      const count = (await ctx.db.query("novaProducts").collect()).length;
      results.products = { seeded: false, message: "Already seeded", count };
    }

    // Build product slug → ID map
    const allProducts = await ctx.db.query("novaProducts").collect();
    const productBySlug = new Map(allProducts.map((p: any) => [p.productSlug, p._id]));
    const ids = (slugs: string[]) => slugs.map(s => productBySlug.get(s)).filter(Boolean);

    // ── 2. Quiz Questions ────────────────────────────────────────
    const existingQ = await ctx.db.query("quizQuestions").first();
    if (!existingQ) {
      const questions = [
        { questionText:"What's your primary role?", questionKey:"primary_role", questionType:"single_choice" as const, category:"role", sortOrder:1, isActive:true, options:[
          { id:"content_creator", label:"Content Creator / Marketer", valueTag:"content", icon:"pen-tool" },
          { id:"developer", label:"Developer / Engineer", valueTag:"dev", icon:"code-2" },
          { id:"ops", label:"Operations / Admin", valueTag:"ops", icon:"settings" },
          { id:"exec", label:"Executive / Founder", valueTag:"exec", icon:"briefcase" },
          { id:"support", label:"Customer Support", valueTag:"support", icon:"headphones" },
        ]},
        { questionText:"How big is your team?", questionKey:"team_size", questionType:"single_choice" as const, category:"team", sortOrder:2, isActive:true, options:[
          { id:"solo", label:"Just me", valueTag:"solo" },
          { id:"small", label:"2-10 people", valueTag:"small" },
          { id:"medium", label:"11-50 people", valueTag:"medium" },
          { id:"large", label:"50+ people", valueTag:"large" },
        ]},
        { questionText:"What's your biggest workflow challenge?", questionKey:"workflow_challenge", questionType:"multi_choice" as const, category:"workflow", sortOrder:3, isActive:true, options:[
          { id:"task_management", label:"Task & project management", valueTag:"task" },
          { id:"communication", label:"Team communication", valueTag:"communication" },
          { id:"content", label:"Content creation & distribution", valueTag:"content" },
          { id:"automation", label:"Process automation", valueTag:"automation" },
          { id:"analytics", label:"Reporting & data analysis", valueTag:"analytics" },
        ]},
        { questionText:"What's your monthly budget per seat?", questionKey:"budget", questionType:"single_choice" as const, category:"budget", sortOrder:4, isActive:true, options:[
          { id:"free", label:"Free only", valueTag:"free" },
          { id:"low", label:"Under $10/mo", valueTag:"low" },
          { id:"mid", label:"$10-$30/mo", valueTag:"mid" },
          { id:"high", label:"$30-$100/mo", valueTag:"high" },
          { id:"unlimited", label:"No limit", valueTag:"unlimited" },
        ]},
        { questionText:"Which category matters most?", questionKey:"preferred_category", questionType:"single_choice" as const, category:"preference", sortOrder:5, isActive:true, options:[
          { id:"productivity", label:"Productivity & project management", valueTag:"productivity" },
          { id:"marketing", label:"Marketing & content", valueTag:"marketing" },
          { id:"dev", label:"Development & IT", valueTag:"dev" },
          { id:"collab", label:"Team collaboration", valueTag:"collab" },
          { id:"ai", label:"AI tools & automation", valueTag:"ai" },
        ]},
        { questionText:"How important are integrations?", questionKey:"integrations_importance", questionType:"single_choice" as const, category:"preference", sortOrder:6, isActive:true, options:[
          { id:"standalone", label:"I prefer standalone tools", valueTag:"standalone" },
          { id:"some", label:"Nice to have", valueTag:"some" },
          { id:"important", label:"Important — needs API access", valueTag:"important" },
          { id:"critical", label:"Critical — must connect everything", valueTag:"critical" },
        ]},
      ];
      for (const q of questions) {
        await ctx.db.insert("quizQuestions", q);
      }
      results.quizQuestions = { seeded: true, count: questions.length };
    } else {
      results.quizQuestions = { seeded: false, message: "Already exists" };
    }

    // ── 3. Quiz Result Rules ────────────────────────────────────────
    const existingR = await ctx.db.query("quizResultRules").first();
    if (!existingR) {
      const rules = [
        { ruleName:"Content Creator Stack", conditions:{roles:["content_creator"],budgetRanges:["low","mid"],workflowAreas:["content","task_management"]}, recommendedProductIds:ids(["canva","notion","grammarly"]), primaryUseCase:"content_creation", confidenceScore:8.5, isActive:true },
        { ruleName:"Marketing Team Stack", conditions:{roles:["content_creator"],budgetRanges:["mid","high"],workflowAreas:["content","analytics","automation"]}, recommendedProductIds:ids(["canva","notion","hubspot"]), primaryUseCase:"marketing", confidenceScore:8, isActive:true },
        { ruleName:"Small Team Productivity", conditions:{roles:["ops","exec"],teamSizes:["solo","small"],workflowAreas:["task_management","communication","automation"]}, recommendedProductIds:ids(["asana","notion","slack"]), primaryUseCase:"productivity", confidenceScore:8.5, isActive:true },
        { ruleName:"Developer Stack", conditions:{roles:["developer"],workflowAreas:["task_management"],budgetRanges:["free","low","mid"]}, recommendedProductIds:ids(["github","todoist","sentry"]), primaryUseCase:"development", confidenceScore:9, isActive:true },
        { ruleName:"Enterprise Productivity", conditions:{roles:["ops","exec"],teamSizes:["medium","large"],workflowAreas:["task_management","communication"]}, recommendedProductIds:ids(["asana","clickup","slack"]), primaryUseCase:"productivity", confidenceScore:7.5, isActive:true },
        { ruleName:"Solo Creator Stack", conditions:{roles:["content_creator","exec"],teamSizes:["solo"],budgetRanges:["free","low"],workflowAreas:["content","task_management"]}, recommendedProductIds:ids(["canva","notion","grammarly"]), primaryUseCase:"content_creation", confidenceScore:8, isActive:true },
        { ruleName:"Automation-First Stack", conditions:{workflowAreas:["automation"],budgetRanges:["mid","high"]}, recommendedProductIds:ids(["zapier","notion","clickup"]), primaryUseCase:"automation", confidenceScore:8, isActive:true },
        { ruleName:"Sales & CRM Stack", conditions:{roles:["exec","ops"],teamSizes:["small","medium"],workflowAreas:["analytics","automation","communication"]}, recommendedProductIds:ids(["hubspot","notion","slack"]), primaryUseCase:"sales", confidenceScore:8, isActive:true },
        { ruleName:"General Best Stack", conditions:{}, recommendedProductIds:ids(["notion","clickup","zapier"]), primaryUseCase:"general", confidenceScore:6, isActive:true },
      ];
      for (const r of rules) {
        await ctx.db.insert("quizResultRules", r);
      }
      results.quizResultRules = { seeded: true, count: rules.length };
    } else {
      results.quizResultRules = { seeded: false, message: "Already exists" };
    }

    // ── 4. Trust Index Snapshots ──────────────────────────────────
    const hubs = [
      { slug:"productivity", label:"Productivity", productSlugs:["notion","todoist","clickup","asana","grammarly"] },
      { slug:"ai-software", label:"AI Software", productSlugs:[] },
      { slug:"smart-home", label:"Smart Home", productSlugs:[] },
      { slug:"office-hardware", label:"Office Hardware", productSlugs:[] },
      { slug:"martech", label:"MarTech", productSlugs:["hubspot","canva"] },
      { slug:"collaboration", label:"Collaboration", productSlugs:["slack"] },
    ];

    let hubsSeeded = 0;
    for (const hub of hubs) {
      const entries = hub.productSlugs
        .map((slug, i) => {
          const pid = productBySlug.get(slug);
          if (!pid) return null;
          return {
            rank: i + 1,
            productId: pid,
            trustScore: Math.round((8.5 - i * 0.5) * 10) / 10,
            integrationScore: Math.round((7.5 - i * 0.4) * 10) / 10,
            rankDelta: i === 0 ? 1 : i === 1 ? -1 : 0,
            badge: i === 0 ? "top_rated" : undefined,
          };
        })
        .filter(Boolean);

      // Unset previous current
      const prev = await ctx.db
        .query("trustIndexSnapshots")
        .withIndex("by_hub_current", (q) => q.eq("hubSlug", hub.slug).eq("isCurrent", true))
        .take(1);
      for (const p of prev) await ctx.db.patch(p._id, { isCurrent: false });

      await ctx.db.insert("trustIndexSnapshots", {
        hubSlug: hub.slug,
        snapshotMonth: new Date().getMonth() + 1,
        snapshotYear: new Date().getFullYear(),
        isCurrent: true,
        rankedEntries: entries,
        publishedAt: Date.now(),
        editorialNotes: `Auto-seeded snapshot for ${hub.label}`,
      });
      hubsSeeded++;
    }
    results.trustIndexSnapshots = { hubsSeeded };

    return results;
  },
});
