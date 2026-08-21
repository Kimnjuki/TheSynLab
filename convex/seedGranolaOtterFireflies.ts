import { mutation } from "./_generated/server";

/**
 * Seed: "Granola vs. Otter.ai vs. Fireflies.ai: The 2026 AI Meeting Assistant Comparison, Trust-Rated"
 *
 * Inserts the article into novaPosts under the "ai-tools" hub, along with:
 *   - authorProfiles (Jack Anderson — upsert by userId)
 *   - novaProducts stubs for Granola / Otter.ai / Fireflies.ai (only if missing)
 *   - novaPostProducts links (productRole: "compared", displayOrder 1–3)
 *   - novaPostMeta (AI summary URLs + trust score weighting)
 *   - novaContentSections (4 image sections)
 *   - internalLinks (3 confirmed live links — only where a target post exists)
 *   - hubKeywords (primary keyword assignment)
 *   - contentQualityAudits (honest checklist state)
 *
 * IMAGES (copied from assets/ to public/):
 *   - featuredImageUrl: /granola-meeting-notes-editor.png
 *   - galleryImages[0]: /granola-meeting-notes-editor.png
 *   - galleryImages[1]: /otter-live-transcript-view.png
 *   - galleryImages[2]: /fireflies-transcript-search-crm.png
 *   - galleryImages[3]: /synlab-comparison-worksheet.png
 *
 * PLACEHOLDERS (must be resolved before publishing):
 *   - authorId / authorProfiles.userId: "PLACEHOLDER_AUTHOR_USER_ID__jack-anderson"
 *   - aiDraftReviewedBy: "TODO_REPLACE_WITH_EDITOR_NAME_OR_ID"
 *   - schemaMarkup: image URL, author URL, reviewer, datePublished, dateModified, @id
 *   - internalLinks: targetPostId for scoring-hub / ai-tools / ai-tools/sales-support
 *
 * postStatus is intentionally "draft" — Checklist items #3 (screenshots), #6
 * (headshot/reviewer), and #10 (read-aloud pass) are NOT DONE per Part 4 of the
 * editorial package. Flip to "published" only after those close out.
 *
 * @see https://github.com/Kimnjuki/TheSynLab
 */
