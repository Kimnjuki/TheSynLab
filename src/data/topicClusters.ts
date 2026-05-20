/**
 * Topic Cluster Strategy — pillar pages and supporting articles
 * 
 * Each cluster has a pillar topic, linked supporting articles, and cross-links.
 * This data is used for contextual internal linking throughout the site.
 */

export interface ClusterItem {
  slug: string;
  title: string;
  description: string;
  url: string;
}

export interface TopicCluster {
  id: string;
  pillarTitle: string;
  pillarSlug: string;
  pillarUrl: string;
  pillarDescription: string;
  related: ClusterItem[];
}

export const topicClusters: TopicCluster[] = [
  {
    id: "ai-productivity",
    pillarTitle: "Best AI Productivity Tools",
    pillarSlug: "hub/ai-workflow",
    pillarUrl: "/hub/ai-workflow",
    pillarDescription: "Expert reviews and comparisons of AI productivity tools, automation platforms, and smart assistants.",
    related: [
      { slug: "ai-writing-tools", title: "Best AI Writing Tools", description: "Compare top AI writing assistants for content creation.", url: "/best-ai-writing-tools" },
      { slug: "ai-meeting-assistants", title: "Best AI Meeting Assistants", description: "Meeting note-taking and summarization tools compared.", url: "/hub/ai-meeting-assistants" },
      { slug: "ai-project-management", title: "Best AI Project Management", description: "AI-enhanced project management software reviews.", url: "/hub/ai-project-management" },
    ],
  },
  {
    id: "smart-home",
    pillarTitle: "Best Smart Home Hub",
    pillarSlug: "hub/smart-home",
    pillarUrl: "/hub/smart-home",
    pillarDescription: "Complete guide to building a smart home ecosystem. Compare hubs, devices, and automation platforms.",
    related: [
      { slug: "smart-speakers", title: "Best Smart Speakers", description: "Voice assistant speaker comparison and reviews.", url: "/best-smart-speakers" },
      { slug: "smart-lighting", title: "Best Smart Lighting Systems", description: "Smart bulb and lighting system reviews.", url: "/best-smart-lighting" },
      { slug: "smart-security", title: "Best Smart Home Security", description: "Security camera and alarm system comparisons.", url: "/best-smart-security" },
    ],
  },
  {
    id: "hybrid-office",
    pillarTitle: "Best Hybrid Office Setup",
    pillarSlug: "hub/hybrid-office",
    pillarUrl: "/hub/hybrid-office",
    pillarDescription: "Build the ideal hybrid workspace. Reviews of standing desks, ergonomic chairs, monitors, and accessories.",
    related: [
      { slug: "standing-desks", title: "Best Standing Desks", description: "Height-adjustable desk reviews and comparisons.", url: "/best-standing-desks" },
      { slug: "ergonomic-chairs", title: "Best Ergonomic Chairs", description: "Office chair reviews for back health and comfort.", url: "/best-ergonomic-chairs" },
      { slug: "monitor-arms", title: "Best Monitor Arms", description: "Monitor arm and mount comparisons.", url: "/best-monitor-arms" },
    ],
  },
  {
    id: "saas-tools",
    pillarTitle: "Best SaaS Tools for Business",
    pillarSlug: "hub/saas",
    pillarUrl: "/hub/saas",
    pillarDescription: "Comprehensive SaaS tool reviews and comparisons across categories.",
    related: [
      { slug: "crm-software", title: "Best CRM Software", description: "Customer relationship management tool reviews.", url: "/best-crm-software" },
      { slug: "email-marketing", title: "Best Email Marketing Tools", description: "Email marketing platform comparisons.", url: "/best-email-marketing" },
      { slug: "analytics-tools", title: "Best Analytics Tools", description: "Web and product analytics tool reviews.", url: "/best-analytics-tools" },
    ],
  },
];

/**
 * Get related cluster items for a given URL
 */
export function getClusterForUrl(url: string): ClusterItem[] | null {
  for (const cluster of topicClusters) {
    if (cluster.pillarUrl === url) return cluster.related;
    const match = cluster.related.find((r) => r.url === url);
    if (match) return [cluster, ...cluster.related.filter((r) => r.slug !== match.slug)];
  }
  return null;
}

/**
 * Get pillar page recommendations for sidebar/related sections
 */
export function getRelatedClusters(currentClusterId: string, maxClusters = 3): TopicCluster[] {
  return topicClusters
    .filter((c) => c.id !== currentClusterId)
    .slice(0, maxClusters);
}
