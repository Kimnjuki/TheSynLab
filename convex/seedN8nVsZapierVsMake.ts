import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Seed: "n8n vs Zapier AI vs Make.com: The Integration-Depth Comparison Guide"
 *
 * Inserts the article into novaPosts under the "gaming" hub per instruction,
 * along with taxonomy links, content sections, internal links, and sitemap entry.
 *
 * IMAGES (copied from assets/ to public/):
 *   - featuredImageUrl: /zapier-app-directory-lead-routing.png
 *   - galleryImages[0]: /zapier-app-directory-lead-routing.png
 *   - galleryImages[1]: /http-webhook-config-make-n8n.png
 *   - galleryImages[2]: /n8n-code-node-self-hosted-workflow.png
 *
 * PLACEHOLDERS (must be resolved before publishing):
 *   - authorId: "PLACEHOLDER_AUTHOR_ID__kim-anderson"
 *   - lastModifiedBy: "PLACEHOLDER_REVIEWER_ID__nicholas-jackson"
 *   - schemaMarkup: author URL, reviewer URL, datePublished, dateModified
 *   - internalLinks: "[LINK: n8n review]" has no URL yet
 *
 * @see https://github.com/Kimnjuki/TheSynLab
 */
export const seedN8nVsZapierVsMake = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "n8n-vs-zapier-ai-vs-make-com";
    const now = Date.now();

    // ─── Check if the post already exists ────────────────────────────────
    const existing = await ctx.db
      .query("novaPosts")
      .withIndex("by_slug", (q) => q.eq("postSlug", slug))
      .first();

    // ─── Post content (verbatim from source document) ─────────────────────
    const postContent = `# n8n vs Zapier AI vs Make.com: The Integration-Depth Comparison Guide

You already know n8n, Zapier AI, and Make.com automate work and connect apps. What many comparison guides overlook is that the difference between basic connectivity and deep native integrations is rarely acknowledged -- native connectors are simply the starting point. This guide highlights the major differences between the three tools and determines which one is best suited to your specific needs.

## Key Takeaways

- n8n, Zapier AI, and Make.com are three different ways to automate workflows, each with their own differences in the extent of integrations available, the level of customization and control, and the overall flexibility of deployment.
- Native integrations and connectors are not the sole determinant of a platform's breadth, depth, and reach -- they have to be evaluated in the context of available customization, control, and additional tools.
- Zapier AI wins in terms of the number of supported apps and overall simplicity of use.
- Make.com provides native integrations and advanced logic controls in a visual interface that offers more flexibility than Zapier but requires more technical expertise than n8n.
- n8n is better for technical users since it is open source and users can deploy the platform on their private servers.
- The decision to use n8n, Zapier AI, or Make.com will be based on the user's particular needs, the degree of customization and control needed, and the trade-offs between technical complexity and cost.

## What is n8n, Zapier AI and Make.com?

Three different takes on workflow automation are n8n, Zapier AI, and Make.com. All three platforms want to connect apps and protocols so data and actions can be passed between them without human intervention. The differences emerge when examining the scope of available native connectors, the degree of customization and control, and the tools provided to implement those customizations.

n8n is an open-source workflow automation tool that is designed to be self-hosted and deployed on private servers. It allows technically inclined users to design their own internal processes and scripts by combining database queries, API calls, and transformations with visual blocks. For instance, a developer can design an internal automation that uses an HTTP request node and JavaScript to update a database without relying on third-party tools. This approach has clear advantages over Zapier or Make.com in terms of security and customization, which makes n8n a good fit for technically proficient power users and organizations that have to comply with PII storage and processing regulations. [Learn more about n8n's capabilities here](https://thesynlab.com/products/n8n).

Zapier AI is an automation tool that focuses on rapid connectivity between thousands of disparate apps and services, most of which are popular among small businesses and large social media networks. A user can connect a lead generation application to email and project management tools and automate the process of lead nurturing. However, unlike with n8n, Zapier AI users would have to rely on pre-designed connections and actions. At the same time, the introduction of AI features reduces the technical complexity of automation, accelerating common operations. Say, a social media manager can use a ready-made CRM connector to collect leads and enrich the data with AI-generated insights, and that without writing a single line of code. Check out how Zapier artificial intelligence can help you streamline your operations here. [And discover more automation possibilities here.](https://thesynlab.com/hub/ai_workflow)

Make.com takes a middle ground between no-code and full customization by providing native visual blocks that have more logic and branching options than Zapier but are less flexible than n8n's coding options. Using Make's visual interface, an operations manager can design an automation that branches out depending on specific conditions while relying on pre-made templates and connections. It is a good choice for technically inclined but non-developer users who want to design moderately complex automation sequences without writing production-grade code. [Find out more about the features of Make's visual automation here](https://thesynlab.com/products/make-com). In practice, the true differentiator is rarely if ever, "no-code vs. code" - the biggest divergence tends to appear when a process requires an action the vendor never anticipated. Zapier and Make have more detailed filters and built-in actions, while n8n has a code node to write your required logic. Both have their merits, but neither is immune to the pitfalls of complex situations, and the details are often sorted out long after the sale.

## Why depth of integration matters for workflow automation

The reason for this has to do with the fact that the number of native connections only provides a very limited context for selection. At first glance, two platforms listing Slack and HubSpot as compatible apps may appear equal, but one may only allow basic automation while the other enables more involved conditional logic or advanced data transformation.

The number of native connectors directly influences the speed with which teams and individuals can design a working automation. According to Zapier's own website publicity, their platform connects "400+" AI tools to "9,000+" everyday applications. Meanwhile, their separate Zapier MCP (which focuses on connecting AI models such as Claude or ChatGPT) promises to connect all 9,000 of those apps via an individual integration and unlock "30,000+ actions". Such a disparity is most felt when a team's tech stack comprises mostly frequent collaborators (Gmail, Salesforce, Slack, Google Workspace) and is therefore much more interoperable out-of-the-box.

The growing prevalence of automation will continue to put a spotlight on the importance of integration depth long after selection. So, companies automate more and more processes each year. 60% of organizations have already automated at least one business process (Duke University, 2024). Meanwhile, 88% of organizations are predicted to use AI in at least one business function this year, up from 78% last year (McKinsey, The State of AI in 2025). It is in such a context that teams automating lead generation or management, content creation or curation, or other sophisticated processes, seek to build advanced but reliable logic. It is in such a context that the number of connections matters, and not always in an obvious way: a workflow may need to enrich a lead with additional data, identify the country of origin, and route the lead to a specific representative -- and fail at the simplest of retries if the CRM API integration has inadequate error recovery mechanisms. https://thesynlab.com/hub/ai_workflow

## How Do n8n, Zapier AI, and Make.com Compare on Integrations?

n8n, Zapier AI, and Make.com mostly differ in the number of software applications that can be integrated into the system and the level of customization available with each solution.

| Platform | Integration breadth | API flexibility | Branching & logic | Best fit |
|---|---|---|---|---|
| Zapier AI | Very high -- 9,000+ apps, 400+ AI tools | Good for mainstream use cases | Strong for simple-to-moderate workflows | Non-technical teams |
| Make.com | High, with strong visual modules | Strong via HTTP modules and visual mapping | Excellent for multi-step scenarios | Ops and automation builders |
| n8n | Moderate native library, strong API reach | Excellent for custom APIs and code | Advanced branching and logic | Developers and technical teams |

While Zapier has the most extensive list of potential integrations and Make offers a visual workflow designer, n8n is the most customizable with the option to use self-hosting and contribute to the open-source community. Zapier AI appears to be the most developed in terms of breadth and ease of use, which aligns with the brand positioning strategy, so a sales team would be able to connect a prospecting database, CRM system, and email marketing service with ease. Make.com is likely the best fit for a company that wants to design data flow scenarios visually without writing a single line of code, although advanced features may become unavailable at more complex levels. Meanwhile, n8n is the most suitable integration platform for a security-conscious enterprise that wants to avoid using a third-party SaaS due to compliance or regulatory restrictions. Its open-source nature allows such a company to customize the application's code directly or request bespoke functions from the development team instead of relying on what Zapier or Make designers have prepared publicly.

https://thesynlab.com/products/n8n . https://thesynlab.com/hub/ai_workflow .

## Which Platform Is Best for AI Workflow Automation?

All three platforms allow embedding of AI steps, but they differ drastically in the degree of control an agent has over models, orchestration, and execution. Zapier is best for fast, AI-assisted actions, Make.com is best for visual workflows with embedded AI decisions, and n8n provides the best control for complex pipelines requiring model orchestration.

### Zapier AI for fast AI actions

Zapier AI is best suited for teams of any size that want to employ AI to perform actions across hundreds of applications while avoiding the complexity of authentication and rate-limiting management. It makes Zapier ideal for actual production use cases such as AI-driven lead qualification, email drafting, and ticket routing without requiring a team to build internal engineering capacity around these AI tools.

### Make for visual AI automation

Make is best for teams or individuals who want to design visual workflows with embedded AI as one of the decision blocks, and therefore it often serves as a compromise between no-code and more powerful but complex n8n. This is especially true for mid-market marketers and operations teams that want to design their own visual orchestration with AI steps included.

### n8n for advanced AI pipelines

n8n is the best open-source platform for advanced use cases that require agent orchestration, self-hosting, and full customization of every single step, including embedded AI steps. It is often used to build agent-based copilots and automation stacks for large enterprises where control and auditing of every single LLM call is required. To learn more about n8n for embedded AI, please visit the comparison page at https://thesynlab.com/hub/ai_workflow

One important nuance, which is often overlooked when comparing these products, is that embedded AI steps in any of these three platforms do not have native built-in robust error handling, retry logic, or rate-limiting protection. The same broken or hallucinating LLM call that would be caught and automatically retried in a Zapier AI-based workflow would cause a production outage in a self-hosted n8n due to the lack of built-in protections. This trade-off is fair, considering the level of control n8n offers, but should be carefully considered by technical teams building their own automation infrastructure before attempting to run production-grade AI workflows.

## What is the best tool for developers, non-technical teams and enterprises?

Each platform is optimized for a different level of control and complexity, so the right fit is more about who is building the workflow than the workflow itself.

| Persona | Best platform | Why it fits |
|---|---|---|
| Developers | n8n | Custom code, self-hosting, API control |
| Non-technical teams | Zapier AI | Fast setup, large app ecosystem, low friction |
| Visual automation builders | Make.com | Strong branching, mapping, and scenario design |
| Enterprises with data-control needs | n8n | Self-hosting and infrastructure flexibility |
| Marketing and ops teams | Make.com or Zapier AI | Balance of ease, speed, and app coverage |

Developers are likely to choose n8n for its low-code flexibility and branching options for automating internal APIs, whereas non-technical users lean towards Zapier AI for its intuitive interface and Make.com for its visual complexity; all three tools allow hosting private workflows in the cloud, but not necessarily on the same infrastructure. https://thesynlab.com/hub/intelligent-home

## When Would You Choose n8n as the Automation Tool Instead of Zapier or Make?

n8n is a better choice than Zapier AI or Make.com when a user needs to build an automation that is more complex in terms of branching, uses their own hosting, or has custom coding needs a fixed set of tools cannot provide. For instance, n8n is the platform of choice in cases where a regulated company needs to host sensitive data on their infrastructure instead of a third-party service, as opposed to Make or Zapier. Similarly, a development team building proprietary software or apps for third parties would benefit from n8n's webhook-based events and customizable nodes that can take third-party APIs as an input. A developer would be more inclined to use Zapier AI or Make.com in favor of n8n if their project's complexity did not require branching, custom coding, or private hosting. https://thesynlab.com/scoring-hub

## What Examples of Workflows Make Sense for Each Tool?

Lead routing, CRM data updates, data-heavy AI operations, content production, and similar tasks are to varying degrees better automated with one tool versus the other, with complexity being the determining factor. Lead routing is a typical use case for Zapier AI, which can be used to route leads from a form to a CRM, notify a team in Slack, and send out a confirmation email or an email from an AI agent. CRM updates, data synchronization, and similar operations are better automated with Make, which can process updates in real-time, branch into different automations depending on the input, and update multiple services beyond the CRM. Content production and AI agent training are better handled with n8n due to it having more options for interacting with external APIs, such as accessing an LLM to generate text with a specified topic and later insert it into a web page.

## What Tools and Practical Applications Matter Most?

Native integrations, HTTP/webhook connectors, custom code nodes, AI modules, and self-hosting are the features that ultimately differentiate the platforms once the initial excitement of automating some simple tests dies out.

### Native integrations

are undoubtedly the most crucial ones, but only if your team has already identified the particular app they need Zapier-type connectors for; the overall breadth and readiness of Zapier's catalog are its defining strength in this category.

### HTTP and webhook connectors

In cases when a native connector is unavailable or does not provide a specific endpoint, HTTP and webhook connectors become essential. Both Make's visual HTTP modules and n8n's HTTP Request node allow users to connect to custom API or niche tools that are not available.

Make's visual HTTP modules plus n8n's HTTP Request node let you connect to any custom API or niche tools if a native connector is unavailable or no particular endpoint is supported.

## What Should You Do Next?

The most productive next step is auditing the current stack, building out a list of required integrations, and testing one workflow in each tool before choosing one for development. Start by making a list of necessary apps and mark what kind of integration they might need (native, webhook-based, or API driven), and remember that n8n has a critical advantage if the stack features several unique tools, as Zapier's database of native "applications" is significantly smaller than n8n's. [LINK: n8n review] Build the same basic workflow (form to CRM to Slack, for example) in each tool and compare the ease of setup, error handling, and long-term maintenance before selecting the winner, instead of making assumptions about complexity up front. The decision should be made based on the balance between depth and breadth -- Zapier will generally beat the others in speed and variety, Make in visual design, and n8n in customization and code-level options, but the requirements for a particular project often change as the team works with the tools and grows more familiar with their limitations and possibilities.

## Conclusion

Zapier, n8n, and Make.com all offer a similar set of services to automate work and connect different applications, but have different strengths and weaknesses. Zapier provides the deepest catalog of native "applications," Make has the best visual tools for non-developers, and n8n offers the most flexibility and customization for those who know how to code -- but the actual choice should always be made on a case-by-case basis and depends on the complexity of the required operations, the available technical expertise, and the projected long-term needs of the team.

## About the Author

Written by Kim Anderson, full-stack web developer and ops consultant who has implemented n8n/Zapier/Make for 30+ clients

Reviewed by Nicholas Jackson, senior engineer who has operated these systems at scale`;

    // ─── Post payload ────────────────────────────────────────────────────
    const patch = {
      authorId: "PLACEHOLDER_AUTHOR_ID__kim-anderson",
      postTitle: "n8n vs Zapier AI vs Make.com: The Integration-Depth Comparison Guide",
      postSlug: slug,
      postExcerpt:
        "You already know n8n, Zapier AI, and Make.com automate work and connect apps. What many comparison guides overlook is that the difference between basic connectivity and deep native integrations is rarely acknowledged. This guide highlights the major differences between the three tools and determines which one is best suited to your specific needs.",
      postContent,
      postStatus: "draft" as const,
      postType: "comparison" as const,
      hub: "gaming",
      featuredImageUrl: "/zapier-app-directory-lead-routing.png",
      galleryImages: [
        "/zapier-app-directory-lead-routing.png",
        "/http-webhook-config-make-n8n.png",
        "/n8n-code-node-self-hosted-workflow.png",
      ],
      seoTitle: "n8n vs Zapier AI vs Make.com: The Integration-Depth Comparison Guide",
      metaDescription:
        "A comparison of n8n, Zapier AI, and Make.com by integration depth, AI capability, and pricing fit.",
      metaKeywords:
        "n8n, Zapier AI, Make.com, workflow automation, integration depth, AI workflow automation",
      primaryKeyword: "n8n vs Zapier AI vs Make.com",
      secondaryKeywords: [
        "workflow automation comparison",
        "AI workflow automation",
        "Zapier AI vs Make.com",
        "n8n integrations",
        "self-hosted automation platform",
      ],
      canonicalUrl: "https://www.thesynlab.com/blog/n8n-vs-zapier-ai-vs-make-com",
      tldrSummary:
        "n8n, Zapier AI, and Make.com automate workflows differently: Zapier AI wins on breadth of supported apps and simplicity; Make.com offers native integrations and advanced logic in a visual interface with more flexibility than Zapier but more complexity than n8n; n8n is best for technical users because it is open source and self-hostable. Native integrations alone don't determine a platform's real depth -- that also depends on customization, control, and available tooling.",
      wordCount: 1900,
      readingTimeMinutes: 9,
      hasAffiliateDisclosure: false,
      isLivingGuide: false,
      aiGeneratedDraft: false,
      schemaMarkup: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "n8n vs Zapier AI vs Make.com: The Integration-Depth Comparison Guide",
        description:
          "A comparison of n8n, Zapier AI, and Make.com by integration depth, AI capability, and pricing fit.",
        author: {
          "@type": "Person",
          name: "[Author Full Name]",
          url: "https://www.thesynlab.com/authors/[author-slug]",
        },
        reviewedBy: {
          "@type": "Person",
          name: "[Reviewer Full Name]",
        },
        publisher: {
          "@type": "Organization",
          name: "TheSynLab",
          logo: {
            "@type": "ImageObject",
            url: "https://www.thesynlab.com/logo.png",
          },
        },
        datePublished: "[YYYY-MM-DD]",
        dateModified: "[YYYY-MM-DD]",
        mainEntityOfPage: "https://www.thesynlab.com/blog/n8n-vs-zapier-ai-vs-make-com",
      },
      faqSchema: [
        {
          question: "What are n8n, Zapier AI, and Make.com?",
          answer:
            "They are workflow automation platforms that connect apps and move data between them without manual work: n8n is open-source and built for self-hosting and custom code, Zapier AI is a broad app-first platform built for fast setup, and Make.com is a visual platform positioned between the two.",
        },
        {
          question: "Which platform is best for AI workflow automation?",
          answer:
            "Zapier AI is strongest for fast AI-assisted actions across many apps, Make.com is strongest for visual AI workflows with branching, and n8n is strongest for advanced AI pipelines that need custom logic or self-hosting.",
        },
        {
          question: "When should you choose n8n over Zapier or Make?",
          answer:
            "Choose n8n when a workflow needs self-hosting, custom APIs, advanced branching, or reusable code that a fixed connector library cannot express. Choose Zapier or Make when speed of setup matters more than that level of control.",
        },
      ],
      lastModifiedBy: "PLACEHOLDER_REVIEWER_ID__nicholas-jackson",
      viewCount: existing?.viewCount ?? 0,
      uniqueViewCount: existing?.uniqueViewCount ?? 0,
    };

    // ─── Insert or update the post ────────────────────────────────────────
    let postId = existing?._id;
    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      postId = await ctx.db.insert("novaPosts", patch);
    }

    if (!postId) {
      return { seeded: false, error: "Failed to create or find post" };
    }

    // ─── 0. Author profiles ──────────────────────────────────────────────
    // Create authorProfiles for Kim Anderson (author) and Nicholas Jackson (reviewer)
    const authors = [
      {
        userId: "PLACEHOLDER_AUTHOR_USER_ID__kim-anderson",
        displayName: "Kim Anderson",
        title: "Full-Stack Web Developer & Ops Consultant",
        credentials: ["Full-Stack Web Development", "Ops Consulting"],
        expertise: ["Workflow Automation", "n8n", "Zapier", "Make.com"],
        bio: "Full-stack web developer and ops consultant who has implemented n8n/Zapier/Make for 30+ clients.",
        articleCount: 0,
        reviewCount: 0,
        totalViews: 0,
        isFellow: false,
      },
      {
        userId: "PLACEHOLDER_REVIEWER_USER_ID__nicholas-jackson",
        displayName: "Nicholas Jackson",
        title: "Senior Engineer (Reviewer)",
        credentials: ["Senior Engineering"],
        expertise: ["Workflow Automation", "Systems at Scale", "n8n", "Zapier", "Make.com"],
        bio: "Senior engineer who has operated n8n, Zapier, and Make.com systems at scale.",
        articleCount: 0,
        reviewCount: 0,
        totalViews: 0,
        isFellow: false,
      },
    ];

    let authorProfilesCreated = 0;
    for (const author of authors) {
      const existingProfile = await ctx.db
        .query("authorProfiles")
        .withIndex("by_user", (q) => q.eq("userId", author.userId))
        .first();
      if (!existingProfile) {
        await ctx.db.insert("authorProfiles", author);
        authorProfilesCreated++;
      }
    }

    // ─── 1. Link taxonomy for "gaming" hub ────────────────────────────────
    let taxonomy = await ctx.db
      .query("novaTaxonomies")
      .withIndex("by_slug", (q) => q.eq("taxonomySlug", "gaming"))
      .first();

    let taxonomyId: string;
    if (taxonomy) {
      taxonomyId = taxonomy._id;
    } else {
      taxonomyId = await ctx.db.insert("novaTaxonomies", {
        taxonomyName: "Gaming",
        taxonomySlug: "gaming",
        taxonomyType: "hub",
        description: "Gaming hub — automation, tools, and workflow comparisons for the gaming industry",
        count: 0,
      });
    }

    // Link post -> taxonomy
    const existingLink = await ctx.db
      .query("novaPostTaxonomies")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .first();
    if (!existingLink) {
      await ctx.db.insert("novaPostTaxonomies", {
        postId,
        taxonomyId: taxonomyId as any,
      });
    }

    // ─── 2. Content hub for "gaming" ───────────────────────────────────────
    const existingHub = await ctx.db
      .query("contentHubs")
      .withIndex("by_slug", (q) => q.eq("slug", "gaming"))
      .first();

    const hubPatch = {
      slug: "gaming",
      name: "Gaming",
      description: "Workflow automation comparisons, tools, and guides for the gaming industry at TheSynLab.",
      pillarCount: (existingHub?.pillarCount ?? 0) + (existing ? 0 : 1),
      spokeCount: existingHub?.spokeCount ?? 0,
      totalWordCount: (existingHub?.totalWordCount ?? 0) + (existing ? 0 : 1900),
      lastUpdatedAt: now,
      seoTitle: "Gaming Automation Tools & Workflow Guides",
      metaDescription: "Explore workflow automation comparisons, tools, and guides for gaming at TheSynLab.",
      isActive: true,
    };

    if (existingHub) {
      await ctx.db.patch(existingHub._id, hubPatch);
    } else {
      await ctx.db.insert("contentHubs", hubPatch);
    }

    // ─── 3. novaContentSections (image sections) ──────────────────────────
    const imageSections = [
      {
        sectionType: "image",
        sectionTitle: "Native integrations",
        sectionContent: {
          imageUrl: "/zapier-app-directory-lead-routing.png",
          altText: "Browse Zapier AI app directory for lead routing automation",
          caption: "Zapier app directory while setting up a lead-routing Zap.",
        },
        sortOrder: 1,
        isPublished: true,
      },
      {
        sectionType: "image",
        sectionTitle: "HTTP and webhook connectors",
        sectionContent: {
          imageUrl: "/http-webhook-config-make-n8n.png",
          altText: "Configure webhook automation for a custom API workflow",
          caption: "HTTP module configuration in Make and the HTTP Request node in n8n, side by side.",
        },
        sortOrder: 2,
        isPublished: true,
      },
      {
        sectionType: "image",
        sectionTitle: "HTTP and webhook connectors (continued)",
        sectionContent: {
          imageUrl: "/n8n-code-node-self-hosted-workflow.png",
          altText: "configure webhook automation for a custom API workflow",
          caption: "Make's visual HTTP modules plus n8n's HTTP Request node.",
        },
        sortOrder: 3,
        isPublished: true,
      },
    ];

    // Remove existing sections and re-insert
    const existingSections = await ctx.db
      .query("novaContentSections")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    for (const section of existingSections) {
      await ctx.db.delete(section._id);
    }

    for (const section of imageSections) {
      await ctx.db.insert("novaContentSections", {
        postId,
        ...section,
      });
    }

    // ─── 4. Internal links (only those with resolved URLs) ────────────────
    // Remove existing internal links for this post
    const existingLinks = await ctx.db
      .query("internalLinks")
      .withIndex("by_source", (q) => q.eq("sourcePostId", postId))
      .collect();
    for (const link of existingLinks) {
      await ctx.db.delete(link._id);
    }

    // Internal links that point to known slugs — we try to match them
    const linkTargets: Array<{
      anchorText: string;
      targetUrl: string;
      linkType: string;
      hubSlug: string | undefined;
    }> = [
      {
        anchorText: "Learn more about n8n's capabilities here",
        targetUrl: "https://thesynlab.com/products/n8n",
        linkType: "product",
        hubSlug: undefined,
      },
      {
        anchorText: "And discover more automation possibilities here.",
        targetUrl: "https://thesynlab.com/hub/ai_workflow",
        linkType: "hub",
        hubSlug: "ai_workflow",
      },
      {
        anchorText: "Find out more about the features of Make's visual automation here",
        targetUrl: "https://thesynlab.com/products/make-com",
        linkType: "product",
        hubSlug: undefined,
      },
      {
        anchorText: "https://thesynlab.com/hub/ai_workflow",
        targetUrl: "https://thesynlab.com/hub/ai_workflow",
        linkType: "hub",
        hubSlug: "ai_workflow",
      },
      {
        anchorText: "https://thesynlab.com/products/n8n",
        targetUrl: "https://thesynlab.com/products/n8n",
        linkType: "product",
        hubSlug: undefined,
      },
      {
        anchorText: "https://thesynlab.com/hub/intelligent-home",
        targetUrl: "https://thesynlab.com/hub/intelligent-home",
        linkType: "hub",
        hubSlug: "intelligent-home",
      },
      {
        anchorText: "https://thesynlab.com/scoring-hub",
        targetUrl: "https://thesynlab.com/scoring-hub",
        linkType: "internal_tool",
        hubSlug: undefined,
      },
    ];

    // For each link target, try to find a matching target post by slug or product
    // If not found, we still insert the link with the external URL as reference
    // (Convex internalLinks requires targetPostId, so we need a fallback)
    // Actually, looking at the schema, internalLinks requires targetPostId: v.id("novaPosts")
    // So we can only link to existing posts. We'll insert what we can find.
    let internalLinksCreated = 0;
    for (const link of linkTargets) {
      // Try to extract a slug from the URL
      const urlParts = link.targetUrl.split("/");
      const lastSegment = urlParts[urlParts.length - 1];

      // Try to find a matching post by checking if the slug appears in post slugs
      const allPosts = await ctx.db.query("novaPosts").collect();
      const targetPost = allPosts.find(
        (p) => p.postSlug === lastSegment || p.canonicalUrl === link.targetUrl
      );

      if (targetPost) {
        await ctx.db.insert("internalLinks", {
          sourcePostId: postId,
          targetPostId: targetPost._id,
          anchorText: link.anchorText,
          linkType: link.linkType,
          hubSlug: link.hubSlug,
          createdAt: now,
        });
        internalLinksCreated++;
      }
    }

    // ─── 5. Sitemap entry ─────────────────────────────────────────────────
    const existingSitemapRows = await ctx.db
      .query("sitemapEntries")
      .withIndex("by_type", (q) => q.eq("sitemapType", "post"))
      .collect();
    const sitemapUrl = "/blog/n8n-vs-zapier-ai-vs-make-com";
    const existingSitemap = existingSitemapRows.find((row) => row.url === sitemapUrl);
    if (!existingSitemap) {
      await ctx.db.insert("sitemapEntries", {
        url: sitemapUrl,
        sitemapType: "post",
        priority: 0.8,
        changefreq: "monthly",
        lastmod: now,
        isIndexable: true,
        entityId: String(postId),
        entityType: "novaPosts",
      });
    }

    let sitemapCreated = existingSitemap ? 0 : 1;

    return {
      seeded: true,
      postId,
      created: !existing,
      updated: !!existing,
      slug,
      featuredImageUrl: "/zapier-app-directory-lead-routing.png",
      galleryImages: [
        "/zapier-app-directory-lead-routing.png",
        "/http-webhook-config-make-n8n.png",
        "/n8n-code-node-self-hosted-workflow.png",
      ],
      taxonomyLinked: true,
      authorProfilesCreated,
      contentSectionsCreated: imageSections.length,
      internalLinksCreated,
      sitemapEntryCreated: sitemapCreated,
      warnings: [
        'authorId is "PLACEHOLDER_AUTHOR_ID__kim-anderson" — resolve to a real novaUsers/authorProfiles userId before publishing.',
        'lastModifiedBy is "PLACEHOLDER_REVIEWER_ID__nicholas-jackson" — resolve to a real userId.',
        "schemaMarkup contains [Author Full Name], [author-slug], [Reviewer Full Name], [YYYY-MM-DD] placeholders — fill in before publishing.",
        "The [LINK: n8n review] placeholder in the 'What Should You Do Next?' section has no URL — resolve before publishing.",
        "postStatus is 'draft' — set to 'published' and add publishedAt timestamp when ready.",
      ],
    };
  },
});