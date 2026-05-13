import { readFileSync, writeFileSync } from 'fs';

const content = readFileSync('src/data/staticProductData.ts', 'utf-8');

const productFaqs = {
  slack: [
    { question: "Is Slack free?", answer: "Slack offers a free tier with 90-day message history, 10 apps, and one-to-one video calls. Paid plans start at $8.25/user/month." },
    { question: "Can I use Slack for external communication?", answer: "Yes, Slack Connect allows direct messaging with people outside your organization. Free tier includes one Slack Connect channel." },
    { question: "What integrations does Slack support?", answer: "Slack supports over 2,400 integrations including Google Drive, Salesforce, Zoom, Jira, GitHub, and custom apps via their API." },
  ],
  canva: [
    { question: "Is Canva free to use?", answer: "Yes, Canva has a free tier with thousands of templates and 5GB storage. Pro plan is $119/year with AI features, brand kits, and transparent backgrounds." },
    { question: "Can Canva replace Photoshop?", answer: "Canva can replace Photoshop for social media graphics, presentations, and marketing materials. For professional photo editing, print design, or complex composites, Photoshop is still superior." },
  ],
  hubspot: [
    { question: "Is HubSpot free?", answer: "HubSpot offers a free CRM with contact management, deals, tasks, and email tracking. Paid plans start at $45/month for Marketing Hub Starter." },
    { question: "What is the difference between HubSpot and Salesforce?", answer: "HubSpot is easier to set up and use, focused on inbound marketing and SMBs. Salesforce is more customizable and scales to enterprise, but requires significant setup." },
  ],
  github: [
    { question: "Is GitHub free for private repositories?", answer: "Yes, GitHub offers unlimited private repositories for free, with up to 3 collaborators per repo. Team plans start at $4/user/month." },
    { question: "What is GitHub Copilot?", answer: "GitHub Copilot is an AI pair programmer that suggests code completions in real-time. It integrates with VS Code, JetBrains, and other major IDEs." },
  ],
  zapier: [
    { question: "Is Zapier free?", answer: "Zapier offers a free tier with 100 tasks/month and 5 single-step Zaps. Paid plans start at $19.99/month with multi-step Zaps and filters." },
    { question: "What is the difference between Zapier and Make?", answer: "Zapier is easier to use with 5,000+ integrations. Make offers more powerful data transformation and is cheaper at scale, but has a steeper learning curve." },
  ],
  grammarly: [
    { question: "Is Grammarly free?", answer: "Grammarly offers a free tier with basic grammar and spelling checks. Premium ($12/month) adds full-sentence rewrites, tone suggestions, and plagiarism detection." },
    { question: "Does Grammarly work with Google Docs?", answer: "Yes, Grammarly integrates with Google Docs through its browser extension. Premium features like tone detection and full-sentence rewrites work within Google Docs." },
  ],
  "microsoft-teams": [
    { question: "Is Microsoft Teams free?", answer: "Microsoft Teams offers a free tier with unlimited chat, file sharing, and 60-minute group calls. Paid plans start at $4/user/month and include full meeting features." },
    { question: "Can Microsoft Teams replace Zoom?", answer: "Teams can replace Zoom for organizations already using Microsoft 365. Teams offers similar meeting features plus persistent chat, file collaboration, and app integrations." },
  ],
  discord: [
    { question: "Is Discord free?", answer: "Yes, Discord is free to use with unlimited messaging, voice channels, and server creation. Nitro ($9.99/month) adds custom emoji, larger file uploads, and HD streaming." },
    { question: "Is Discord secure for business communication?", answer: "Discord does not offer end-to-end encryption. For business communication, Slack or Microsoft Teams offer better security, compliance, and audit features." },
  ],
  make: [
    { question: "Is Make free?", answer: "Make offers a free tier with 1,000 operations/month. Paid plans start at $9/month and include more operations and premium apps." },
    { question: "Can Make replace Zapier?", answer: "Yes, Make can replace Zapier for most automation needs. Make offers more powerful data transformation at a lower price point, but has a steeper learning curve." },
  ],
  confluence: [
    { question: "Is Confluence free for small teams?", answer: "Confluence offers a free tier for up to 10 users with 2GB storage. Paid plans start at $6/user/month with unlimited storage and advanced permissions." },
    { question: "Can Confluence replace Notion?", answer: "Confluence is better for enterprise documentation with Jira integration and page hierarchy. Notion is better for startups and small teams with its flexible block editor." },
  ],
  prowritingaid: [
    { question: "Is ProWritingAid free?", answer: "ProWritingAid offers a free tier with limited analysis. Premium ($10/month) unlocks all 20+ reports including style, readability, and overused words." },
    { question: "What is the difference between ProWritingAid and Grammarly?", answer: "ProWritingAid offers deeper analysis with 20+ reports focused on writing improvement. Grammarly is better for day-to-day grammar checking and works across more apps." },
  ],
};

// Match each product and add faqs after bestFor
const slugs = Object.keys(productFaqs);
for (const slug of slugs) {
  const faqStr = JSON.stringify(productFaqs[slug], null, 6)
    .replace(/\n\s+/g, '\n    ')
    .replace('[', '[')
    .replace(']', ']');
  
  // Find pattern: bestFor: [...] line followed by longDescription
  // Match exact longDescription end for each product to find the right insert point
  const re = new RegExp(`productSlug: "${slug}"[\\s\\S]*?(bestFor: \\[[^\\]]*\\])(\\s*)`);

  // Find the longDescription line for this product and add faqs before it
  // Simpler approach: find "longDescription:" preceded by "bestFor:" for this product
  const lines = content.split('\n');
  let inProduct = false;
  let insertAt = -1;
  let bestForLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(`productSlug: "${slug}"`)) {
      inProduct = true;
    }
    if (inProduct && line.trim().startsWith('bestFor:')) {
      bestForLine = i;
    }
    if (inProduct && line.trim().startsWith('longDescription:')) {
      // Insert faqs after bestFor line, before longDescription
      insertAt = bestForLine;
      inProduct = false;
      break;
    }
  }
  
  if (insertAt > 0) {
    const faqs = productFaqs[slug];
    const faqText = faqs.map(f => 
      `      { question: "${f.question}", answer: "${f.answer}" }`
    ).join(',\n');
    const insertStr = `\n    faqs: [\n${faqText}\n    ],`;
    
    // Insert after the bestFor line
    lines[insertAt] = lines[insertAt] + insertStr;
    console.log(`Added faqs for ${slug} at line ${insertAt + 1}`);
  }
}

writeFileSync('src/data/staticProductData.ts', lines.join('\n'));
console.log('Done!');