export const seedGranolaOtterFirefliesPost = mutation({
  args: {},
  handler: async (ctx) => {
    const slug = "granola-otter-fireflies-comparison";
    const now = Date.now();

    // ─── Check if the post already exists ────────────────────────────────
    const existing = await ctx.db
      .query("novaPosts")
      .withIndex("by_slug", (q) => q.eq("postSlug", slug))
      .first();

    // ─── Post content (verbatim from source document) ─────────────────────
    // [ SCREENSHOT: ... ] placeholders replaced with real image references
    // (alt text preserved verbatim from the doc).
    const postContent = `# Granola vs. Otter.ai vs. Fireflies.ai: The 2026 AI Meeting Assistant Comparison, Trust-Rated

Summarize this article with: ChatGPT | Perplexity

Claude | Grok

Main Takeaways

I rephrased each bullet below to be a standalone, featured-snippet-safe sentence - no bullet leans on another bullet or paragraph around it to understand the point, and none of the bullets stretch the research.

Granola captures meetings without a visible bot using device audio (best for one-on-one calls, client meetings, and founders seeking structured notes over shared transcripts)

Otter.ai focuses on transcription, captions, and a searchable archive (best for lectures, interviews, and teams seeking real-time collaboration)

Fireflies.ai combines meeting capture with CRM sync and workflow automation across 100+ tools (best for sales, customer-success, and recruiting teams that need conversations to fuel CRM processes)

SynLab’s Trust Score evaluates accuracy, privacy transparency, security certifications, retention policies, integration permissions, and support – so a given tool may earn a higher overall score despite lower scores in your own organization’s priority areas (like data retention)

Granola Business is $14/user/month as of mid-2026. Otter’s free plan is limited to 300 minutes of transcription and 30 minutes of recording per call. Fireflies is SOC 2 Type II and GDPR compliant at all price points (including free).

Never rely on an AI-generated summary or transcript as a real alternative to human note-taking, and always double-check critical details (names, figures, commitments) against the original conversation

What is Granola, Otter AI and Fireflies.ai?

Granola, Otter.ai, and Fireflies.ai are AI meeting assistants that capture conversations, transcripts, summarize discussions, and organize meeting records for later reference. These tools take the drudgery out of note-taking by doing most of the work for you - a product manager could read an AI-generated summary right after a customer interview instead of trying to reconstruct the conversation from memory hours or days later. The three tools have different approaches to recording that shape their impact on privacy, collaboration, and accuracy. Granola captures device audio without a visible bot in the meetings, while Otter.ai and Fireflies.ai typically join as a separate participant or process uploaded recordings. For additional context on how these tools compare in terms of security and third-party integrations, see our Trust Score and Integration Score overviews.

For more general comparisons, visit our AI Tools hub.

When we tested both tools on the same 45-minute discovery calls, the difference in transcription accuracy was not significant - both yielded roughly between 94-96% of words, with only a couple of minutes of audio that required additional context for clarification after a two-minute skim. Granola’s Trust score is lower because it captures your local machine’s audio, whereas Fireflies joins as a participant – and not all teams use the desktop app that lets them join as a bot (visible as ‘Fireflies Notetaker’) in their calls.

In our side-by-side test across 22 client calls, Fireflies' presence as a bot in 7/22 (32%) meetings raised questions and objections from prospects. Users asked why there was a bot in the meeting and if the call was being recorded – and became more guarded in their language than they might otherwise have been. Using Granola, we saw no participants and no pushback across the same set of meetings.

A sales objection is a sales objection, and a trustworthiness concern is a trustworthiness concern. We take both extremely seriously, which is why we built consent and capture model transparency into the very DNA of our Trust Score framework. One reflects the perception of the technology itself (meeting note-taking bot vs local desktop recording with no visible participant), and the other reflects the choice architecture around model training data.

What is Granola and Who Should Use It?

Granola is an AI-assisted note-taking tool that provides contextual verbatim-based assistance to human note-takers, but does not join meetings as a participant. It is ideal for knowledge workers who want structure and context assistance, but who do not want or need a bot to be visible and present in their meetings.

The tool is appropriate for one-on-ones and for product, sales, and internal meetings where a human can type in natural language prompts and receive helpful context assistance after the meeting has concluded. According to their privacy policy, Granola does not save or store meeting audio and uses encryption for all transcripts and notes both in transit and at rest. They do not have private by default – in fact, their model is trained on your data by default, unless you change your settings. Only available to the Enterprise plan, administrators can also turn off model training entirely for their team. Teams that handle sensitive information should make sure that they have turned off model training, rather than leaving it on (the default).

![Screenshot of Granola AI meeting notes editor showing transcript-based note enhancement.](/granola-meeting-notes-editor.png)

Is Granola better for meeting notes?

Granola is usually best when the quality/structure of one’s personal notes is more important than captions during the discussion or CRM-level automation, for example, for a founder having calls with investors and seeking to capture their objections, commitments, and follow-up action items.

As of mid-2026, Granola’s pricing is on a free-tier upgrade system (“Basic” is fully free but limited to about 25 saved notes / 30-day history), with a “Business” tier adding SSO and team-wide opt-out of AI model training for $14/user/month, unlimited history and integrations with Notion, HubSpot, Slack, and Zapier), and Enterprise ($35/user/month. The free plan serves as a clear entry point, not a “marketing” one – this is in contrast to Otter’s “Always Free” tier, which probably underperforms compared to competitors. We think this nuance would be interesting for your readers.

What is Otter.ai? How does Otter.ai work?

Otter.ai is a meeting assistant that emphasizes real-time captions, summaries, conversation intelligence, and search-ready transcripts.  Otter’s use cases include lectures, interviews, recurring meetings, research, and accessibility – a single use case we like is for an interviewer to search a conversation for mentions of a name/topic rather than combing through a full transcript. For context, see our larger Sales / Support Tools article about how meeting assistants tie in with helpdesk and CRM software.

Otter’s free tier includes 300 minutes of transcription and 20 AI Chat queries per month (matches the copy), but it’s much more limited per conversation (30 min capping), and the account-wide file import limit is 3 forever (not mentioned). Pro ($16.99/user/month ($8.33 / year) includes 1,200 min;

Business ($30/user/month ($19.99 / year) has unlimited transcription time, but a 4-hr per-meeting limit, and Enterprise is custom-programmable, including SOC 2, HIPAA, SSO, and SCIM support.

![Screenshot of Otter AI live transcription with speaker labels and summary panel.](/otter-live-transcript-view.png)

Is Otter.ai Better for Searchable Transcripts and Collaboration?

Otter.ai is a good option if you need to collaborate in real-time, search through transcripts, and share meeting content with your team; for instance, a group of researchers will probably find Otter useful as they can tag pricing, onboarding, and objections in dozens of calls. However, names, jargon, and speaker labels still need to be double-checked before a transcript can serve as an official record of conversation.

What Is Fireflies.ai and Who Is It Best For?

Fireflies.ai is an all-in-one conversation intelligence platform that allows you to record meetings, create transcripts, search through them, and collaborate in real time. It also offers to link meetings to CRM and other tools, making it helpful for sales, customer success, recruiting, and revenue teams. For instance, a sales rep can go over objections, mark competitor mentions, and forward specific notes to a CRM without having to type them in manually. Fireflies is SOC 2 Type II and GDPR compliant at all levels, including the Free plan. As for pricing, there is a limited Free plan, and users can upgrade to a higher-tier plan at $0, limited AI credits and storage), Pro ($10 / $18 per user/month, unlimited transcription, 8,000 minutes of storage per seat), Business ($19 / $29 per user/month, adds CRM sync, video recording, and conversation intelligence), Enterprise ($39/user/month (billed annually, offers HIPAA compliance, SSO support, and custom data retention). Note that Ask Fred and Smart Highlights features utilize a separate credit economy with limited complimentary monthly credits on all plans; this is the second most frequent reason for dissatisfaction among independent researchers who have contacted me.

![Screenshot of Fireflies AI transcript search and HubSpot CRM sync workflow.](/fireflies-transcript-search-crm.png)

Is Fireflies.ai Better for Sales and CRM Workflows?

Fireflies.ai is a better choice whenever meeting data needs to flow into sales, customer-success, or operations systems in an automated way, because the tool's value proposition is rooted in making conversation records accessible to repeatable processes, rather than being about the quality of the notes captured

Automation has governance implications, so teams should consider who has access to recordings, which integrations are permitted to write information back to a CRM, how long links are active for, and whether fields generated by AI need to be reviewed by a human before they appear in a database record.

How Do Granola, Otter.ai, and Fireflies.ai Compare?

The table below reflects the corrected figures from Part 1 of this package.

| Dimension | Granola | Otter.ai | Fireflies.ai |
| --- | --- | --- | --- |
| Capture workflow | Bot-free device capture + user notes | Live transcription + meeting bot | Meeting bot, uploads, and bot-free desktop mode |
| Free plan | ~25 saved notes / 30 days history | 300 min/month, 30-min call cap, 3 lifetime imports | $0, limited AI credits and storage |
| Entry paid tier | $14/user/month (Business, unlimited history) | $16.99/user/ month ($8.99 annual), 1,200 min/month | $18/user/ month ($10 annual), unlimited transcription |
| Top tier | $35/user/month (Enterprise, SSO) | Custom Enterprise (SSO, SCIM, HIPAA add-on) | $39/user/month (Enterprise, HIPAA, annual only) |
| Security posture | Encrypted at rest/in transit; trains on data unless opted out | Enterprise SSO/SCIM; HIPAA add-on available | SOC 2 Type II + GDPR on every tier including Free |
| Best fit | Private 1:1s, founder & consultant calls | Live captions, lectures, research, accessibility | Sales, CRM sync, customer success, recruiting |

Which Tool Does the Best AI Meeting Summaries?

Granola offers more decision-centric meeting summaries due to its basis in the user’s own notes rather than the entire transcript, while Otter and Fireflies provide better context for a summary that must be retrieved from a larger transcript or repository, e.g., a sales manager using Fireflies for a call-review process covering an extended team.

No summary should be taken as truth without verifying the decisions and commitments extracted against either the recording itself or the user’s recollection of the conversation, as accuracy varies significantly depending on group size, audio clarity, and the level of overlap between speakers.

How Accurate Are Their Transcripts?

Otter, Fireflies, and Granola can provide reasonably accurate transcripts, but accuracy depends significantly on the call’s quality and content, such as accents, jargon, and overlapping speech.

The initial version of this article included a specific word-error-rate (WER) % (“8–10% for Granola, 10–13% for Fireflies, 9–12% for Otter”) based on a 206 Pickuma report that TheSynLab was unable to verify independently. It has since been removed to avoid accusations of plagiarism against both the reader and the AI. What TheSynLab can confirm is that clean recordings with single speakers speaking English have an average word-error rate of 2–8% across the industry. Heavier accents, background noise, or group conversations increase the WER to approximately 15–25%, regardless of the provider. If TheSynLab has further queries about WER, he requests an independent transcript test (as per the ‘What Should You Test’ section below) with a particular focus on determining the error rate between the three services.

A Nairobi-based or otherwise non-US team reviewing either local proper nouns or using third-party software that utilizes an English UI should perform the accuracy test in their location and language rather than relying on a vendor’s English-centric WER.

How Should You Calculate a Trust Rating for Meeting Transcription Software?

TheSynLab's own Trust Score (0–100) and Integration Score (0–100) — detailed on our scoring methodology page — are built on the same idea this article's framework uses: accuracy, privacy transparency, security certification, retention policy, and support all get weighted and combined, rather than letting one strong category (like integrations) cover for a weak one (like unclear data retention).

| Trust category | Weight |
| --- | --- |
| Accuracy and consistency | 20% |
| Privacy and consent transparency | 15% |
| Security documentation and controls | 15% |
| Retention, deletion, and training policies | 15% |
| Reliability and summary quality | 10% |
| Integrations and permissions | 10% |
| Support and pricing transparency | 10% |
| Independent reputation | 5% |

The final score is a weighted average, not a subjective overall impression - a solution with great integrations but unclear retention policy would not get a high Trust score for privacy-sensitive conversations. Editorial Trust scores are determined by this very process, which is essentially a contrast between what Trustpilot or G2 review averages say (what customers have self-reported) and a consistent set of criteria applied to each reviewed solution.

When Should You Use Granola, Otter.ai, or Fireflies.ai?

- I like to use Granola when I want to have a conversation with someone, like when I am talking to someone about a product, when the founder of a company is talking to me, or when I am in a meeting and I want to take notes by hand. Granola is good for this because it helps me pay attention and take notes.

- For things like lectures or interviews, I use Otter.ai because it can write down what people are saying in real time. It is also good for meetings that happen every week. It helps me find what people said later. I can also share what was said with people.

- I use Fireflies.ai when I am talking to customers about buying something or when I want to remember what customers said so I can help them better. It also helps me keep track of what's going on with all of my customers, and I can search for anything that was said. Fireflies.ai is good for a lot of people to use at the time.

- Test-drive a solution before relying on it for your SSO, audit trails, retention policies, regulatory compliance, or other specialized needs.

- Follow the zero-trust security model for confidential conversations by default - ask for consent, limit sharing, and enforce deletion according to your team’s reasonable expectations.

What Should You Test Before Choosing an AI Meeting Assistant?

A serious evaluation should use the same conversations, same success criteria, and same speakers for each solution you’re comparing, if possible. Let us try out something with a small group of users and see how it works for different kinds of meetings, like when we show people our products, when we talk to people about sales, and when we have meetings with many speakers. We will test things, such as:

- Name recognition: does the recording get the names of people and places right, and does it understand special words and numbers that the users say? Does it capture all the details, like the product names, company names, and other identifiers, correctly in the recording of the product demos, sales conversations, and multi-speaker meetings?

- Action items: compare AI-captured decisions and action items with hand-written notes by real users.

- Search: find relevant passages, topics, and speakers by name using the search bar.

- Sharing controls: inspect links, permissions, and overall sharing experience - and test what happens when a user wishes to delete the conversation.

- Consent and transparency: are you notified about recordings always, sometimes, or never - and can other meeting participants see that as well?

- Support for your communication tools: Zoom, Google Meet, Microsoft Teams, mobile clients, face-to-face conversations, and other major platforms.

- Audio quality: accents, speaker genders, microphone quality, background noise, overlapping speech, and other variables.

- Permissions: before allowing your CRM or other tools to be written to, verify that you have full control over each integration step.

![Screenshot of TheSynLab worksheet comparing AI meeting assistant accuracy and privacy scores.](/synlab-comparison-worksheet.png)

Which AI Meeting Assistant Should You Trust?

There are options for conversation intelligence tools, including Granola, Otter.ai, and Fireflies.ai. Granola is great for meetings where you want notes that are structured and do not have any bots. Otter.ai specializes in transcripts and collaboration. Fireflies.ai has advanced search and automation capabilities. The best solution for your team is the one that matches their working style. You need to think about how accurate the tool is for your needs, how private the data is, who can access it, and for how long it is kept. These are all important factors, so you should try these features out yourself. Notes made by AI should be looked at like documents that need to be checked, not like they're completely correct.

Written by

Jack Anderson

Jack Anderson is a person who makes websites and helps companies automate their work. He also helps design systems for companies that use software as a service. Jack's work is about helping companies do things more efficiently by automating tasks. He uses tools like n8n, Zapier, Make and custom API integrations to do this. He wants to help companies be more reliable, work better, and be more efficient.

Over the years, Jack has looked at workflows for managing leads, synchronizing customer information, processing documents, supporting customers using AI assistants, synchronizing data and running businesses. He has worked with hundreds of cloud applications. Compared automation platforms to see how they work, how secure they are, how well they are governed, how flexible they are and how easy they are to maintain.

For this guide, Jack tried out n8n and Zapier. Make to see how they work. He looked at how to build workflows, send HTTP requests, integrate webhooks, use AI and other things. He did not just read what the companies said about their products; he actually tried them out. He compared the prices, options for hosting yourself tools for developers, and governance for businesses.

Jack's writing is, about how to actually do things: testing to see what works and giving recommendations based on facts. He wants to help businesses choose the automation platform that works best for them.

His areas of expertise include

- Making workflow automation architecture

- Using AI to automate businesses

- Implementing n8n, Zapier and Make

- Using REST APIs and webhook integrations

- Evaluating SaaS products

- Automating customer relationships and marketing

- Working with cloud infrastructure. Devops

- Making business processes better

Author profiles

- TheSynLab Author Profile: www.thesynlab.com

Reviewed by

Editorial Review

This article was checked by an editor to make sure it's accurate, consistent, and easy to understand. The editor looked at the platform's features, prices, and how it works, and made sure the information is relevant to real-life situations. They also checked the terms used and examples given to ensure everything is correct and up-to-date.

Recommended reviewer attribution

It is recommended to have a separate technical editor or subject-matter reviewer to ensure objectivity.

Example format

Reviewed by: Nicholas Michaels

Senior Automation Engineer / Technical Editor

Nicholas Michaels is an expert in automating workflows, connecting different systems through APIs, designing SaaS architecture, and creating technical documents. He checked this article to make sure it's accurate, complete, and of high quality.`;

    // ─── Post payload ────────────────────────────────────────────────────
    const patch = {
      authorId: "PLACEHOLDER_AUTHOR_USER_ID__jack-anderson",
      postTitle: "Granola vs. Otter.ai vs. Fireflies.ai: The 2026 AI Meeting Assistant Comparison, Trust-Rated",
      postSlug: slug,
      postExcerpt:
        "Granola, Otter.ai, and Fireflies.ai compared on accuracy, privacy, integrations, pricing, and workflow fit -- rated with TheSynLab's Trust Score methodology.",
      postContent,
      postStatus: "draft" as const,
      postType: "comparison" as const,
      hub: "ai-tools",
      featuredImageUrl: "/granola-meeting-notes-editor.png",
      galleryImages: [
        "/granola-meeting-notes-editor.png",
        "/otter-live-transcript-view.png",
        "/fireflies-transcript-search-crm.png",
        "/synlab-comparison-worksheet.png",
      ],
      seoTitle: "Granola vs. Otter.ai vs. Fireflies.ai: The 2026 AI Meeting Assistant Comparison, Trust-Rated",
      metaDescription:
        "Review Granola, Otter, and Fireflies with Trust ratings. Compare accuracy, privacy, integrations, pricing, and workflows to choose confidently.",
      metaKeywords:
        "granola vs otter vs fireflies, AI meeting assistant comparison, meeting transcription trust score",
      primaryKeyword: "granola vs otter vs fireflies",
      secondaryKeywords: [
        "granola ai meeting notes",
        "otter.ai review",
        "fireflies.ai review",
        "ai meeting assistant comparison",
        "meeting transcription trust score",
      ],
      canonicalUrl: "https://www.thesynlab.com/blog/granola-otter-fireflies-comparison",
      faqSchema: [
        {
          question: "Is Granola better for meeting notes?",
          answer:
            "Granola is often the strongest fit when the quality and structure of personal notes matter more than live captions or extensive CRM automation, such as founder or consultant calls where the user already knows what information matters most.",
        },
        {
          question: "Is Otter.ai better for searchable transcripts and collaboration?",
          answer:
            "Otter.ai is a practical choice when teams need live transcripts, searchable conversations, and shared access to meeting content, such as educators, researchers, and interviewers who need to locate specific quotes or themes later.",
        },
        {
          question: "Is Fireflies.ai better for sales and CRM workflows?",
          answer:
            "Fireflies.ai is a strong candidate when meeting data must move into sales, customer-success, or operational systems, because it connects conversation records to repeatable CRM and automation workflows.",
        },
        {
          question: "How accurate are Granola, Otter, and Fireflies transcripts?",
          answer:
            "All three can produce usable transcripts, but accuracy depends on audio conditions, accents, technical vocabulary, and speaker overlap. Clean single-speaker English audio typically runs a 2 to 8 percent word error rate across leading tools, rising to roughly 15 to 25 percent with heavy accents, background noise, or overlapping speech.",
        },
      ],
      schemaMarkup: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Granola vs. Otter.ai vs. Fireflies.ai: The 2026 AI Meeting Assistant Comparison, Trust-Rated",
        description:
          "Review Granola, Otter, and Fireflies with Trust ratings. Compare accuracy, privacy, integrations, pricing, and workflows to choose confidently.",
        image: "[INSERT: real hero image URL, e.g. https://thesynlab.com/images/granola-otter-fireflies-comparison-hero.jpg]",
        author: {
          "@type": "Person",
          name: "Jack Anderson",
          url: "[INSERT: https://thesynlab.com/author/jack-anderson]",
        },
        reviewedBy: {
          "@type": "Person",
          name: "[INSERT: reviewer name]",
          url: "[INSERT: reviewer profile URL]",
        },
        publisher: {
          "@type": "Organization",
          name: "TheSynLab",
          logo: {
            "@type": "ImageObject",
            url: "[INSERT: https://thesynlab.com/logo.png]",
          },
        },
        datePublished: "[INSERT: e.g. 2026-08-08]",
        dateModified: "[INSERT: e.g. 2026-08-08]",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "[INSERT: https://thesynlab.com/blog/granola-otter-fireflies-comparison]",
        },
      },
      hasAffiliateDisclosure: false,
      isLivingGuide: false,
      aiGeneratedDraft: true,
      aiDraftReviewedBy: "TODO_REPLACE_WITH_EDITOR_NAME_OR_ID",
      wordCount: 3298,
      readingTimeMinutes: 15,
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

    // ─── 0. Author profile (Jack Anderson) ────────────────────────────────
    const authorUserId = "PLACEHOLDER_AUTHOR_USER_ID__jack-anderson";
    const existingAuthor = await ctx.db
      .query("authorProfiles")
      .withIndex("by_user", (q) => q.eq("userId", authorUserId))
      .first();

    let authorProfileCreated = false;
    if (!existingAuthor) {
      await ctx.db.insert("authorProfiles", {
        userId: authorUserId,
        displayName: "Jack Anderson",
        title: "Automation & Integrations Editor",
        credentials: ["Workflow Automation", "AI Integration", "SaaS Evaluation"],
        expertise: [
          "Making workflow automation architecture",
          "Using AI to automate businesses",
          "Implementing n8n, Zapier and Make",
          "Using REST APIs and webhook integrations",
          "Evaluating SaaS products",
          "Automating customer relationships and marketing",
          "Working with cloud infrastructure, DevOps",
          "Making business processes better",
        ],
        bio: "Jack Anderson is a person who makes websites and helps companies automate their work. He also helps design systems for companies that use software as a service. Jack's work is about helping companies do things more efficiently by automating tasks. He uses tools like n8n, Zapier, Make and custom API integrations to do this. He wants to help companies be more reliable, work better, and be more efficient.",
        longBio:
          "Over the years, Jack has looked at workflows for managing leads, synchronizing customer information, processing documents, supporting customers using AI assistants, synchronizing data and running businesses. He has worked with hundreds of cloud applications. Compared automation platforms to see how they work, how secure they are, how well they are governed, how flexible they are and how easy they are to maintain.\n\nFor this guide, Jack tried out n8n and Zapier. Make to see how they work. He looked at how to build workflows, send HTTP requests, integrate webhooks, use AI and other things. He did not just read what the companies said about their products; he actually tried them out. He compared the prices, options for hosting yourself tools for developers, and governance for businesses.\n\nJack's writing is, about how to actually do things: testing to see what works and giving recommendations based on facts. He wants to help businesses choose the automation platform that works best for them.",
        personalSiteUrl: "https://www.thesynlab.com",
        articleCount: 0,
        reviewCount: 0,
        totalViews: 0,
        isFellow: false,
      });
      authorProfileCreated = true;
    }

    // ─── 2. Products (Granola / Otter.ai / Fireflies.ai) ──────────────────
    const productStubs = [
      {
        productName: "Granola",
        productSlug: "granola",
        hub: "ai-tools",
        category: "meeting-assistant",
        productType: "software",
        priceModel: "per_user",
        priceCurrency: "USD",
        price: 14,
        status: "active",
        isSponsored: false,
        sponsorDisclosed: false,
        verdictSummary: "Bot-free device-audio capture; best for private 1:1s and founder/consultant calls.",
        featuredImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format",
      },
      {
        productName: "Otter.ai",
        productSlug: "otter-ai",
        hub: "ai-tools",
        category: "meeting-assistant",
        productType: "software",
        priceModel: "per_user",
        priceCurrency: "USD",
        price: 16.99,
        status: "active",
        isSponsored: false,
        sponsorDisclosed: false,
        verdictSummary: "Live captions and searchable transcripts; best for lectures, research, and accessibility.",
        featuredImageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop&auto=format",
      },
      {
        productName: "Fireflies.ai",
        productSlug: "fireflies-ai",
        hub: "ai-tools",
        category: "meeting-assistant",
        productType: "software",
        priceModel: "per_user",
        priceCurrency: "USD",
        price: 18,
        status: "active",
        isSponsored: false,
        sponsorDisclosed: false,
        verdictSummary: "CRM sync and workflow automation; best for sales, customer success, and recruiting.",
        featuredImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&auto=format",
      },
    ];

    const productIds: Record<string, string> = {};
    let productsCreated = 0;
    for (const stub of productStubs) {
      const existingProduct = await ctx.db
        .query("novaProducts")
        .withIndex("by_slug", (q) => q.eq("productSlug", stub.productSlug))
        .first();
      if (existingProduct) {
        productIds[stub.productSlug] = existingProduct._id;
      } else {
        const id = await ctx.db.insert("novaProducts", stub);
        productIds[stub.productSlug] = id;
        productsCreated++;
      }
    }

    // ─── 3. novaPostProducts (compared, displayOrder 1–3) ─────────────────
    const comparedProducts = [
      { productSlug: "granola", displayOrder: 1 },
      { productSlug: "otter-ai", displayOrder: 2 },
      { productSlug: "fireflies-ai", displayOrder: 3 },
    ];

    // Remove existing links for this post, then re-insert
    const existingPostProducts = await ctx.db
      .query("novaPostProducts")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    for (const link of existingPostProducts) {
      await ctx.db.delete(link._id);
    }

    let postProductsCreated = 0;
    for (const cp of comparedProducts) {
      const productId = productIds[cp.productSlug];
      if (productId) {
        await ctx.db.insert("novaPostProducts", {
          postId,
          productId: productId as any,
          productRole: "compared",
          displayOrder: cp.displayOrder,
        });
        postProductsCreated++;
      }
    }

    // ─── 4. novaPostMeta (AI summary URLs + trust score weighting) ────────
    const metaRows = [
      {
        metaKey: "ai_summary_chatgpt_url",
        metaValue: "https://chat.openai.com/?q=Summarize+https://www.thesynlab.com/blog/granola-otter-fireflies-comparison",
      },
      {
        metaKey: "ai_summary_perplexity_url",
        metaValue: "https://www.perplexity.ai/?q=Summarize+https://www.thesynlab.com/blog/granola-otter-fireflies-comparison",
      },
      {
        metaKey: "ai_summary_claude_url",
        metaValue: "https://claude.ai/new?q=Summarize+https://www.thesynlab.com/blog/granola-otter-fireflies-comparison",
      },
      {
        metaKey: "ai_summary_grok_url",
        metaValue: "https://grok.com/?q=Summarize+https://www.thesynlab.com/blog/granola-otter-fireflies-comparison",
      },
      {
        metaKey: "trust_score_weighting",
        metaValue: JSON.stringify([
          { category: "Accuracy and consistency", weight: "20%" },
          { category: "Privacy and consent transparency", weight: "15%" },
          { category: "Security documentation and controls", weight: "15%" },
          { category: "Retention, deletion, and training policies", weight: "15%" },
          { category: "Reliability and summary quality", weight: "10%" },
          { category: "Integrations and permissions", weight: "10%" },
          { category: "Support and pricing transparency", weight: "10%" },
          { category: "Independent reputation", weight: "5%" },
        ]),
      },
    ];

    const existingMeta = await ctx.db
      .query("novaPostMeta")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    for (const row of existingMeta) {
      await ctx.db.delete(row._id);
    }

    let metaCreated = 0;
    for (const row of metaRows) {
      await ctx.db.insert("novaPostMeta", {
        postId,
        metaKey: row.metaKey,
        metaValue: row.metaValue,
      });
      metaCreated++;
    }

    // ─── 5. novaContentSections (4 image sections) ────────────────────────
    const imageSections = [
      {
        sectionType: "image",
        sectionTitle: "Granola meeting-notes editor",
        sectionContent: {
          imageUrl: "/granola-meeting-notes-editor.png",
          altText: "Screenshot of Granola AI meeting notes editor showing transcript-based note enhancement.",
          caption: "Granola's meeting-notes editor with transcript panel open.",
        },
        sortOrder: 1,
        isPublished: true,
      },
      {
        sectionType: "image",
        sectionTitle: "Otter.ai live transcript view",
        sectionContent: {
          imageUrl: "/otter-live-transcript-view.png",
          altText: "Screenshot of Otter AI live transcription with speaker labels and summary panel.",
          caption: "Otter.ai live transcript view with speaker labels visible.",
        },
        sortOrder: 2,
        isPublished: true,
      },
      {
        sectionType: "image",
        sectionTitle: "Fireflies.ai transcript search",
        sectionContent: {
          imageUrl: "/fireflies-transcript-search-crm.png",
          altText: "Screenshot of Fireflies AI transcript search and HubSpot CRM sync workflow.",
          caption: "Fireflies.ai transcript search with a CRM push action visible.",
        },
        sortOrder: 3,
        isPublished: true,
      },
      {
        sectionType: "image",
        sectionTitle: "TheSynLab comparison worksheet",
        sectionContent: {
          imageUrl: "/synlab-comparison-worksheet.png",
          altText: "Screenshot of TheSynLab worksheet comparing AI meeting assistant accuracy and privacy scores.",
          caption: "A filled-in TheSynLab comparison worksheet scoring transcript accuracy, privacy, and workflow reliability across the three tools.",
        },
        sortOrder: 4,
        isPublished: true,
      },
    ];

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

    // ─── 6. Content hub for "ai-tools" ────────────────────────────────────
    const existingHub = await ctx.db
      .query("contentHubs")
      .withIndex("by_slug", (q) => q.eq("slug", "ai-tools"))
      .first();

    const hubPatch = {
      slug: "ai-tools",
      name: "AI Tools",
      description: "AI tools comparisons, reviews, and workflow guides at TheSynLab.",
      pillarCount: (existingHub?.pillarCount ?? 0) + (existing ? 0 : 1),
      spokeCount: existingHub?.spokeCount ?? 0,
      totalWordCount: (existingHub?.totalWordCount ?? 0) + (existing ? 0 : 3298),
      lastUpdatedAt: now,
      seoTitle: "AI Tools Hub — Comparisons, Reviews & Trust Scores",
      metaDescription: "Explore AI tools comparisons, reviews, and workflow guides at TheSynLab.",
      isActive: true,
    };

    if (existingHub) {
      await ctx.db.patch(existingHub._id, hubPatch);
    } else {
      await ctx.db.insert("contentHubs", hubPatch);
    }

    // ─── 7. Internal links (only where a target post exists) ──────────────
    const existingLinks = await ctx.db
      .query("internalLinks")
      .withIndex("by_source", (q) => q.eq("sourcePostId", postId))
      .collect();
    for (const link of existingLinks) {
      await ctx.db.delete(link._id);
    }

    const linkTargets = [
      {
        anchorText: "our Trust Score and Integration Score overviews",
        hubSlug: "scoring-hub",
        linkType: "internal_reference",
      },
      {
        anchorText: "our AI Tools hub",
        hubSlug: "ai-tools",
        linkType: "internal_reference",
      },
      {
        anchorText: "our larger Sales / Support Tools article",
        hubSlug: "ai-tools/sales-support",
        linkType: "internal_reference",
      },
    ];

    let internalLinksCreated = 0;
    const internalLinkWarnings: string[] = [];
    for (const link of linkTargets) {
      // Try to find a target post by matching the hub slug against post slugs
      const allPosts = await ctx.db.query("novaPosts").collect();
      const targetPost = allPosts.find(
        (p) => p.postSlug === link.hubSlug || p.hub === link.hubSlug
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
      } else {
        internalLinkWarnings.push(
          `No target novaPosts row found for hubSlug "${link.hubSlug}" — link skipped. If the destination is a contentHubs entry, confirm whether targetPostId should point at a hub pillar post.`
        );
      }
    }

    // ─── 8. hubKeywords ───────────────────────────────────────────────────
    const existingKeyword = await ctx.db
      .query("hubKeywords")
      .withIndex("by_keyword", (q) => q.eq("keyword", "granola vs otter vs fireflies"))
      .first();

    if (existingKeyword) {
      await ctx.db.patch(existingKeyword._id, {
        hubSlug: "ai-tools",
        keyword: "granola vs otter vs fireflies",
        keywordType: "primary",
        contentStatus: "assigned",
        assignedPostId: postId,
        priority: 1,
      });
    } else {
      await ctx.db.insert("hubKeywords", {
        hubSlug: "ai-tools",
        keyword: "granola vs otter vs fireflies",
        keywordType: "primary",
        contentStatus: "assigned",
        assignedPostId: postId,
        priority: 1,
      });
    }

    // ─── 9. contentQualityAudits (honest checklist state) ─────────────────
    const existingAudit = await ctx.db
      .query("contentQualityAudits")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .first();

    const auditPatch = {
      postId,
      auditedAt: now,
      adSenseReadinessScore: 0,
      hasNamedAuthor: true,
      hasPublishDate: false,
      hasAffiliateDisclosure: false,
      hasAdDisclosure: false,
      wordCount: 3298,
      structureScore: 0,
      flags: [
        "5 screenshot placements still need real screenshots (Checklist #3)",
        "Author headshot and confirmed distinct reviewer still needed (Checklist #6)",
        "Final read-aloud pass not yet done (Checklist #10)",
      ],
      passesAdPolicyCheck: false,
      recommendations: [
        "Add real screenshots for all 5 [ SCREENSHOT: ... ] placements with alt text.",
        "Upload a real author headshot and set authorProfiles.avatarUrl.",
        "Confirm a distinct reviewer and fill schemaMarkup.article.reviewedBy.",
        "Replace all [INSERT: ...] placeholders in schemaMarkup with real values.",
        "Perform a final read-aloud pass for voice/flow before publishing.",
      ],
    };

    if (existingAudit) {
      await ctx.db.patch(existingAudit._id, auditPatch);
    } else {
      await ctx.db.insert("contentQualityAudits", auditPatch);
    }

    // ─── 10. sitemapEntries — intentionally NOT inserted ──────────────────
    // Per the editorial package, sitemapEntries must only be added once
    // postStatus flips to "published".

    return {
      seeded: true,
      postId,
      created: !existing,
      updated: !!existing,
      slug,
      postStatus: "draft",
      featuredImageUrl: "/granola-meeting-notes-editor.png",
      galleryImages: [
        "/granola-meeting-notes-editor.png",
        "/otter-live-transcript-view.png",
        "/fireflies-transcript-search-crm.png",
        "/synlab-comparison-worksheet.png",
      ],
      authorProfileCreated,
      productsCreated,
      postProductsCreated,
      metaCreated,
      contentSectionsCreated: imageSections.length,
      internalLinksCreated,
      hubKeywordAssigned: true,
      contentAuditSeeded: true,
      sitemapEntryCreated: false,
      warnings: [
        'authorId is "PLACEHOLDER_AUTHOR_USER_ID__jack-anderson" — resolve to a real novaUsers/authorProfiles userId before publishing.',
        'aiDraftReviewedBy is "TODO_REPLACE_WITH_EDITOR_NAME_OR_ID" — resolve to a real editor name/ID.',
        "schemaMarkup contains [INSERT: ...] placeholders (image URL, author URL, reviewer, datePublished, dateModified, @id) — fill in before publishing.",
        "postStatus is 'draft' — set to 'published' and add publishedAt timestamp when ready.",
        "sitemapEntries intentionally NOT inserted — add only once postStatus flips to 'published'.",
        ...internalLinkWarnings,
      ],
    };
  },
});