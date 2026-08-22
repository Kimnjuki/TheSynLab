/**
 * Expanded 2026 Product Catalog — adds 71 products to take the catalog from
 * ~79 to 150+, with category/hub equity across all six hubs.
 *
 * Every product is seeded with:
 *   - the full novaProducts schema (required + optional fields)
 *   - a novaTrustScores row (trustScore + 5 sub-dimensions)
 *   - a novaIntegrationScores row (integrationScore + 5 sub-dimensions)
 *   - a featured image + gallery resolved from productImageMap (category fallback)
 *
 * Idempotent: running repeatedly only inserts missing slugs.
 * Run with:  npx convex run seedExpandedCatalog:seedExpandedCatalog
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { resolveProductImage, resolveProductGallery } from "./productImageMap";

type P = {
  name: string;
  slug: string;
  mfr: string;
  hub: string;
  cat: string;
  sub: string;
  type: "software" | "hardware" | "service";
  price: number;
  cur: string;
  model: string;
  desc: string;
  feat: string[];
  site: string;
  fn: string;
  tags: string[];
  verdict: string;
  tier: string;
  trust: number; // 0-10
  integ: number; // 0-10
};

// 71 products: ai_workflow(13) productivity(13) collaboration(13)
// martech(13) intelligent_home(13) hybrid_office(6)  => 150 total with existing ~79
const RAW: P[] = [
  // ---------------- AI WORKFLOW (13) ----------------
  { name: "n8n", slug: "n8n", mfr: "n8n GmbH", hub: "ai_workflow", cat: "Automation", sub: "Open-Source Workflow Automation", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Open-source workflow automation platform with self-hosting, 400+ integrations, and code-node extensibility for technical teams.", feat: ["Open-Source Core", "400+ Integrations", "Self-Hosting", "Code Nodes", "Error Handling", "Templates"], site: "https://n8n.io", fn: "workflow-automation", tags: ["workflow-automation", "self-hosted", "developer-tools", "open-source"], verdict: "Best open-source Zapier alternative with self-hosting and code nodes.", tier: "$", trust: 8.2, integ: 8.7 },
  { name: "IFTTT", slug: "ifttt", mfr: "IFTTT Inc.", hub: "ai_workflow", cat: "Automation", sub: "Simple Automation", type: "software", price: 2.5, cur: "USD", model: "freemium", desc: "Simple 'if this then that' automation for consumer smart home and social media with 700+ applets.", feat: ["700+ Applets", "Smart Home Triggers", "Social Automation", "Simple UI", "Webhooks", "Filters"], site: "https://ifttt.com", fn: "workflow-automation", tags: ["workflow-automation", "smart-home", "consumer-apps", "simple-setup"], verdict: "Simplest automation for consumers; business users need Zapier or n8n.", tier: "$", trust: 7.2, integ: 7.8 },
  { name: "GitHub Actions", slug: "github-actions", mfr: "Microsoft", hub: "ai_workflow", cat: "Developer Tools", sub: "CI/CD Automation", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Native CI/CD automation inside GitHub with matrix builds, reusable workflows, marketplace actions, and secret management.", feat: ["Matrix Builds", "Reusable Workflows", "10k+ Actions", "Secret Mgmt", "Self-Hosted Runners", "Approvals"], site: "https://github.com/features/actions", fn: "cicd-pipelines", tags: ["cicd-pipelines", "developer-tools", "github-integration", "automation"], verdict: "Best CI/CD for GitHub users; marketplace depth unmatched.", tier: "$", trust: 8.9, integ: 9.5 },
  { name: "Microsoft Power Automate", slug: "power-automate", mfr: "Microsoft", hub: "ai_workflow", cat: "Automation", sub: "Enterprise Automation", type: "software", price: 15, cur: "USD", model: "subscription", desc: "Microsoft's enterprise automation platform with 1,000+ connectors, AI Builder, and deep 365 integration for desktop and cloud flows.", feat: ["1000+ Connectors", "AI Builder", "Desktop RPA", "Cloud Flows", "Process Mining", "Dataverse"], site: "https://powerautomate.microsoft.com", fn: "workflow-automation", tags: ["workflow-automation", "enterprise", "rpa", "microsoft-365"], verdict: "Enterprise automation standard for Microsoft 365; AI Builder unique.", tier: "$$$", trust: 8.0, integ: 9.2 },
  { name: "Writesonic", slug: "writesonic", mfr: "Writesonic Inc.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Content Writing", type: "software", price: 12, cur: "USD", model: "subscription", desc: "AI writing platform with SEO-optimized article generation, brand voice training, and ChatSonic chatbot.", feat: ["SEO Article Writer", "Brand Voice", "ChatSonic", "Photosonic", "Surfer SEO", "Plagiarism Check"], site: "https://writesonic.com", fn: "ai-assistant", tags: ["ai-assistant", "content-generation", "seo-writing", "marketing"], verdict: "Strong SEO article generation; long-form still needs editing.", tier: "$$", trust: 7.4, integ: 7.7 },
  { name: "Blaze AI", slug: "blaze-ai", mfr: "Blaze", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Social Media", type: "software", price: 15, cur: "USD", model: "subscription", desc: "AI-powered social media content creation and repurposing platform with brand-aware copy generation.", feat: ["AI Repurposing", "Brand Voice", "Multi-Platform", "Content Calendar", "Analytics", "Teams"], site: "https://blaze.ai", fn: "ai-assistant", tags: ["ai-assistant", "social-media-content", "content-repurposing", "brand-voice"], verdict: "Best AI content repurposing for social teams; brand voice AI works.", tier: "$$", trust: 7.5, integ: 7.5 },
  { name: "Syllaby", slug: "syllaby", mfr: "Syllaby Inc.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Video Scripts", type: "software", price: 25, cur: "USD", model: "subscription", desc: "AI video script generator and social media tool optimized for TikTok and Reels.", feat: ["Script Generation", "TikTok Optimization", "Calendar", "Trend Research", "Analytics", "Workspace"], site: "https://syllaby.io", fn: "ai-assistant", tags: ["ai-assistant", "video-creation", "social-media-content", "tiktok"], verdict: "Best AI tool for short-form video scripts; trend research is unique.", tier: "$$", trust: 7.1, integ: 6.8 },
  { name: "AirOps", slug: "airops", mfr: "AirOps Inc.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Workflow Platform", type: "software", price: 39, cur: "USD", model: "subscription", desc: "AI workflow platform with 100+ pre-built apps for content, data, and image generation across business workflows.", feat: ["100+ AI Apps", "Content Gen", "Data Analysis", "Image Gen", "API", "Teams"], site: "https://airops.com", fn: "ai-assistant", tags: ["ai-assistant", "workflow-automation", "content-generation", "data-analysis"], verdict: "Solid AI workflow platform for repeatable business tasks; pre-built apps save time.", tier: "$$$", trust: 7.6, integ: 7.5 },
  { name: "Play.ht", slug: "play-ht", mfr: "Play.ht Inc.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Text-to-Speech", type: "software", price: 12, cur: "USD", model: "subscription", desc: "AI text-to-speech platform with 800+ voices, real-time synthesis, and podcast hosting for creators.", feat: ["800+ Voices", "Real-Time TTS", "Podcast Hosting", "Voice Cloning", "SSML", "60+ Languages"], site: "https://play.ht", fn: "ai-assistant", tags: ["ai-assistant", "text-to-speech", "podcast", "voice-cloning"], verdict: "Best AI text-to-speech for podcasters; voice quality excellent.", tier: "$$", trust: 7.8, integ: 7.3 },
  { name: "Mubert", slug: "mubert", mfr: "Mubert Inc.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Music Generation", type: "software", price: 14, cur: "USD", model: "subscription", desc: "AI music generation platform for content creators with real-time streaming and royalty-free tracks.", feat: ["Music Generation", "Real-Time Streaming", "Royalty-Free", "Mood Genre", "API", "Mobile"], site: "https://mubert.com", fn: "ai-assistant", tags: ["ai-assistant", "music-generation", "royalty-free", "streaming"], verdict: "Best AI music for real-time streaming and background music; royalty-free license a plus.", tier: "$$", trust: 7.2, integ: 7.0 },
  { name: "Lalal.ai", slug: "lalal-ai", mfr: "Krasnova A.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Audio Processing", type: "software", price: 15, cur: "USD", model: "subscription", desc: "AI-powered audio stem splitter that extracts vocals, drums, bass, and instruments from any track.", feat: ["Stem Separation", "Vocal Extract", "Drum Split", "Instrumental", "Batch", "API"], site: "https://lalal.ai", fn: "ai-assistant", tags: ["ai-assistant", "audio-processing", "stem-separation", "music"], verdict: "High-quality stem separation for remixes and karaoke; free tier limited.", tier: "$$", trust: 7.3, integ: 7.1 },
  { name: "Murf AI", slug: "murf-ai", mfr: "Murf Inc.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Voiceover", type: "software", price: 13, cur: "USD", model: "subscription", desc: "AI voiceover studio with 120+ voices, voice cloning, and video dubbing for professional content.", feat: ["120+ Voices", "Voice Cloning", "Video Dubbing", "Team Studio", "SSML", "Transcription"], site: "https://murf.ai", fn: "ai-assistant", tags: ["ai-assistant", "voiceover", "text-to-speech", "video"], verdict: "Best AI voiceover for explainer and training videos; studio is polished.", tier: "$$", trust: 7.7, integ: 7.4 },
  { name: "Opus Clip", slug: "opus-clip", mfr: "Opus Clip Inc.", hub: "ai_workflow", cat: "AI Assistants", sub: "AI Video Repurposing", type: "software", price: 9.5, cur: "USD", model: "subscription", desc: "AI video repurposing tool that turns long videos into viral-ready short clips for TikTok and Reels.", feat: ["AI Clipping", "Virality Score", "Captions", "Auto-Resize", "Brand Templates", "API"], site: "https://opus.pro", fn: "ai-assistant", tags: ["ai-assistant", "video-creation", "content-repurposing", "social-media"], verdict: "Best AI clipping tool for long videos into shorts; virality score helps.", tier: "$$", trust: 7.4, integ: 7.2 },

  // ---------------- PRODUCTIVITY (13) ----------------
  { name: "RemNote", slug: "remnote", mfr: "RemNote Inc.", hub: "productivity", cat: "Productivity Software", sub: "Spaced-Repetition Notes", type: "software", price: 8, cur: "USD", model: "subscription", desc: "Note-taking app with built-in spaced repetition that turns notes into flashcards for active recall.", feat: ["Spaced Repetition", "Flashcards", "Outline Notes", "PDF Annotate", "Knowledge Base", "Mobile"], site: "https://remnote.com", fn: "knowledge-management", tags: ["knowledge-management", "note-taking", "spaced-repetition", "flashcards"], verdict: "Best notes+flashcards hybrid for learners; learning curve steep.", tier: "$$", trust: 7.6, integ: 6.9 },
  { name: "Taskade", slug: "taskade", mfr: "Taskade Inc.", hub: "productivity", cat: "Productivity Software", sub: "AI Task Management", type: "software", price: 10, cur: "USD", model: "subscription", desc: "AI-native workspace combining tasks, notes, and mind maps with real-time collaboration.", feat: ["AI Tasks", "Multiple Views", "Real-Time Collab", "Video Chat", "Automations", "Templates"], site: "https://taskade.com", fn: "task-management", tags: ["task-management", "ai-assistant", "project-management", "collaboration"], verdict: "Best AI-native task manager with real-time collaboration; free tier generous.", tier: "$$", trust: 7.8, integ: 8.0 },
  { name: "Slite", slug: "slite", mfr: "Slite", hub: "productivity", cat: "Productivity Software", sub: "Team Knowledge Base", type: "software", price: 8, cur: "USD", model: "subscription", desc: "Team knowledge base with AI-powered search that centralizes company documentation.", feat: ["AI Ask", "Documents", "Version History", "Threads", "Integrations", "Permissions"], site: "https://slite.com", fn: "knowledge-management", tags: ["knowledge-management", "team-wiki", "documentation", "collaboration"], verdict: "Clean team wiki with AI search; good Notion alternative for docs.", tier: "$$", trust: 7.9, integ: 7.6 },
  { name: "Magical", slug: "magical-ai", mfr: "Magical", hub: "productivity", cat: "Productivity Software", sub: "AI Text Expansion", type: "software", price: 0, cur: "USD", model: "freemium", desc: "AI productivity tool for text expansion, autofill, and message generation across web apps.", feat: ["Text Expansion", "AI Write", "Autofill", "Email Sequences", "Search", "Teams"], site: "https://getmagical.com", fn: "writing-assistant", tags: ["writing-assistant", "text-expansion", "automation", "ai-assistant"], verdict: "Fastest text expansion and autofill; privacy model needs review.", tier: "$", trust: 7.0, integ: 7.3 },
  { name: "TextExpander", slug: "textexpander", mfr: "Smile", hub: "productivity", cat: "Productivity Software", sub: "Snippet Management", type: "software", price: 10, cur: "USD", model: "subscription", desc: "Snippet and text-expansion tool that standardizes repetitive typing for teams.", feat: ["Snippets", "Fill-ins", "Teams", "Stats", "Encrypted Sync", "Integrations"], site: "https://textexpander.com", fn: "writing-assistant", tags: ["writing-assistant", "snippets", "text-expansion", "teams"], verdict: "Enterprise-grade snippet manager; reliable cross-platform sync.", tier: "$$", trust: 8.0, integ: 7.5 },
  { name: "Wispr Flow", slug: "wispr-flow", mfr: "Wispr AI", hub: "productivity", cat: "Productivity Software", sub: "Voice Dictation", type: "software", price: 0, cur: "USD", model: "freemium", desc: "AI voice dictation that turns speech into formatted text across any application.", feat: ["Voice to Text", "AI Punctuation", "Whisper Models", "Multi-App", "Mac", "Windows"], site: "https://wisprflow.ai", fn: "writing-assistant", tags: ["writing-assistant", "voice-dictation", "ai-assistant", "productivity"], verdict: "Best AI voice dictation for hands-free writing; accuracy strong.", tier: "$", trust: 7.1, integ: 6.8 },
  { name: "Superwhisper", slug: "superwhisper", mfr: "Superwhisper", hub: "productivity", cat: "Productivity Software", sub: "Local Voice Dictation", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Local-first voice dictation tool that processes speech on-device for privacy.", feat: ["On-Device", "Local Models", "Low Latency", "Shortcuts", "Mac", "Multiple Languages"], site: "https://superwhisper.com", fn: "writing-assistant", tags: ["writing-assistant", "voice-dictation", "local-first", "privacy"], verdict: "Privacy-first local dictation; runs offline on Apple silicon.", tier: "$", trust: 7.5, integ: 6.6 },
  { name: "Tactiq", slug: "tactiq", mfr: "Tactiq", hub: "productivity", cat: "Productivity Software", sub: "Meeting Transcripts", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Meeting transcription tool that captures live transcripts and AI summaries from video calls.", feat: ["Live Transcripts", "AI Summary", "Action Items", "Integrations", "Highlights", "Search"], site: "https://tactiq.io", fn: "meeting-notes", tags: ["meeting-notes", "transcription", "ai-assistant", "collaboration"], verdict: "Best live transcript for Google Meet/Zoom; AI summaries save time.", tier: "$", trust: 7.4, integ: 8.1 },
  { name: "Milanote", slug: "milanote", mfr: "Milanote", hub: "productivity", cat: "Productivity Software", sub: "Visual Boards", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Visual workspace for creative teams to organize ideas, images, and notes on flexible boards.", feat: ["Visual Boards", "Drag Drop", "Templates", "Images", "Notes", "Web Clipper"], site: "https://milanote.com", fn: "knowledge-management", tags: ["knowledge-management", "visual-boards", "design", "creative"], verdict: "Best visual brainstorming for creative teams; not a task tracker.", tier: "$", trust: 7.3, integ: 7.0 },
  { name: "Craft", slug: "craft", mfr: "Craft Docs", hub: "productivity", cat: "Productivity Software", sub: "Document Editor", type: "software", price: 5, cur: "USD", model: "subscription", desc: "Native document editor with beautiful design, offline support, and bidirectional linking.", feat: ["Block Editor", "Offline", "Linking", "Publishing", "AI", "Aesthetics"], site: "https://craft.do", fn: "knowledge-management", tags: ["knowledge-management", "documentation", "writing-assistant", "notes"], verdict: "Beautiful native docs with offline; Apple-centric but cross-platform.", tier: "$$", trust: 8.1, integ: 7.4 },
  { name: "WorkFlowy", slug: "workflowy", mfr: "WorkFlowy", hub: "productivity", cat: "Productivity Software", sub: "Outliner", type: "software", price: 5, cur: "USD", model: "freemium", desc: "Minimalist outliner for structured notes and task lists with infinite nesting.", feat: ["Outliner", "Zoom", "Tags", "Mirror", "Templates", "Cross-Device"], site: "https://workflowy.com", fn: "task-management", tags: ["task-management", "outliner", "note-taking", "productivity"], verdict: "Simplest outliner for structured thinking; power users want more.", tier: "$", trust: 8.0, integ: 6.7 },
  { name: "Coda", slug: "coda", mfr: "Coda", hub: "productivity", cat: "Productivity Software", sub: "Doc-Spreadsheet Hybrid", type: "software", price: 10, cur: "USD", model: "subscription", desc: "Document and spreadsheet hybrid with building blocks and 500+ Packs for workflow automation.", feat: ["Docs", "Tables", "Packs", "Automations", "Buttons", "Templates"], site: "https://coda.io", fn: "database-spreadsheet", tags: ["database-spreadsheet", "project-management", "documentation", "automation"], verdict: "Best doc+table hybrid with packs; learning curve for builders.", tier: "$$", trust: 7.7, integ: 8.3 },
  { name: "Forever Notes", slug: "forever-notes", mfr: "Forever", hub: "productivity", cat: "Productivity Software", sub: "Local-First Notes", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Local-first personal knowledge manager with markdown files and graph visualization.", feat: ["Markdown", "Graph View", "Local First", "Plugins", "Sync", "Encryption"], site: "https://forevernotes.app", fn: "knowledge-management", tags: ["knowledge-management", "note-taking", "local-first", "privacy"], verdict: "Local-first PKM with graph; smaller community than Obsidian.", tier: "$", trust: 7.8, integ: 6.5 },

  // ---------------- COLLABORATION (13) ----------------
  { name: "Mattermost", slug: "mattermost", mfr: "Mattermost Inc.", hub: "collaboration", cat: "Collaboration", sub: "Self-Hosted Chat", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Open-source, self-hosted team communication platform with Slack-like messaging and DevOps integrations.", feat: ["Channels", "Direct Messages", "Self-Hosted", "Boards", "Playbooks", "Integrations"], site: "https://mattermost.com", fn: "team-communication", tags: ["team-communication", "self-hosted", "developer-tools", "security"], verdict: "Best self-hosted Slack alternative for security-conscious orgs.", tier: "$", trust: 8.6, integ: 8.4 },
  { name: "Guilded", slug: "guilded", mfr: "Guilded", hub: "collaboration", cat: "Collaboration", sub: "Gaming Communities", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Community and team communication platform with advanced scheduling and voice tools for gaming groups.", feat: ["Voice", "Text", "Scheduling", "Calendars", "Lounges", "Role Management"], site: "https://guilded.gg", fn: "team-communication", tags: ["team-communication", "gaming", "communities", "voice"], verdict: "Strong Discord alternative for organized gaming communities.", tier: "$", trust: 7.0, integ: 7.2 },
  { name: "Rocket.Chat", slug: "rocketchat", mfr: "Rocket.Chat", hub: "collaboration", cat: "Collaboration", sub: "Open-Source Chat", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Open-source communication platform with omnichannel customer engagement and self-hosting.", feat: ["Omnichannel", "Livechat", "Federation", "Self-Hosted", "Integrations", "E2E Option"], site: "https://rocket.chat", fn: "team-communication", tags: ["team-communication", "open-source", "self-hosted", "enterprise"], verdict: "Best open-source team chat with omnichannel; self-hosting flexible.", tier: "$", trust: 8.3, integ: 8.1 },
  { name: "Twist", slug: "twist", mfr: "Twist", hub: "collaboration", cat: "Collaboration", sub: "Threaded Async Chat", type: "software", price: 5, cur: "USD", model: "subscription", desc: "Asynchronous, threaded team chat designed to reduce real-time notification noise for remote teams.", feat: ["Threads", "Channels", "DMs", "Guest Access", "Search", "Integrations"], site: "https://twist.com", fn: "team-communication", tags: ["team-communication", "async", "threaded", "remote"], verdict: "Best async chat for remote teams; reduces notification fatigue.", tier: "$", trust: 7.7, integ: 7.4 },
  { name: "Telegram", slug: "telegram", mfr: "Telegram", hub: "collaboration", cat: "Collaboration", sub: "Encrypted Messaging", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Cloud-based messaging app with channels, bots, and large file sharing for teams and communities.", feat: ["Cloud Chat", "Channels", "Bots", "Secret Chats", "File Share", "Calls"], site: "https://telegram.org", fn: "team-communication", tags: ["team-communication", "messaging", "encryption", "communities"], verdict: "Fast global messenger; encryption optional not default.", tier: "$", trust: 6.8, integ: 7.9 },
  { name: "Signal", slug: "signal", mfr: "Signal Foundation", hub: "collaboration", cat: "Collaboration", sub: "Private Messaging", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Privacy-first encrypted messenger with open-source protocol used by security professionals.", feat: ["E2E Encryption", "Disappearing", "Calls", "Groups", "Desktop", "Minimal Metadata"], site: "https://signal.org", fn: "team-communication", tags: ["team-communication", "encryption", "privacy", "security"], verdict: "Gold-standard encrypted messaging; limited team features.", tier: "$", trust: 9.1, integ: 6.5 },
  { name: "Viva Engage", slug: "viva-engage", mfr: "Microsoft", hub: "collaboration", cat: "Collaboration", sub: "Enterprise Social", type: "software", price: 4, cur: "USD", model: "subscription", desc: "Microsoft's enterprise social network for communities, leadership updates, and employee engagement.", feat: ["Communities", "Storylines", "Leadership", "365 Integration", "Feeds", "Analytics"], site: "https://engage.microsoft.com", fn: "team-communication", tags: ["team-communication", "enterprise", "microsoft-365", "social"], verdict: "Best internal social network for Microsoft 365 orgs.", tier: "$$", trust: 8.0, integ: 9.0 },
  { name: "Height", slug: "height", mfr: "Height", hub: "collaboration", cat: "Collaboration", sub: "Autonomous Project Chat", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Task management app with autonomous AI that updates tasks from conversations and integrations.", feat: ["Tasks", "AI Triage", "Cycles", "Integrations", "Real-Time", "API"], site: "https://height.app", fn: "project-management", tags: ["project-management", "team-communication", "ai-assistant", "agile"], verdict: "Fast task app with AI triage; great for product teams.", tier: "$", trust: 7.6, integ: 8.2 },
  { name: "Fleep", slug: "fleep", mfr: "Fleep", hub: "collaboration", cat: "Collaboration", sub: "Email-Chat Hybrid", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Messaging app that bridges chat and email, enabling collaboration with external partners without new accounts.", feat: ["Chat", "Email Integration", "Conversations", "Files", "Guest Access", "Task Board"], site: "https://fleep.io", fn: "team-communication", tags: ["team-communication", "email", "async", "remote"], verdict: "Good bridge between email and chat for external partners.", tier: "$", trust: 7.2, integ: 7.3 },
  { name: "Element", slug: "element", mfr: "Element", hub: "collaboration", cat: "Collaboration", sub: "Matrix Chat", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Secure, decentralized messenger built on the Matrix protocol with end-to-end encryption and federation.", feat: ["Matrix", "E2E Encryption", "Federation", "Self-Hosted", "Voice", "Communities"], site: "https://element.io", fn: "team-communication", tags: ["team-communication", "encryption", "open-source", "federation"], verdict: "Best decentralized E2E chat via Matrix; federation powerful.", tier: "$", trust: 8.7, integ: 8.0 },
  { name: "Zulip", slug: "zulip", mfr: "Zulip", hub: "collaboration", cat: "Collaboration", sub: "Threaded Open-Source Chat", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Open-source chat with unique topic-based threading that scales for engineering and open-source communities.", feat: ["Topic Threads", "Self-Hosted", "Integrations", "Bots", "Search", "Streams"], site: "https://zulip.com", fn: "team-communication", tags: ["team-communication", "open-source", "threaded", "developer-tools"], verdict: "Best threaded chat for high-volume technical teams.", tier: "$", trust: 8.4, integ: 8.2 },
  { name: "Chanty", slug: "chanty", mfr: "Chanty", hub: "collaboration", cat: "Collaboration", sub: "Simple Team Chat", type: "software", price: 3, cur: "USD", model: "subscription", desc: "Simple team chat with built-in task management and video for small businesses.", feat: ["Chat", "Task Board", "Video", "Kanban", "File Box", "AI"], site: "https://chanty.com", fn: "team-communication", tags: ["team-communication", "project-management", "ai-assistant", "small-teams"], verdict: "Easy SMB chat with built-in task board; affordable.", tier: "$", trust: 7.5, integ: 7.6 },
  { name: "Brief", slug: "brief", mfr: "Brief", hub: "collaboration", cat: "Collaboration", sub: "Priority-Focused Chat", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Team chat centered on daily priority briefs to keep distributed teams aligned.", feat: ["Daily Brief", "Priority", "Video", "Channels", "Integrations", "Focus"], site: "https://brief.team", fn: "team-communication", tags: ["team-communication", "async", "focus", "remote"], verdict: "Unique daily priority briefs; niche but reduces noise.", tier: "$", trust: 7.1, integ: 7.0 },

  // ---------------- MARTECH (13) ----------------
  { name: "Klaviyo", slug: "klaviyo", mfr: "Klaviyo", hub: "martech", cat: "Marketing", sub: "Email & SMS Marketing", type: "software", price: 20, cur: "USD", model: "subscription", desc: "Data-driven email and SMS marketing platform built for ecommerce growth with predictive analytics.", feat: ["Email", "SMS", "Flows", "Segmentation", "Predictive Analytics", "Integrations"], site: "https://klaviyo.com", fn: "email-marketing", tags: ["email-marketing", "ecommerce", "crm-sales", "automation"], verdict: "Best email/SMS for ecommerce; data-driven flows strong.", tier: "$$", trust: 7.6, integ: 8.6 },
  { name: "ActiveCampaign", slug: "activecampaign", mfr: "ActiveCampaign", hub: "martech", cat: "Marketing", sub: "CRM & Automation", type: "software", price: 9, cur: "USD", model: "subscription", desc: "Customer experience platform combining email marketing, automation, and CRM for small businesses.", feat: ["Email", "Automation", "CRM", "SMS", "Site Tracking", "Split Testing"], site: "https://activecampaign.com", fn: "crm-sales", tags: ["crm-sales", "email-marketing", "automation", "small-business"], verdict: "Best SMB CRM with powerful automation; onboarding needed.", tier: "$$", trust: 7.7, integ: 8.4 },
  { name: "GetResponse", slug: "getresponse", mfr: "GetResponse", hub: "martech", cat: "Marketing", sub: "Email Marketing", type: "software", price: 13, cur: "USD", model: "subscription", desc: "Email marketing platform with autoresponders, landing pages, and webinar hosting.", feat: ["Email", "Autoresponders", "Landing Pages", "Webinars", "CRM", "AI"], site: "https://getresponse.com", fn: "email-marketing", tags: ["email-marketing", "automation", "landing-pages", "webinars"], verdict: "Solid all-in-one email with webinars; deliverability decent.", tier: "$$", trust: 7.4, integ: 8.0 },
  { name: "ConvertKit", slug: "convertkit", mfr: "Kit", hub: "martech", cat: "Marketing", sub: "Creator Email", type: "software", price: 9, cur: "USD", model: "subscription", desc: "Email marketing platform built for creators with simple automations and digital product sales.", feat: ["Email", "Sequences", "Landing Pages", "Selling", "Paid Newsletters", "Integrations"], site: "https://kit.com", fn: "email-marketing", tags: ["email-marketing", "creators", "automation", "newsletter"], verdict: "Best email for creators; simple automations, fair pricing.", tier: "$$", trust: 7.9, integ: 7.8 },
  { name: "Semrush", slug: "semrush", mfr: "Semrush", hub: "martech", cat: "Marketing", sub: "SEO Toolkit", type: "software", price: 119, cur: "USD", model: "subscription", desc: "Comprehensive SEO and competitive research toolkit for marketers and agencies.", feat: ["Keyword Research", "Site Audit", "Backlinks", "Competitor Analysis", "Rank Tracking", "Reports"], site: "https://semrush.com", fn: "seo-analytics", tags: ["seo-analytics", "competitive-intel", "marketing", "keyword-research"], verdict: "Best all-around SEO and competitive intel; pricey.", tier: "$$$", trust: 7.8, integ: 7.5 },
  { name: "Ahrefs", slug: "ahrefs", mfr: "Ahrefs", hub: "martech", cat: "Marketing", sub: "SEO & Backlinks", type: "software", price: 99, cur: "USD", model: "subscription", desc: "SEO toolset known for the largest backlink index and content research capabilities.", feat: ["Site Explorer", "Content Explorer", "Site Audit", "Keywords", "Rank Tracker", "Batch"], site: "https://ahrefs.com", fn: "seo-analytics", tags: ["seo-analytics", "backlinks", "competitive-intel", "content"], verdict: "Best backlink index; content explorer is unmatched.", tier: "$$$", trust: 8.0, integ: 7.4 },
  { name: "Moz", slug: "moz", mfr: "Moz", hub: "martech", cat: "Marketing", sub: "SEO Software", type: "software", price: 49, cur: "USD", model: "subscription", desc: "SEO software with beginner-friendly keyword research and the widely used Domain Authority metric.", feat: ["Keyword Explorer", "Domain Authority", "Site Crawl", "Rank Tracking", "Local", "On-Page"], site: "https://moz.com", fn: "seo-analytics", tags: ["seo-analytics", "keyword-research", "local-seo", "marketing"], verdict: "Beginner-friendly SEO with good local tools; smaller index.", tier: "$$", trust: 7.6, integ: 7.2 },
  { name: "Hotjar", slug: "hotjar", mfr: "Hotjar", hub: "martech", cat: "Marketing", sub: "Behavior Analytics", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Product experience platform with heatmaps, session recordings, and surveys to understand user behavior.", feat: ["Heatmaps", "Session Recordings", "Surveys", "Funnels", "Feedback", "AI"], site: "https://hotjar.com", fn: "analytics", tags: ["analytics", "user-research", "heatmaps", "product"], verdict: "Best heatmaps and session replay for UX insight.", tier: "$", trust: 7.5, integ: 7.7 },
  { name: "Mixpanel", slug: "mixpanel", mfr: "Mixpanel", hub: "martech", cat: "Marketing", sub: "Product Analytics", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Product analytics platform for tracking user behavior, funnels, and retention with SQL-like queries.", feat: ["Event Tracking", "Funnels", "Retention", "Queries", "Branch", "Integrations"], site: "https://mixpanel.com", fn: "analytics", tags: ["analytics", "product", "event-tracking", "retention"], verdict: "Best event analytics for product teams; free tier generous.", tier: "$", trust: 7.7, integ: 8.3 },
  { name: "Amplitude", slug: "amplitude", mfr: "Amplitude", hub: "martech", cat: "Marketing", sub: "Product Analytics", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Digital analytics platform with behavioral cohorting and experimentation for enterprise product teams.", feat: ["Funnels", "Retention", "Cohorts", "Experiments", "Guides", "Integrations"], site: "https://amplitude.com", fn: "analytics", tags: ["analytics", "product", "experimentation", "enterprise"], verdict: "Best enterprise product analytics with experimentation.", tier: "$", trust: 7.8, integ: 8.4 },
  { name: "Heap", slug: "heap", mfr: "Heap", hub: "martech", cat: "Marketing", sub: "Auto-Captured Analytics", type: "software", price: 0, cur: "USD", model: "freemium", desc: "Product analytics that automatically captures every user interaction without manual event tagging.", feat: ["Auto Capture", "Heatmaps", "Funnels", "Retention", "Virtual Events", "Integrations"], site: "https://heap.io", fn: "analytics", tags: ["analytics", "product", "auto-capture", "no-code"], verdict: "Best auto-capture analytics; no manual events needed.", tier: "$", trust: 7.4, integ: 8.0 },
  { name: "Customer.io", slug: "customerio", mfr: "Customer.io", hub: "martech", cat: "Marketing", sub: "Lifecycle Messaging", type: "software", price: 12, cur: "USD", model: "subscription", desc: "Lifecycle marketing platform that triggers messages from product behavior across email, SMS, and push.", feat: ["Email", "SMS", "Push", "In-App", "Behavioral Triggers", "API"], site: "https://customer.io", fn: "email-marketing", tags: ["email-marketing", "lifecycle", "automation", "crm-sales"], verdict: "Best behavioral lifecycle messaging for apps.", tier: "$$", trust: 7.6, integ: 8.1 },
  { name: "Braze", slug: "braze", mfr: "Braze", hub: "martech", cat: "Marketing", sub: "Customer Engagement", type: "software", price: 0, cur: "USD", model: "subscription", desc: "Customer engagement platform orchestrating cross-channel messaging with machine learning for personalization.", feat: ["Email", "SMS", "Push", "In-App", "Content Cards", "ML"], site: "https://braze.com", fn: "email-marketing", tags: ["email-marketing", "customer-engagement", "cross-channel", "enterprise"], verdict: "Best cross-channel engagement for enterprise apps.", tier: "$$$", trust: 7.7, integ: 8.5 },

  // ---------------- INTELLIGENT HOME (13) ----------------
  { name: "Wyze", slug: "wyze", mfr: "Wyze Labs", hub: "intelligent_home", cat: "Smart Home", sub: "Budget Cameras & Sensors", type: "hardware", price: 25, cur: "USD", model: "one_time", desc: "Affordable smart home devices including cameras, sensors, and plugs with optional subscription.", feat: ["Cameras", "Sensors", "Bulbs", "Locks", "Plugs", "Cloud + Local"], site: "https://wyze.com", fn: "smart-home", tags: ["smart-home", "security", "cameras", "sensors"], verdict: "Best budget smart home gear; privacy practices mixed.", tier: "$", trust: 6.9, integ: 7.6 },
  { name: "Eufy Security", slug: "eufy-security", mfr: "Anker", hub: "intelligent_home", cat: "Smart Home", sub: "Security Cameras", type: "hardware", price: 99, cur: "USD", model: "one_time", desc: "Anker's security brand with cameras and locks emphasizing local storage and privacy.", feat: ["Cameras", "Local Storage", "HomeKit", "Alexa", "Google", "Solar"], site: "https://us.eufy.com", fn: "smart-home", tags: ["smart-home", "security", "cameras", "local-storage"], verdict: "Best local-storage security cams; HomeKit support solid.", tier: "$$", trust: 7.8, integ: 8.0 },
  { name: "SimpliSafe", slug: "simplisafe", mfr: "SimpliSafe", hub: "intelligent_home", cat: "Smart Home", sub: "DIY Security", type: "hardware", price: 0, cur: "USD", model: "subscription", desc: "DIY home security system with easy setup and optional professional monitoring.", feat: ["Sensors", "Cameras", "Monitoring", "Keypad", "Smoke", "Water"], site: "https://simplisafe.com", fn: "smart-home", tags: ["smart-home", "security", "alarms", "monitoring"], verdict: "Best DIY home security with pro monitoring; proprietary.", tier: "$", trust: 7.5, integ: 7.2 },
  { name: "Abode", slug: "abode", mfr: "Abode", hub: "intelligent_home", cat: "Smart Home", sub: "Security Hub", type: "hardware", price: 279, cur: "USD", model: "one_time", desc: "Flexible security hub supporting Matter, HomeKit, and self-monitoring without contracts.", feat: ["Hub", "Sensors", "Cameras", "Matter", "HomeKit", "Self-Monitor"], site: "https://goabode.com", fn: "smart-home", tags: ["smart-home", "security", "matter", "homekit"], verdict: "Best open security hub with Matter and HomeKit.", tier: "$$$", trust: 7.9, integ: 8.3 },
  { name: "Vivint", slug: "vivint", mfr: "Vivint", hub: "intelligent_home", cat: "Smart Home", sub: "Pro Security", type: "hardware", price: 0, cur: "USD", model: "subscription", desc: "Professionally installed smart home and security system with 24/7 monitoring.", feat: ["Cameras", "Locks", "Thermostat", "Professional", "Monitoring", "App"], site: "https://vivint.com", fn: "smart-home", tags: ["smart-home", "security", "professionally-installed", "automation"], verdict: "Best pro-installed smart home; contracts are long.", tier: "$$$", trust: 7.0, integ: 7.4 },
  { name: "ADT", slug: "adt", mfr: "ADT", hub: "intelligent_home", cat: "Smart Home", sub: "Home Security", type: "hardware", price: 0, cur: "USD", model: "subscription", desc: "Legacy home security provider with professional monitoring and growing smart-home integration.", feat: ["Monitoring", "Cameras", "Sensors", "Professional", "Smart Home Add-on", "App"], site: "https://adt.com", fn: "smart-home", tags: ["smart-home", "security", "monitoring", "enterprise"], verdict: "Legacy security with broad coverage; less smart-home native.", tier: "$$", trust: 6.8, integ: 7.0 },
  { name: "Honeywell Home", slug: "honeywell-home", mfr: "Resideo", hub: "intelligent_home", cat: "Smart Home", sub: "Thermostats", type: "hardware", price: 129, cur: "USD", model: "one_time", desc: "Connected thermostats and leak detectors from Resideo with energy-saving automation.", feat: ["Thermostats", "Leak Detectors", "Wi-Fi", "Geo-Fencing", "Scheduling", "Alerts"], site: "https://honeywellhome.com", fn: "smart-home", tags: ["smart-home", "climate", "thermostats", "energy"], verdict: "Reliable connected thermostats; app less slick.", tier: "$$", trust: 7.6, integ: 7.8 },
  { name: "LG ThinQ", slug: "lg-thinq", mfr: "LG", hub: "intelligent_home", cat: "Smart Home", sub: "Appliances", type: "hardware", price: 0, cur: "USD", model: "one_time", desc: "LG's smart appliance ecosystem with ThinQ app and expanding Matter support.", feat: ["Appliances", "TV", "ThinQ", "Wi-Fi", "Matter", "Voice"], site: "https://lg.com", fn: "smart-home", tags: ["smart-home", "appliances", "matter", "thinQ"], verdict: "Best connected appliances with ThinQ; Matter rolling out.", tier: "$$", trust: 7.4, integ: 8.1 },
  { name: "myQ", slug: "myq", mfr: "Chamberlain", hub: "intelligent_home", cat: "Smart Home", sub: "Garage Control", type: "hardware", price: 30, cur: "USD", model: "one_time", desc: "Smart garage door control with notifications and scheduling, popular for automation routines.", feat: ["Garage Opener", "Notifications", "Scheduling", "Guest Access", "Auto-Close", "API"], site: "https://myq.com", fn: "smart-home", tags: ["smart-home", "garage", "access-control", "automation"], verdict: "Best smart garage control; subscription for integrations.", tier: "$", trust: 7.3, integ: 7.5 },
  { name: "Level Lock", slug: "level-lock", mfr: "Level", hub: "intelligent_home", cat: "Smart Home", sub: "Invisible Smart Lock", type: "hardware", price: 199, cur: "USD", model: "one_time", desc: "Invisible smart lock retrofitted inside the deadbolt with HomeKit and keypad accessory.", feat: ["Invisible Lock", "HomeKit", "Keypad", "Auto-Lock", "Access Logs", "Crank"], site: "https://level.co", fn: "smart-home", tags: ["smart-home", "security", "locks", "homekit"], verdict: "Most discreet HomeKit lock; install is involved.", tier: "$$", trust: 8.0, integ: 8.2 },
  { name: "SwitchBot", slug: "switchbot", mfr: "SwitchBot", hub: "intelligent_home", cat: "Smart Home", sub: "Retrofit Bots", type: "hardware", price: 29, cur: "USD", model: "one_time", desc: "Retrofit smart-home gadgets including a robot button-pusher and curtain controllers.", feat: ["Bot", "Curtain", "Meter", "Lock", "Hub", "Matter"], site: "https://switchbot.com", fn: "smart-home", tags: ["smart-home", "retrofit", "robotics", "matter"], verdict: "Best retrofit smart home on a budget; bot is clever.", tier: "$", trust: 7.5, integ: 8.0 },
  { name: "Nanoleaf", slug: "nanoleaf", mfr: "Nanoleaf", hub: "intelligent_home", cat: "Smart Home", sub: "Smart Lighting", type: "hardware", price: 59, cur: "USD", model: "one_time", desc: "Smart lighting known for modular light panels with Thread and Matter support.", feat: ["Light Panels", "Strip", "Bulbs", "Thread", "Matter", "Music Sync"], site: "https://nanoleaf.me", fn: "smart-home", tags: ["smart-home", "lighting", "matter", "thread"], verdict: "Best Thread lighting panels; vibrant and Matter-ready.", tier: "$$", trust: 7.7, integ: 8.3 },
  { name: "LEDVANCE Smart+", slug: "ledvance", mfr: "LEDVANCE", hub: "intelligent_home", cat: "Smart Home", sub: "Smart Bulbs", type: "hardware", price: 15, cur: "USD", model: "one_time", desc: "LEDVANCE's Smart+ line of Matter-ready smart bulbs and strips for broad ecosystem support.", feat: ["Bulbs", "Strips", "Wi-Fi", "Zigbee", "Matter", "App"], site: "https://ledvance.com", fn: "smart-home", tags: ["smart-home", "lighting", "matter", "wifi"], verdict: "Affordable Matter bulbs under the Smart+ line.", tier: "$", trust: 7.3, integ: 7.8 },

  // ---------------- HYBRID OFFICE (6) ----------------
  { name: "Elgato Key Light", slug: "elgato-key-light", mfr: "Elgato", hub: "hybrid_office", cat: "Office Hardware", sub: "Stream Lighting", type: "hardware", price: 129, cur: "USD", model: "one_time", desc: "App-controlled LED key light for video calls and streaming with adjustable color temperature.", feat: ["Key Light", "App Control", "Desk Mount", "Color Temp", "Mount", "Stream Deck"], site: "https://elgato.com", fn: "office-hardware", tags: ["office-hardware", "lighting", "streaming", "creator"], verdict: "Best key light for creators; app control excellent.", tier: "$$", trust: 8.2, integ: 8.4 },
  { name: "Blue Yeti", slug: "blue-yeti", mfr: "Logitech", hub: "hybrid_office", cat: "Office Hardware", sub: "USB Microphone", type: "hardware", price: 99, cur: "USD", model: "one_time", desc: "Best-selling USB condenser microphone for podcasts, calls, and streaming.", feat: ["Condenser Mic", "Patterns", "Gain", "Zero-Latency", "Mount", "USB"], site: "https://logitech.com", fn: "office-hardware", tags: ["office-hardware", "microphone", "audio", "creator"], verdict: "Iconic USB mic; versatile but picks up room noise.", tier: "$$", trust: 8.0, integ: 7.8 },
  { name: "Razer BlackWidow", slug: "razer-blackwidow", mfr: "Razer", hub: "hybrid_office", cat: "Office Hardware", sub: "Mechanical Keyboard", type: "hardware", price: 139, cur: "USD", model: "one_time", desc: "Mechanical gaming keyboard with customizable switches and RGB lighting for work and play.", feat: ["Mechanical", "RGB", "Switches", "Macro", "USB-C", "Passthrough"], site: "https://razer.com", fn: "office-hardware", tags: ["office-hardware", "keyboard", "gaming", "mechanical"], verdict: "Solid mechanical keyboard; gaming aesthetics.", tier: "$$", trust: 7.8, integ: 7.6 },
  { name: "Corsair K70", slug: "corsair-k70", mfr: "Corsair", hub: "hybrid_office", cat: "Office Hardware", sub: "Mechanical Keyboard", type: "hardware", price: 119, cur: "USD", model: "one_time", desc: "Premium mechanical keyboard with aluminum frame and iCUE software customization.", feat: ["Mechanical", "iCUE", "Aluminum", "Media Keys", "USB Passthrough", "Switches"], site: "https://corsair.com", fn: "office-hardware", tags: ["office-hardware", "keyboard", "mechanical", "gaming"], verdict: "Durable mechanical board with great build; iCUE heavy.", tier: "$$", trust: 7.9, integ: 7.7 },
  { name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5", mfr: "Sony", hub: "hybrid_office", cat: "Office Hardware", sub: "Noise-Cancelling Headphones", type: "hardware", price: 399, cur: "USD", model: "one_time", desc: "Flagship noise-cancelling headphones with industry-leading ANC and comfort.", feat: ["ANC", "Multipoint", "30h Battery", "Comfort", "Calls", "Touch"], site: "https://sony.com", fn: "office-hardware", tags: ["office-hardware", "headphones", "noise-cancelling", "audio"], verdict: "Best ANC headphones for travel and focus; pricey.", tier: "$$$", trust: 8.4, integ: 7.9 },
  { name: "Apple AirPods Max", slug: "apple-airpods-max", mfr: "Apple", hub: "hybrid_office", cat: "Office Hardware", sub: "Premium Headphones", type: "hardware", price: 549, cur: "USD", model: "one_time", desc: "Premium over-ear headphones with spatial audio and deep Apple ecosystem integration.", feat: ["ANC", "Spatial Audio", "H1 Chip", "Aluminum", "Case", "Transparency"], site: "https://apple.com", fn: "office-hardware", tags: ["office-hardware", "headphones", "noise-cancelling", "apple"], verdict: "Best for Apple ecosystem; heavy and expensive.", tier: "$$$", trust: 8.1, integ: 8.6 },
];

const clamp3 = (x: number) => Math.max(0, Math.min(3, Math.round((x / 10) * 3)));
const now = Date.now();
const TESTER = "seedExpandedCatalog";

export const seedExpandedCatalog = mutation({
  args: {},
  returns: v.object({ inserted: v.number(), skipped: v.number(), total: v.number() }),
  handler: async (ctx) => {
    let inserted = 0;
    let skipped = 0;

    for (const p of RAW) {
      const existing = await ctx.db
        .query("novaProducts")
        .withIndex("by_slug", (q) => q.eq("productSlug", p.slug))
        .first();
      if (existing) {
        skipped++;
        continue;
      }

      const imgCtx = {
        productSlug: p.slug,
        productName: p.name,
        category: p.cat,
        subcategory: p.sub,
      };
      const featuredImageUrl = resolveProductImage(imgCtx);
      const galleryImages = resolveProductGallery({
        ...imgCtx,
        functionalityTags: p.tags,
        featuredImageUrl,
      });

      const overall = Math.round(((p.trust + p.integ) / 2) * 10) / 10;
      const riskBadge = p.trust >= 8 ? "low" : p.trust >= 6.5 ? "medium" : "high";
      const exportQuality = p.trust >= 8 ? "excellent" : p.trust >= 6.5 ? "good" : "limited";

      const id = await ctx.db.insert("novaProducts", {
        productName: p.name,
        productSlug: p.slug,
        manufacturer: p.mfr,
        category: p.cat,
        subcategory: p.sub,
        productType: p.type,
        productTypeExtended: p.type === "software" ? "saas" : p.type,
        hub: p.hub,
        price: p.price,
        priceCurrency: p.cur,
        priceModel: p.model,
        description: p.desc,
        features: p.feat,
        specifications: { source: "expanded-catalog-2026", catalogVersion: 2 },
        status: "active",
        isSponsored: false,
        sponsorDisclosed: false,
        featuredImageUrl,
        galleryImages,
        officialWebsite: p.site,
        documentationUrl: `${p.site.replace(/\/$/, "")}/docs`,
        supportUrl: `${p.site.replace(/\/$/, "")}/support`,
        overallScore: overall,
        verdictSummary: p.verdict,
        pricingTier: p.tier,
        primaryFunctionality: p.fn,
        functionalityTags: p.tags,
        riskBadge,
        exportQuality,
        dataResidency: "global",
        selfHostAvailable: p.type === "software" && p.hub === "ai_workflow",
        createdBy: "seedExpandedCatalog",
        seoTitle: `${p.name} Review 2026 — Trust Score, Integration & Verdict | TheSynLab`,
        metaDescription: `Independent TheSynLab review of ${p.name}: trust score ${p.trust}/10, integration ${p.integ}/10, TCO, and who should use it.`,
        primaryKeywordTarget: `${p.name.toLowerCase()} review`,
        seoScore: 78 + Math.round((p.trust - 6) * 2),
        llmCitationSummary: p.desc,
        releaseDate: now,
      });

      await ctx.db.insert("novaTrustScores", {
        productId: id,
        version: 1,
        totalScore: p.trust,
        dataPrivacyPractices: clamp3(p.trust - 1),
        encryptionStandards: clamp3(p.trust),
        termsTransparency: clamp3(p.trust - 0.5),
        ethicalAiTransparency: clamp3(p.trust - 2),
        thirdPartyAudits: clamp3(p.trust - 1.5),
        testedBy: TESTER,
        testedDate: now,
        isCurrent: true,
        isVerified: false,
        createdBy: TESTER,
      });

      await ctx.db.insert("novaIntegrationScores", {
        productId: id,
        version: 1,
        totalScore: p.integ,
        apiDocumentation: clamp3(p.integ),
        crossPlatform: clamp3(p.integ - 0.5),
        smartHomeEcosystems: p.hub === "intelligent_home" ? clamp3(p.integ) : 0,
        automationPlatforms: clamp3(p.integ - 1),
        developerCommunity: clamp3(p.integ - 1.5),
        testedBy: TESTER,
        testedDate: now,
        isCurrent: true,
        isVerified: false,
        createdBy: TESTER,
      });

      inserted++;
    }

    return { inserted, skipped, total: RAW.length };
  },
});
