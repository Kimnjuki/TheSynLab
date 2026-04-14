import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  toolCompetitorsSchema,
  toolFeaturesSchema,
  toolPricingSchema,
  toolComparisonsSchema,
  toolAlternativesSchema,
  toolUseCasesSchema,
  toolSeoMetricsSchema,
  contentTemplatesSchema,
  generatedContentPagesSchema,
  competitorActivityLogSchema,
  competitorSeoTrackingSchema,
  novaProductsCompetitiveEnhancements
} from "./schemaCompetitiveTools";

export default defineSchema({
  // ============ AD COMPLIANCE ============
  adSubmissions: defineTable({
    userId: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    destinationUrl: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    targetAudience: v.optional(v.any()),
    status: v.string(), // pending, approved, rejected, requires_review, flagged
    complianceScore: v.optional(v.number()),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  adComplianceViolations: defineTable({
    adId: v.optional(v.id("adSubmissions")),
    threadId: v.optional(v.id("forumThreads")),
    replyId: v.optional(v.id("forumReplies")),
    reportSource: v.optional(v.string()), // ad_submission | forum_thread | forum_reply | user_report
    reportedContent: v.optional(v.string()),
    violationLevel: v.number(), // 1-4
    violationCategory: v.string(),
    violationRule: v.string(),
    matchedKeywords: v.optional(v.array(v.string())),
    severity: v.string(), // CRITICAL, HIGH, MEDIUM, LOW
    description: v.optional(v.string()),
    aiConfidence: v.optional(v.number()),
    resolved: v.boolean(),
    resolvedAt: v.optional(v.number()),
    resolvedBy: v.optional(v.string()),
    resolutionNotes: v.optional(v.string()),
  }).index("by_ad", ["adId"])
    .index("by_resolved", ["resolved"]),

  adPolicyRules: defineTable({
    levelId: v.number(), // 1-4
    levelName: v.string(),
    severity: v.string(),
    category: v.string(),
    keywords: v.optional(v.array(v.string())),
    instruction: v.string(),
    isActive: v.boolean(),
    requiresCertification: v.boolean(),
    ageRestriction: v.optional(v.number()),
    geoRestrictions: v.optional(v.array(v.string())),
  }).index("by_level", ["levelId"])
    .index("by_active", ["isActive"]),

  adComplianceAuditLog: defineTable({
    adId: v.optional(v.id("adSubmissions")),
    action: v.string(),
    actorId: v.optional(v.string()),
    actorType: v.string(), // system, ai, moderator, admin
    previousStatus: v.optional(v.string()),
    newStatus: v.optional(v.string()),
    details: v.optional(v.any()),
  }).index("by_ad", ["adId"]),

  advertiserCertifications: defineTable({
    userId: v.string(),
    certificationType: v.string(),
    certificateNumber: v.optional(v.string()),
    issuingAuthority: v.optional(v.string()),
    validFrom: v.optional(v.number()),
    validUntil: v.optional(v.number()),
    verificationStatus: v.string(), // pending, verified, expired, revoked
    documentUrl: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // ============ AUTOMATIONS ============
  automations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    triggerType: v.string(),
    triggerConfig: v.optional(v.any()),
    actions: v.optional(v.array(v.any())),
    conditions: v.optional(v.array(v.any())),
    isActive: v.boolean(),
    createdBy: v.optional(v.string()),
    runCount: v.number(),
    lastRunAt: v.optional(v.number()),
  }).index("by_creator", ["createdBy"])
    .index("by_active", ["isActive"]),

  automationRuns: defineTable({
    automationId: v.id("automations"),
    triggerData: v.optional(v.any()),
    status: v.string(), // pending, running, success, failed
    errorLog: v.optional(v.string()),
    executedAt: v.number(),
  }).index("by_automation", ["automationId"]),

  automationTemplates: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    icon: v.optional(v.string()),
    triggerType: v.string(),
    triggerConfig: v.optional(v.any()),
    actions: v.optional(v.array(v.any())),
    conditions: v.optional(v.array(v.any())),
    isFeatured: v.boolean(),
    useCount: v.number(),
  }).index("by_category", ["category"])
    .index("by_featured", ["isFeatured"]),

  // ============ COMMENTS ============
  comments: defineTable({
    content: v.string(),
    userId: v.string(),
    parentId: v.optional(v.id("comments")),
    entityType: v.string(), // task, project, setup
    entityId: v.string(),
    isEdited: v.boolean(),
    reactions: v.optional(v.any()),
  }).index("by_entity", ["entityType", "entityId"])
    .index("by_user", ["userId"])
    .index("by_parent", ["parentId"]),

  // ============ PRODUCTS ============
  novaProducts: defineTable({
    productName: v.string(),
    productSlug: v.string(),
    manufacturer: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    productType: v.string(), // hardware, software, service
    productTypeExtended: v.optional(v.string()),
    hub: v.string(), // ai_workflow, intelligent_home, hybrid_office
    price: v.optional(v.number()),
    // S2: Lab benchmarks
    benchmarkData: v.optional(v.any()),
    labTestedAt: v.optional(v.number()),
    labTestedBy: v.optional(v.string()),
    benchmarkVersion: v.optional(v.string()),
    // S7: AR/VR
    modelUrl3D: v.optional(v.string()),
    arEnabled: v.optional(v.boolean()),
    dimensionsCm: v.optional(v.any()),
    priceCurrency: v.string(),
    priceModel: v.string(), // one_time, subscription, freemium
    releaseDate: v.optional(v.number()),
    description: v.optional(v.string()),
    features: v.optional(v.any()),
    specifications: v.optional(v.any()),
    status: v.string(), // active, discontinued, coming_soon
    isSponsored: v.boolean(),
    sponsorDisclosed: v.boolean(),
    featuredImageUrl: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    heroGifUrl: v.optional(v.string()),
    officialWebsite: v.optional(v.string()),
    documentationUrl: v.optional(v.string()),
    supportUrl: v.optional(v.string()),
    changelogUrl: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
    dataHash: v.optional(v.string()),
    // Audit SCHEMA-MOD-001: SEO and display
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    schemaMarkup: v.optional(v.any()),
    canonicalUrl: v.optional(v.string()),
    overallScore: v.optional(v.number()),
    verdictSummary: v.optional(v.string()),
    primaryKeywordTarget: v.optional(v.string()),
    seoScore: v.optional(v.number()),
    aiRiskSummary: v.optional(v.string()),
    aiRecommendedFor: v.optional(v.array(v.string())),
    aiNotRecommendedFor: v.optional(v.array(v.string())),
    compatibilityNodeId: v.optional(v.string()),
    membershipGated: v.optional(v.boolean()),
    labCertified: v.optional(v.boolean()),
    labCertifiedAt: v.optional(v.float64()),
    // Products hub decision metadata
    riskBadge: v.optional(v.string()), // low|medium|high
    exportQuality: v.optional(v.string()), // excellent|good|limited
    dataResidency: v.optional(v.string()), // us-only|eu-friendly|global
    selfHostAvailable: v.optional(v.boolean()),
    pricingTier: v.optional(v.string()), // $|$$|$$$
    pricingComplexityLabel: v.optional(v.string()),
    teamSizeMin: v.optional(v.float64()),
    teamSizeMax: v.optional(v.float64()),
    overflowWarning: v.optional(v.string()),
    followCount: v.optional(v.float64()),
    trendingRank: v.optional(v.float64()),
    isTrending: v.optional(v.boolean()),
    isBestOfMonth: v.optional(v.boolean()),
  }).index("by_slug", ["productSlug"])
    .index("by_hub", ["hub"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_hub_status", ["hub", "status"])
    .index("by_category_status", ["category", "status"])
    .index("by_trending", ["isTrending"])
    .index("by_best_of_month", ["isBestOfMonth"]),

  novaTrustScores: defineTable({
    productId: v.id("novaProducts"),
    version: v.number(),
    totalScore: v.number(),
    dataPrivacyPractices: v.optional(v.number()),
    encryptionStandards: v.optional(v.number()),
    termsTransparency: v.optional(v.number()),
    ethicalAiTransparency: v.optional(v.number()),
    thirdPartyAudits: v.optional(v.number()),
    methodologyVersion: v.optional(v.string()),
    methodologyNotes: v.optional(v.string()),
    evidenceUrls: v.optional(v.array(v.string())),
    testingNotes: v.optional(v.string()),
    testedBy: v.string(),
    testedDate: v.number(),
    reviewedBy: v.optional(v.string()),
    reviewDate: v.optional(v.number()),
    isCurrent: v.boolean(),
    isVerified: v.boolean(),
    verificationDate: v.optional(v.number()),
    createdBy: v.string(),
  }).index("by_product", ["productId"])
    .index("by_current", ["productId", "isCurrent"]),

  novaIntegrationScores: defineTable({
    productId: v.id("novaProducts"),
    version: v.number(),
    totalScore: v.number(),
    apiDocumentation: v.optional(v.number()),
    crossPlatform: v.optional(v.number()),
    smartHomeEcosystems: v.optional(v.number()),
    automationPlatforms: v.optional(v.number()),
    developerCommunity: v.optional(v.number()),
    methodologyVersion: v.optional(v.string()),
    methodologyNotes: v.optional(v.string()),
    testResults: v.optional(v.any()),
    testingNotes: v.optional(v.string()),
    testedBy: v.string(),
    testedDate: v.number(),
    reviewedBy: v.optional(v.string()),
    reviewDate: v.optional(v.number()),
    isCurrent: v.boolean(),
    isVerified: v.boolean(),
    verificationDate: v.optional(v.number()),
    createdBy: v.string(),
    mlPredictedScore: v.optional(v.number()),
    mlConfidence: v.optional(v.number()),
    predictionModel: v.optional(v.string()),
    predictionFeatures: v.optional(v.any()),
    lastPredictedAt: v.optional(v.number()),
  }).index("by_product", ["productId"])
    .index("by_current", ["productId", "isCurrent"]),

  novaEcosystemCompatibility: defineTable({
    productId: v.id("novaProducts"),
    ecosystem: v.string(),
    compatibilityLevel: v.string(), // full, partial, limited, none, unknown
    integrationMethod: v.optional(v.string()),
    setupComplexity: v.optional(v.number()), // 1-5
    requiresHub: v.boolean(),
    officialSupport: v.boolean(),
    communityVerified: v.boolean(),
    verifiedCount: v.number(),
    lastVerifiedDate: v.optional(v.number()),
    verificationSource: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  }).index("by_product", ["productId"])
    .index("by_ecosystem", ["ecosystem"]),

  // ============ POSTS ============
  novaPosts: defineTable({
    authorId: v.string(),
    postTitle: v.string(),
    postSlug: v.string(),
    postContent: v.string(),
    postExcerpt: v.optional(v.string()),
    postType: v.string(), // article, review, guide, comparison
    postStatus: v.string(), // draft, published, scheduled, archived
    hub: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaKeywords: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    schemaMarkup: v.optional(v.any()),
    wordCount: v.optional(v.number()),
    primaryKeyword: v.optional(v.string()),
    secondaryKeywords: v.optional(v.array(v.string())),
    isLivingGuide: v.optional(v.boolean()),
    tldrSummary: v.optional(v.string()),
    verdictText: v.optional(v.string()),
    readingLevel: v.optional(v.string()),
    readingTimeMinutes: v.optional(v.number()),
    viewCount: v.number(),
    uniqueViewCount: v.number(),
    lastViewedAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    lastModifiedBy: v.optional(v.string()),
    adReadinessScore: v.optional(v.float64()),
    hasAffiliateDisclosure: v.optional(v.boolean()),
    aiGeneratedDraft: v.optional(v.boolean()),
    aiDraftReviewedBy: v.optional(v.string()),
    copilotSessionCount: v.optional(v.float64()),
  }).index("by_slug", ["postSlug"])
    .index("by_author", ["authorId"])
    .index("by_status", ["postStatus"])
    .index("by_hub", ["hub"])
    .index("by_published_date", ["postStatus", "publishedAt"]),

  novaPostMeta: defineTable({
    postId: v.id("novaPosts"),
    metaKey: v.string(),
    metaValue: v.optional(v.string()),
  }).index("by_post", ["postId"]),

  novaPostProducts: defineTable({
    postId: v.id("novaPosts"),
    productId: v.id("novaProducts"),
    productRole: v.string(), // primary, comparison, mentioned
    displayOrder: v.number(),
  }).index("by_post", ["postId"])
    .index("by_product", ["productId"]),

  novaPostTaxonomies: defineTable({
    postId: v.id("novaPosts"),
    taxonomyId: v.id("novaTaxonomies"),
  }).index("by_post", ["postId"])
    .index("by_taxonomy", ["taxonomyId"]),

  novaTaxonomies: defineTable({
    taxonomyName: v.string(),
    taxonomySlug: v.string(),
    taxonomyType: v.string(), // category, tag, series
    description: v.optional(v.string()),
    parentId: v.optional(v.id("novaTaxonomies")),
    count: v.number(),
  }).index("by_slug", ["taxonomySlug"])
    .index("by_type", ["taxonomyType"]),

  // ============ USERS ============
  novaUsers: defineTable({
    clerkId: v.string(), // Link to Clerk user
    username: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    bio: v.optional(v.string()),
    profilePhotoUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    userStatus: v.string(), // active, pending_verification, suspended, deleted
    emailVerified: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    lastLoginIp: v.optional(v.string()),
    loginCount: v.number(),
    twoFactorEnabled: v.boolean(),
    isFellow: v.optional(v.boolean()),
    fellowSlug: v.optional(v.string()),
    membershipTier: v.optional(v.string()),
    aiStackSessionCount: v.optional(v.float64()),
    copilotSessionCount: v.optional(v.float64()),
    preferredSegment: v.optional(v.string()),
  }).index("by_clerk", ["clerkId"])
    .index("by_username", ["username"])
    .index("by_email", ["email"]),

  novaUserRoles: defineTable({
    userId: v.id("novaUsers"),
    roleName: v.string(), // admin, moderator, editor, author, contributor, subscriber
    grantedBy: v.optional(v.id("novaUsers")),
    grantedAt: v.number(),
    expiresAt: v.optional(v.number()),
    isActive: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_role", ["roleName"]),

  novaUserPii: defineTable({
    userId: v.id("novaUsers"),
    encryptedEmail: v.optional(v.string()),
    encryptedPhone: v.optional(v.string()),
    encryptedAddress: v.optional(v.string()),
    encryptedPaymentInfo: v.optional(v.string()),
    dataRetentionDate: v.optional(v.number()),
    consentMarketing: v.boolean(),
    consentAnalytics: v.boolean(),
    consentGivenAt: v.optional(v.number()),
    consentIp: v.optional(v.string()),
    lastAccessed: v.optional(v.number()),
    accessCount: v.number(),
  }).index("by_user", ["userId"]),

  novaPermissions: defineTable({
    permissionName: v.string(),
    permissionCategory: v.optional(v.string()),
    description: v.optional(v.string()),
    isSystem: v.boolean(),
  }).index("by_name", ["permissionName"]),

  novaRolePermissions: defineTable({
    roleName: v.string(),
    permissionId: v.id("novaPermissions"),
  }).index("by_role", ["roleName"]),

  // ============ AFFILIATE ============
  novaAffiliatePrograms: defineTable({
    programName: v.string(),
    programSlug: v.string(),
    network: v.optional(v.string()),
    programType: v.string(), // hardware, software, service
    commissionType: v.string(), // one_time, recurring, hybrid
    commissionRate: v.optional(v.string()),
    cookieDuration: v.optional(v.number()),
    paymentTerms: v.optional(v.string()),
    minimumPayout: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
    applicationStatus: v.string(), // pending, approved, rejected
    applicationDate: v.optional(v.number()),
    approvalDate: v.optional(v.number()),
    accountId: v.optional(v.string()),
    apiKeyLastFour: v.optional(v.string()),
    priority: v.number(),
    termsAccepted: v.boolean(),
    termsVersion: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdBy: v.optional(v.string()),
  }).index("by_slug", ["programSlug"])
    .index("by_status", ["applicationStatus"]),

  novaAffiliateLinks: defineTable({
    productId: v.id("novaProducts"),
    programId: v.id("novaAffiliatePrograms"),
    linkUrl: v.string(),
    cloakedUrl: v.optional(v.string()),
    linkType: v.string(), // primary, backup, geo_specific
    geoTarget: v.optional(v.string()),
    commissionRate: v.optional(v.string()),
    isActive: v.boolean(),
    clickCount: v.number(),
    uniqueClickCount: v.number(),
    conversionCount: v.number(),
    lastClickedAt: v.optional(v.number()),
    lastCheckedAt: v.optional(v.number()),
    linkHealthStatus: v.string(), // healthy, broken, unchecked
    createdBy: v.optional(v.string()),
    // S10: Dynamic pricing
    currentPrice: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    priceHistory: v.optional(v.array(v.any())),
    priceLastFetched: v.optional(v.number()),
    roiScore: v.optional(v.number()),
    utmMedium: v.optional(v.string()),
    utmSource: v.optional(v.string()),
  }).index("by_product", ["productId"])
    .index("by_program", ["programId"])
    .index("by_active", ["isActive"]),

  novaAffiliateClicks: defineTable({
    linkId: v.id("novaAffiliateLinks"),
    userId: v.optional(v.id("novaUsers")),
    sessionId: v.optional(v.string()),
    postId: v.optional(v.id("novaPosts")),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    deviceType: v.string(), // desktop, mobile, tablet, unknown
    browser: v.optional(v.string()),
    operatingSystem: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    isBot: v.boolean(),
    clickTimestamp: v.number(),
    converted: v.optional(v.boolean()),
    conversionValue: v.optional(v.number()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  }).index("by_link", ["linkId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["clickTimestamp"]),

  novaAffiliatePerformance: defineTable({
    programId: v.id("novaAffiliatePrograms"),
    trackingDate: v.number(),
    clicks: v.number(),
    uniqueClicks: v.number(),
    conversions: v.number(),
    revenue: v.number(),
    commission: v.number(),
    currency: v.string(),
    dataVerified: v.boolean(),
    verificationDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  }).index("by_program", ["programId"])
    .index("by_date", ["trackingDate"]),

  // ============ SECURITY ============
  novaApiKeys: defineTable({
    userId: v.id("novaUsers"),
    keyName: v.string(),
    apiKeyHash: v.string(),
    apiKeyPrefix: v.string(),
    permissions: v.optional(v.any()),
    rateLimit: v.number(),
    isActive: v.boolean(),
    lastUsedAt: v.optional(v.number()),
    lastUsedIp: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_active", ["isActive"]),

  novaBlockedIps: defineTable({
    ipAddress: v.string(),
    reason: v.string(),
    blockedBy: v.optional(v.string()),
    blockedAt: v.number(),
    expiresAt: v.optional(v.number()),
    isPermanent: v.boolean(),
    severity: v.string(), // low, medium, high, critical
    attemptCount: v.number(),
  }).index("by_ip", ["ipAddress"]),

  novaFailedLoginAttempts: defineTable({
    username: v.optional(v.string()),
    email: v.optional(v.string()),
    ipAddress: v.string(),
    userAgent: v.optional(v.string()),
    attemptTime: v.number(),
    failureReason: v.optional(v.string()),
  }).index("by_ip", ["ipAddress"])
    .index("by_time", ["attemptTime"]),

  novaSecurityAuditLog: defineTable({
    eventType: v.string(), // login, logout, permission_change, data_access, etc
    userId: v.optional(v.string()),
    username: v.optional(v.string()),
    tableName: v.optional(v.string()),
    recordId: v.optional(v.string()),
    action: v.optional(v.string()),
    oldValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    status: v.string(), // success, failure
    severity: v.string(), // low, medium, high, critical
    description: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_event", ["eventType"]),

  novaRateLimits: defineTable({
    identifier: v.string(),
    identifierType: v.string(), // ip, user, api_key
    endpoint: v.optional(v.string()),
    requestCount: v.number(),
    firstRequestAt: v.number(),
    lastRequestAt: v.number(),
    blockedUntil: v.optional(v.number()),
    isBlocked: v.boolean(),
  }).index("by_identifier", ["identifier"]),

  novaGdprRequests: defineTable({
    userId: v.id("novaUsers"),
    requestType: v.string(), // access, rectification, erasure, portability
    status: v.string(), // pending, processing, completed, rejected
    requestDetails: v.optional(v.string()),
    requestedAt: v.number(),
    processedBy: v.optional(v.id("novaUsers")),
    processedAt: v.optional(v.number()),
    completionNotes: v.optional(v.string()),
    verificationToken: v.optional(v.string()),
    verified: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // ============ REVIEWS ============
  productReviews: defineTable({
    productId: v.id("novaProducts"),
    userId: v.string(), // Clerk user ID
    rating: v.number(), // 1-5
    reviewTitle: v.string(),
    reviewContent: v.string(),
    workflowImproved: v.optional(v.string()),
    useCase: v.optional(v.string()),
    teamSize: v.optional(v.string()),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    verifiedPurchase: v.boolean(),
    helpfulCount: v.number(),
    isApproved: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    flagCount: v.optional(v.number()),
    // S3: Blockchain verification
    blockchainTxHash: v.optional(v.string()),
    blockchainNetwork: v.optional(v.string()),
    reviewContentHash: v.optional(v.string()),
    verificationLevel: v.optional(v.string()), // none | email | purchase | blockchain
    synTokensAwarded: v.optional(v.number()),
    integrationQualityRating: v.optional(v.float64()),
    onboardingRating: v.optional(v.float64()),
    supportRating: v.optional(v.float64()),
    topReviewTheme: v.optional(v.string()),
    // AF-04: Sentiment analysis fields
    sentimentStatus: v.optional(v.union(v.literal("pending"), v.literal("complete"), v.literal("failed"))),
    sentimentProcessedAt: v.optional(v.float64()),
    sentimentModelVersion: v.optional(v.string()),
    migrationMentioned: v.optional(v.boolean()),
    complianceMentioned: v.optional(v.boolean()),
    integrationsMentioned: v.optional(v.array(v.string())),
  }).index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_product_approved", ["productId", "isApproved"]),

  reviewHelpfulVotes: defineTable({
    reviewId: v.id("productReviews"),
    userId: v.string(),
  }).index("by_review", ["reviewId"])
    .index("by_user", ["userId"]),

  // ============ USER PROFILES ============
  profiles: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    notificationPreferences: v.optional(v.any()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
  }).index("by_clerk", ["clerkId"]),

  userRoles: defineTable({
    userId: v.string(), // Clerk user ID
    role: v.string(), // admin, moderator, user
  }).index("by_user", ["userId"]),

  // ============ PROJECTS & TASKS ============
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    status: v.string(), // active, completed, archived
    ownerId: v.string(), // Clerk user ID
  }).index("by_owner", ["ownerId"])
    .index("by_status", ["status"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // backlog, todo, in_progress, review, done
    priority: v.string(), // low, medium, high, urgent
    assignedTo: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    actualHours: v.number(),
    tags: v.optional(v.array(v.string())),
    dependencies: v.optional(v.array(v.id("tasks"))),
    parentTaskId: v.optional(v.id("tasks")),
    sortOrder: v.number(),
  }).index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_parent", ["parentTaskId"]),

  teamMembers: defineTable({
    userId: v.string(), // Clerk user ID
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    workloadCapacity: v.number(),
    currentWorkload: v.number(),
  }).index("by_user", ["userId"]),

  // ============ SETUP LIKES ============
  setupLikes: defineTable({
    userId: v.string(),
    setupId: v.id("novaPosts"),
  }).index("by_user", ["userId"])
    .index("by_setup", ["setupId"]),

  // ============ USER CONFIGS ============
  userBudgetConfigs: defineTable({
    userId: v.optional(v.string()),
    configName: v.string(),
    totalBudget: v.number(),
    categories: v.any(),
    savedProducts: v.optional(v.any()),
  }).index("by_user", ["userId"]),

  userErgonomicAssessments: defineTable({
    userId: v.string(),
    assessmentDate: v.number(),
    answers: v.any(),
    score: v.number(),
    improvementTips: v.optional(v.array(v.string())),
    selectedBundle: v.optional(v.string()),
    role: v.optional(v.string()),
    budget: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  userFavoriteProducts: defineTable({
    userId: v.string(),
    productId: v.id("novaProducts"),
  }).index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  userSavedPrompts: defineTable({
    userId: v.string(),
    templateId: v.optional(v.number()),
    customPrompt: v.string(),
    variables: v.optional(v.any()),
    title: v.string(),
    category: v.optional(v.string()),
    useCount: v.number(),
  }).index("by_user", ["userId"]),

  userSmartHomeConfigs: defineTable({
    userId: v.string(),
    name: v.string(),
    ecosystem: v.optional(v.string()),
    devices: v.array(v.any()),
    scenes: v.array(v.any()),
    energyBudget: v.optional(v.number()),
    electricityRate: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  userWorkflowConfigs: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    workflowNodes: v.array(v.any()),
    workflowConnections: v.array(v.any()),
    isActive: v.boolean(),
    runCount: v.number(),
    lastRunAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  // ============ FORUM ============
  forumCategories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    sortOrder: v.number(),
    threadCount: v.number(),
    postCount: v.number(),
    lastActivityAt: v.optional(v.number()),
    isLocked: v.boolean(),
  }).index("by_slug", ["slug"])
    .index("by_order", ["sortOrder"]),

  forumThreads: defineTable({
    categoryId: v.id("forumCategories"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    isPinned: v.boolean(),
    isLocked: v.boolean(),
    isSolved: v.boolean(),
    viewCount: v.number(),
    replyCount: v.number(),
    likeCount: v.number(),
    lastReplyAt: v.optional(v.number()),
    lastReplyBy: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    promptType: v.optional(v.string()), // workflow_question | setup_help | integration | general
    relatedProductIds: v.optional(v.array(v.id("novaProducts"))),
    relatedProposalId: v.optional(v.id("scoreWeightProposals")),
    metaDescription: v.optional(v.string()),
    isIndexable: v.optional(v.boolean()),
    acceptedAnswerReplyId: v.optional(v.id("forumReplies")),
    moderationStatus: v.optional(v.string()), // approved | pending_review
  }).index("by_category", ["categoryId"])
    .index("by_slug", ["slug"])
    .index("by_author", ["authorId"])
    .index("by_pinned", ["isPinned"]),

  forumReplies: defineTable({
    threadId: v.id("forumThreads"),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    parentReplyId: v.optional(v.id("forumReplies")),
    isEdited: v.boolean(),
    isSolution: v.boolean(),
    likeCount: v.number(),
    likes: v.optional(v.array(v.string())),
    moderationStatus: v.optional(v.string()), // approved | pending_review
  }).index("by_thread", ["threadId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentReplyId"]),

  forumThreadLikes: defineTable({
    threadId: v.id("forumThreads"),
    userId: v.string(),
  }).index("by_thread", ["threadId"])
    .index("by_user", ["userId"]),

  // ============ AUDIT NEW TABLES (SCHEMA-NEW-001 to 005) ============
  novaNewsletterSubscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    source: v.string(),
    isVerified: v.boolean(),
    isActive: v.boolean(),
    unsubscribedAt: v.optional(v.number()),
    preferences: v.optional(v.any()),
    userId: v.optional(v.id("novaUsers")),
  }).index("by_email", ["email"])
    .index("by_active", ["isActive"]),

  novaProductComparisons: defineTable({
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    comparisonSlug: v.string(),
    viewCount: v.number(),
    lastViewedAt: v.number(),
    isGenerated: v.boolean(),
    generatedAt: v.optional(v.number()),
  }).index("by_slug", ["comparisonSlug"])
    .index("by_product_a", ["productAId"])
    .index("by_product_b", ["productBId"]),

  novaSearchQueries: defineTable({
    query: v.string(),
    userId: v.optional(v.string()),
    resultsCount: v.number(),
    clickedResultId: v.optional(v.string()),
    clickedResultType: v.optional(v.string()),
    searchedAt: v.number(),
    sessionId: v.optional(v.string()),
  }).index("by_query", ["query"])
    .index("by_date", ["searchedAt"]),

  novaContentSections: defineTable({
    postId: v.id("novaPosts"),
    sectionType: v.string(),
    sectionTitle: v.optional(v.string()),
    sectionContent: v.any(),
    sortOrder: v.number(),
    isPublished: v.boolean(),
  }).index("by_post", ["postId"])
    .index("by_type", ["sectionType"]),

  novaRedirectRules: defineTable({
    fromPath: v.string(),
    toPath: v.string(),
    redirectType: v.number(),
    isActive: v.boolean(),
    hitCount: v.number(),
    createdBy: v.optional(v.string()),
  }).index("by_from", ["fromPath"])
    .index("by_active", ["isActive"]),

  // ============ COMPETITIVE BLUEPRINT TABLES (S1–S10) ============
  mlPredictionJobs: defineTable({
    productId: v.id("novaProducts"),
    jobStatus: v.string(),
    inputFeatures: v.optional(v.any()),
    outputScore: v.optional(v.number()),
    modelVersion: v.optional(v.string()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    errorLog: v.optional(v.string()),
  }).index("by_product", ["productId"])
    .index("by_status", ["jobStatus"]),

  labBenchmarkTemplates: defineTable({
    category: v.string(),
    subcategory: v.optional(v.string()),
    templateName: v.string(),
    metrics: v.array(v.any()),
    methodology: v.string(),
    version: v.string(),
    isActive: v.boolean(),
  }).index("by_category", ["category"]),

  integrationSimulations: defineTable({
    userId: v.optional(v.string()),
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    simulationConfig: v.any(),
    resultScore: v.optional(v.number()),
    resultDetails: v.optional(v.any()),
    status: v.string(),
    runAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_products", ["productAId", "productBId"]),

  apiCompatibilityMatrix: defineTable({
    ecosystemA: v.string(),
    ecosystemB: v.string(),
    compatibilityScore: v.number(),
    integrationMethod: v.string(),
    setupComplexity: v.number(),
    notes: v.optional(v.string()),
    lastUpdated: v.number(),
    sources: v.optional(v.array(v.string())),
  }).index("by_ecosystem_a", ["ecosystemA"])
    .index("by_ecosystems", ["ecosystemA", "ecosystemB"]),

  userPreferenceProfiles: defineTable({
    userId: v.string(),
    workStyle: v.optional(v.string()),
    priorityFactors: v.optional(v.array(v.string())),
    budgetRange: v.optional(v.any()),
    ecosystemPreferences: v.optional(v.array(v.string())),
    categoryWeights: v.optional(v.any()),
    inferredFromBehavior: v.boolean(),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),

  scoreWeightProposals: defineTable({
    proposedBy: v.string(),
    category: v.string(),
    weightFactor: v.string(),
    currentWeight: v.number(),
    proposedWeight: v.number(),
    rationale: v.string(),
    status: v.string(),
    voteCount: v.number(),
    votes: v.optional(v.array(v.any())),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  }).index("by_category", ["category"])
    .index("by_status", ["status"]),

  synTokenLedger: defineTable({
    userId: v.string(),
    eventType: v.string(),
    amount: v.number(),
    referenceId: v.optional(v.string()),
    referenceType: v.optional(v.string()),
    txHash: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_event", ["eventType"]),

  productTcoScores: defineTable({
    productId: v.id("novaProducts"),
    year1Cost: v.number(),
    year2Cost: v.number(),
    year3Cost: v.number(),
    totalTco: v.number(),
    currency: v.string(),
    includesLicensing: v.boolean(),
    includesSupport: v.boolean(),
    includesTraining: v.boolean(),
    energyConsumptionKwh: v.optional(v.number()),
    carbonFootprintKg: v.optional(v.number()),
    ecoScore: v.optional(v.number()),
    recyclabilityScore: v.optional(v.number()),
    calculatedAt: v.number(),
    methodology: v.optional(v.string()),
    switchingCostEstimate: v.optional(v.float64()),
    migrationComplexityScore: v.optional(v.float64()),
    dataExportSupported: v.optional(v.boolean()),
    vendorLockInScore: v.optional(v.float64()),
    isCurrent: v.boolean(),
  }).index("by_product", ["productId"])
    .index("by_current", ["productId", "isCurrent"]),

  reviewTranslations: defineTable({
    reviewId: v.id("productReviews"),
    locale: v.string(),
    translatedTitle: v.string(),
    translatedContent: v.string(),
    translatedPros: v.optional(v.array(v.string())),
    translatedCons: v.optional(v.array(v.string())),
    translationModel: v.string(),
    translatedAt: v.number(),
    culturalAdjustments: v.optional(v.any()),
  }).index("by_review_locale", ["reviewId", "locale"]),

  scoreLocaleAdjustments: defineTable({
    productId: v.id("novaProducts"),
    locale: v.string(),
    adjustedTrustScore: v.optional(v.number()),
    adjustedIntegrationScore: v.optional(v.number()),
    relevantEcosystems: v.optional(v.array(v.string())),
    localRegulations: v.optional(v.array(v.string())),
    lastUpdated: v.number(),
  }).index("by_product_locale", ["productId", "locale"]),

  roiCalculations: defineTable({
    userId: v.optional(v.string()),
    productId: v.id("novaProducts"),
    teamSize: v.optional(v.number()),
    currentToolCost: v.optional(v.number()),
    estimatedTimeSavingHours: v.optional(v.number()),
    hourlyRate: v.optional(v.number()),
    calculatedRoi: v.number(),
    paybackPeriodMonths: v.optional(v.number()),
    calculatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  vendorApiKeys: defineTable({
    vendorId: v.string(),
    apiKeyHash: v.string(),
    productIds: v.array(v.id("novaProducts")),
    allowedDomains: v.array(v.string()),
    planTier: v.string(),
    requestCount: v.number(),
    lastUsedAt: v.optional(v.number()),
  }).index("by_vendor", ["vendorId"]),

  // ============ SCHEMA ADDITIONS (v2.0) ============
  productBookmarks: defineTable({
    userId: v.string(),
    productId: v.id("novaProducts"),
    addedAt: v.number(),
    listName: v.string(),
  }).index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  compareSessionLogs: defineTable({
    productIds: v.array(v.id("novaProducts")),
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    viewedAt: v.number(),
    duration: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  productAlerts: defineTable({
    userId: v.string(),
    productId: v.id("novaProducts"),
    alertType: v.string(),
    threshold: v.optional(v.number()),
    isActive: v.boolean(),
    lastTriggeredAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  // ============ PRODUCTS HUB (v2.0) ============
  productHubFilters: defineTable({
    userId: v.optional(v.string()),
    filterName: v.string(),
    categories: v.optional(v.array(v.string())),
    useCaseTags: v.optional(v.array(v.string())),
    technicalTraits: v.optional(v.array(v.string())),
    teamSizeFit: v.optional(v.string()),
    minTrustScore: v.optional(v.float64()),
    minIntegrationScore: v.optional(v.float64()),
    lockInRisk: v.optional(v.string()), // low|medium|high
    pricingComplexity: v.optional(v.string()),
    sortBy: v.string(), // trustScore|integrationDepth|lockInRisk|trending|newest
    createdAt: v.float64(),
  }).index("by_user", ["userId"]),

  productTrendingScores: defineTable({
    productId: v.id("novaProducts"),
    periodLabel: v.string(),
    periodYear: v.float64(),
    periodMonth: v.float64(),
    trustScoreDelta: v.float64(),
    integrationScoreDelta: v.float64(),
    bookmarkCountDelta: v.float64(),
    reviewCountDelta: v.float64(),
    trendingRank: v.float64(),
    velocityScore: v.float64(),
    computedAt: v.float64(),
    isCurrent: v.boolean(),
  }).index("by_period", ["periodYear", "periodMonth"])
    .index("by_product", ["productId"])
    .index("by_rank", ["periodYear", "periodMonth", "trendingRank"]),

  productHubSections: defineTable({
    sectionKey: v.string(),
    sectionLabel: v.string(),
    sectionDescription: v.optional(v.string()),
    sectionIcon: v.optional(v.string()),
    productIds: v.array(v.id("novaProducts")),
    sortOrder: v.float64(),
    isActive: v.boolean(),
    hubSlug: v.optional(v.string()),
  }).index("by_order", ["sortOrder"])
    .index("by_hub", ["hubSlug"]),

  productFollows: defineTable({
    userId: v.string(),
    productId: v.id("novaProducts"),
    followedAt: v.float64(),
    notifyOnTrustChange: v.boolean(),
    notifyOnNewReview: v.boolean(),
    notifyOnNewTemplate: v.boolean(),
    notifyThreshold: v.optional(v.float64()),
  }).index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_user_product", ["userId", "productId"]),

  productDecisionCards: defineTable({
    productId: v.id("novaProducts"),
    topPros: v.array(v.string()), // max 3
    topWatchOuts: v.array(v.string()), // max 2
    bestForTags: v.array(v.string()),
    keyIntegrations: v.array(v.string()), // top 5 tool names
    selfHostOption: v.boolean(),
    soc2Ready: v.boolean(),
    gdprReady: v.boolean(),
    lockInRisk: v.string(), // low|medium|high
    exportQuality: v.string(), // excellent|good|limited
    dataResidency: v.string(), // us-only|eu-friendly|global
    pricingComplexity: v.string(), // simple|tiered|enterprise-only
    typicalCostTier: v.string(), // $|$$|$$$
    teamSizeMin: v.optional(v.float64()),
    teamSizeMax: v.optional(v.float64()),
    overflowsAt: v.optional(v.string()),
    stackFitRole: v.optional(v.string()),
    alternativeCount: v.float64(),
    workflowTemplateCount: v.float64(),
    communityStackCount: v.float64(),
    generatedAt: v.float64(),
    isCurrent: v.boolean(),
  }).index("by_product", ["productId"])
    .index("by_current", ["productId", "isCurrent"]),

  productIntegrationMiniGraph: defineTable({
    productId: v.id("novaProducts"),
    connectedProductIds: v.array(v.id("novaProducts")),
    connectionStrengths: v.any(),
    connectionMethods: v.any(),
    generatedAt: v.float64(),
  }).index("by_product", ["productId"]),

  buyerJourneyPaths: defineTable({
    pathSlug: v.string(),
    pathTitle: v.string(),
    pathDescription: v.string(),
    pathType: v.string(), // new-stack|migration|role-based|team-size
    targetSegment: v.string(), // solo|startup|smb|enterprise
    migrateFromTool: v.optional(v.string()),
    migrateToProductIds: v.optional(v.array(v.id("novaProducts"))),
    productSequence: v.array(v.id("novaProducts")),
    stepDescriptions: v.array(v.any()),
    viewCount: v.float64(),
    isActive: v.boolean(),
    sortOrder: v.float64(),
  }).index("by_slug", ["pathSlug"])
    .index("by_segment", ["targetSegment"])
    .index("by_type", ["pathType"]),

  hubActivityFeed: defineTable({
    activityType: v.string(), // trust_score_update|new_review|new_template|score_milestone|community_save
    productId: v.id("novaProducts"),
    activityTitle: v.string(),
    activityBody: v.optional(v.string()),
    activityMeta: v.optional(v.any()),
    scoreDelta: v.optional(v.float64()),
    createdAt: v.float64(),
    isPublished: v.boolean(),
    expiresAt: v.optional(v.float64()),
  }).index("by_type", ["activityType"])
    .index("by_date", ["createdAt"])
    .index("by_product", ["productId"]),

  userProductStack: defineTable({
    userId: v.string(),
    productIds: v.array(v.id("novaProducts")),
    stackName: v.optional(v.string()),
    isDefault: v.boolean(),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }).index("by_user", ["userId"]),

  productNotifications: defineTable({
    userId: v.string(),
    productId: v.id("novaProducts"),
    notificationType: v.string(), // trust_delta|new_template|new_review|score_milestone
    deliveryMethod: v.string(), // email|in_app|both
    minDeltaThreshold: v.optional(v.float64()),
    isActive: v.boolean(),
    createdAt: v.float64(),
  }).index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  // ============ PDP EXTENSIONS ============
  productPageMeta: defineTable({
    productId: v.id("novaProducts"),
    timeToFirstValueMinutes: v.optional(v.float64()),
    setupDifficulty: v.optional(v.float64()), // 1..3
    learningCurve: v.optional(v.float64()), // 1..3
    benchmarkedWorkflowCount: v.optional(v.float64()),
    releaseCadence: v.optional(v.string()), // weekly | monthly | quarterly | rarely
    maturityLevel: v.optional(v.string()), // early | growing | battle_tested
    stackFitRole: v.optional(v.string()), // core_system | supportive_addon | niche_specialist
    bestForTags: v.optional(v.array(v.string())),
    whoShouldUse: v.optional(v.string()),
    whoShouldAvoid: v.optional(v.string()),
    replacesTools: v.optional(v.array(v.string())),
    goodFirstTask: v.optional(v.string()),
    useCases: v.optional(v.array(v.any())),
    performanceRanges: v.optional(v.array(v.any())),
    alternativeProductIds: v.optional(v.array(v.id("novaProducts"))),
    differentiatorVsAlternatives: v.optional(v.array(v.any())),
    typicalNextToolIds: v.optional(v.array(v.id("novaProducts"))),
    featuredTutorialPostId: v.optional(v.id("novaPosts")),
    timeVsPayoffScore: v.optional(v.float64()),
    lastEditorialReviewAt: v.optional(v.float64()),
    editorialReviewedBy: v.optional(v.string()),
  }).index("by_product", ["productId"])
    .index("by_maturity", ["maturityLevel"])
    .index("by_stack_fit", ["stackFitRole"]),

  productGallerySlides: defineTable({
    productId: v.id("novaProducts"),
    slideOrder: v.float64(),
    slideType: v.string(), // overview | problem | feature | integration | results | recipe
    imageUrl: v.string(),
    caption: v.string(),
    annotatedImageUrl: v.optional(v.string()),
    scenarioTags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
    createdBy: v.optional(v.string()),
  }).index("by_product", ["productId"])
    .index("by_product_order", ["productId", "slideOrder"]),

  workflowRecipes: defineTable({
    productId: v.id("novaProducts"),
    recipeTitle: v.string(),
    recipeSlug: v.string(),
    summary: v.optional(v.string()),
    estimatedMinutes: v.optional(v.float64()),
    toolStack: v.optional(v.array(v.string())),
    toolProductIds: v.optional(v.array(v.id("novaProducts"))),
    steps: v.optional(v.array(v.any())),
    audienceTag: v.optional(v.string()),
    difficulty: v.optional(v.string()), // beginner | intermediate | advanced
    isFeatured: v.boolean(),
    isVerifiedByEditorial: v.boolean(),
    viewCount: v.float64(),
    authorId: v.optional(v.string()),
    publishedAt: v.optional(v.float64()),
  }).index("by_product", ["productId"])
    .index("by_featured", ["isFeatured"])
    .index("by_audience", ["audienceTag"])
    .index("by_slug", ["recipeSlug"]),

  contentHubs: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    heroImageUrl: v.optional(v.string()),
    pillarCount: v.float64(),
    spokeCount: v.float64(),
    totalWordCount: v.float64(),
    lastUpdatedAt: v.float64(),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    schemaMarkup: v.optional(v.any()),
    avgTrustScore: v.optional(v.float64()),
    avgIntegrationScore: v.optional(v.float64()),
    topProductIds: v.optional(v.array(v.id("novaProducts"))),
    isActive: v.boolean(),
  }).index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),

  hubKeywords: defineTable({
    hubSlug: v.string(),
    keyword: v.string(),
    keywordType: v.string(),
    monthlyVolume: v.optional(v.float64()),
    difficulty: v.optional(v.float64()),
    currentRank: v.optional(v.float64()),
    assignedPostId: v.optional(v.id("novaPosts")),
    contentStatus: v.string(),
    priority: v.float64(),
  }).index("by_hub", ["hubSlug"])
    .index("by_status", ["contentStatus"])
    .index("by_keyword", ["keyword"]),

  internalLinks: defineTable({
    sourcePostId: v.id("novaPosts"),
    targetPostId: v.id("novaPosts"),
    anchorText: v.string(),
    linkType: v.string(),
    hubSlug: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_source", ["sourcePostId"])
    .index("by_target", ["targetPostId"])
    .index("by_hub", ["hubSlug"]),

  scoreIndexPages: defineTable({
    indexType: v.string(),
    slug: v.string(),
    title: v.string(),
    metaDescription: v.optional(v.string()),
    filters: v.optional(v.any()),
    totalProducts: v.float64(),
    lastGeneratedAt: v.float64(),
    schemaMarkup: v.optional(v.any()),
  }).index("by_slug", ["slug"])
    .index("by_type", ["indexType"]),

  bestOfPages: defineTable({
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    useCase: v.string(),
    year: v.float64(),
    hubSlug: v.string(),
    winnerProductId: v.id("novaProducts"),
    rankedProductIds: v.array(v.id("novaProducts")),
    rankingCriteria: v.optional(v.any()),
    editorNote: v.optional(v.string()),
    lastUpdatedAt: v.float64(),
    publishedAt: v.float64(),
    viewCount: v.float64(),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    schemaMarkup: v.optional(v.any()),
  }).index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_hub", ["hubSlug"])
    .index("by_year", ["year"]),

  comparisonArticles: defineTable({
    slug: v.string(),
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    verdictProductId: v.id("novaProducts"),
    chooseAIf: v.string(),
    chooseBIf: v.string(),
    featureTableData: v.optional(v.any()),
    trustDelta: v.optional(v.float64()),
    integrationDelta: v.optional(v.float64()),
    authorId: v.string(),
    publishedAt: v.float64(),
    lastUpdatedAt: v.float64(),
    viewCount: v.float64(),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  }).index("by_slug", ["slug"])
    .index("by_product_a", ["productAId"])
    .index("by_product_b", ["productBId"]),

  researchReports: defineTable({
    slug: v.string(),
    title: v.string(),
    reportType: v.string(),
    hubSlug: v.string(),
    year: v.float64(),
    quarter: v.optional(v.float64()),
    summary: v.optional(v.string()),
    keyFindings: v.optional(v.array(v.string())),
    methodology: v.optional(v.string()),
    productsAnalyzed: v.float64(),
    dataPoints: v.float64(),
    chartData: v.optional(v.any()),
    publishedAt: v.float64(),
    lastUpdatedAt: v.float64(),
    downloadCount: v.float64(),
    backlinksEarned: v.optional(v.float64()),
    featuredInMedia: v.optional(v.array(v.string())),
    accessLevel: v.string(),
    pdfUrl: v.optional(v.string()),
  }).index("by_slug", ["slug"])
    .index("by_hub", ["hubSlug"])
    .index("by_year", ["year"])
    .index("by_type", ["reportType"]),

  reportOutreachLog: defineTable({
    reportId: v.id("researchReports"),
    targetPublication: v.string(),
    contactEmail: v.optional(v.string()),
    outreachDate: v.float64(),
    status: v.string(),
    responseNotes: v.optional(v.string()),
    backlinkEarned: v.boolean(),
    backlinkUrl: v.optional(v.string()),
  }).index("by_report", ["reportId"])
    .index("by_status", ["status"]),

  toolUsageSessions: defineTable({
    toolType: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    inputData: v.optional(v.any()),
    resultData: v.optional(v.any()),
    emailCaptured: v.boolean(),
    convertedToSignup: v.boolean(),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    aiAssisted: v.optional(v.boolean()),
    stackSessionId: v.optional(v.string()),
    decisionStudioSessionId: v.optional(v.string()),
    usedAt: v.float64(),
  }).index("by_tool", ["toolType"])
    .index("by_user", ["userId"])
    .index("by_date", ["usedAt"]),

  // ============ AI ADVANTAGE TABLES (2026-03-31) ============
  aiStackSessions: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    status: v.string(),
    conversationHistory: v.optional(v.array(v.any())),
    collectedContext: v.optional(v.any()),
    proposedStack: v.optional(v.any()),
    userSegment: v.optional(v.string()),
    intakeAnswers: v.optional(v.any()),
    generatedStack: v.optional(v.any()),
    refinementHistory: v.optional(v.array(v.any())),
    aiModelVersion: v.optional(v.string()),
    conversionEvent: v.optional(v.string()),
    startedAt: v.float64(),
    updatedAt: v.optional(v.float64()),
    completedAt: v.optional(v.float64()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_segment", ["userSegment"])
    .index("by_session", ["sessionId"]),

  aiScoreExplanations: defineTable({
    productId: v.id("novaProducts"),
    scoreType: v.string(),
    explanation: v.string(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    redFlags: v.array(v.string()),
    trustScoreId: v.optional(v.id("novaTrustScores")),
    integrationScoreId: v.optional(v.id("novaIntegrationScores")),
    generatedAt: v.float64(),
    modelVersion: v.string(),
  }).index("by_product", ["productId"])
    .index("by_score_type", ["productId", "scoreType"]),

  aiScenarioResults: defineTable({
    userId: v.optional(v.string()),
    originalStack: v.array(v.id("novaProducts")),
    replacedProductId: v.id("novaProducts"),
    replacementProductId: v.id("novaProducts"),
    impactAnalysis: v.any(),
    costDelta: v.optional(v.float64()),
    privacyRiskDelta: v.optional(v.float64()),
    lockInDelta: v.optional(v.float64()),
    integrationComplexityDelta: v.optional(v.float64()),
    generatedAt: v.float64(),
  }).index("by_user", ["userId"])
    .index("by_products", ["replacedProductId", "replacementProductId"]),

  aiRiskAnalyses: defineTable({
    productId: v.id("novaProducts"),
    privacyRiskScore: v.float64(),
    tosAmbiguityScore: v.float64(),
    dataResidencyFlags: v.array(v.string()),
    securityPostureScore: v.float64(),
    riskSummary: v.string(),
    detailedFindings: v.any(),
    analyzedDocUrls: v.optional(v.array(v.string())),
    generatedAt: v.float64(),
    isCurrent: v.boolean(),
  }).index("by_product", ["productId"])
    .index("by_current", ["productId", "isCurrent"]),

  aiReviewCopilotOutputs: defineTable({
    reviewId: v.optional(v.id("productReviews")),
    productId: v.id("novaProducts"),
    userId: v.optional(v.string()),
    userContext: v.any(),
    reframedSummary: v.string(),
    tailoredPros: v.array(v.string()),
    tailoredCons: v.array(v.string()),
    mustCheckSettings: v.array(v.string()),
    useCaseRelevanceScore: v.float64(),
    generatedAt: v.float64(),
  }).index("by_product", ["productId"])
    .index("by_user", ["userId"]),

  aiComparisonNarratives: defineTable({
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    narrative: v.string(),
    checklist: v.array(v.any()),
    recommendationSummary: v.string(),
    verdictProductId: v.optional(v.id("novaProducts")),
    userContext: v.optional(v.any()),
    basedOnComparisonArticleId: v.optional(v.id("comparisonArticles")),
    generatedAt: v.float64(),
    viewCount: v.float64(),
  }).index("by_products", ["productAId", "productBId"])
    .index("by_date", ["generatedAt"]),

  aiIntegrationGraph: defineTable({
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    confirmed: v.boolean(),
    integrationMethod: v.string(),
    nativeSupport: v.boolean(),
    requiresMiddleware: v.boolean(),
    middlewareOptions: v.optional(v.array(v.string())),
    confidenceScore: v.float64(),
    sourceUrls: v.optional(v.array(v.string())),
    lastVerifiedAt: v.float64(),
    autoVerified: v.boolean(),
  }).index("by_product_a", ["productAId"])
    .index("by_products", ["productAId", "productBId"]),

  aiWorkflowRecipes: defineTable({
    userId: v.optional(v.string()),
    prompt: v.string(),
    productIds: v.array(v.id("novaProducts")),
    steps: v.array(v.any()),
    automationPlatforms: v.array(v.string()),
    triggerConfig: v.any(),
    estimatedSetupMinutes: v.optional(v.float64()),
    complexity: v.string(),
    generatedAt: v.float64(),
    savedCount: v.float64(),
  }).index("by_user", ["userId"])
    .index("by_date", ["generatedAt"]),

  aiSetupBlueprints: defineTable({
    sourcePostId: v.id("novaPosts"),
    goals: v.array(v.string()),
    stackSummary: v.string(),
    productIds: v.array(v.id("novaProducts")),
    keyAutomations: v.array(v.string()),
    pitfalls: v.array(v.string()),
    estimatedCostMonthly: v.optional(v.float64()),
    teamSizeRange: v.optional(v.string()),
    generatedAt: v.float64(),
    isPublished: v.boolean(),
  }).index("by_post", ["sourcePostId"])
    .index("by_published", ["isPublished"]),

  aiReviewDrafts: defineTable({
    productId: v.id("novaProducts"),
    postId: v.optional(v.id("novaPosts")),
    draftSections: v.any(),
    benchmarkDataUsed: v.optional(v.any()),
    editorAssigned: v.optional(v.string()),
    editStatus: v.string(),
    aiConfidence: v.float64(),
    generatedAt: v.float64(),
    lastEditedAt: v.optional(v.float64()),
  }).index("by_product", ["productId"])
    .index("by_status", ["editStatus"]),

  aiAnomalyFlags: defineTable({
    targetType: v.string(),
    targetId: v.string(),
    flagType: v.string(),
    description: v.string(),
    confidenceScore: v.float64(),
    severity: v.string(),
    reviewStatus: v.string(),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.float64()),
    detectedAt: v.float64(),
  }).index("by_target", ["targetType", "targetId"])
    .index("by_status", ["reviewStatus"])
    .index("by_severity", ["severity"]),

  aiCoachAlerts: defineTable({
    userId: v.string(),
    alertType: v.string(),
    title: v.string(),
    message: v.string(),
    relatedProductId: v.optional(v.id("novaProducts")),
    suggestedActions: v.array(v.string()),
    isRead: v.boolean(),
    isDismissed: v.boolean(),
    triggerReason: v.string(),
    createdAt: v.float64(),
  }).index("by_user", ["userId"])
    .index("by_unread", ["userId", "isRead"]),

  aiRiskProfiles: defineTable({
    productId: v.id("novaProducts"),
    isCurrent: v.boolean(),
    privacyRiskScore: v.float64(),
    vendorLockInRisk: v.float64(),
    failureImpactScore: v.float64(),
    dataPortabilityScore: v.float64(),
    regulatoryComplianceScore: v.float64(),
    aiExplanation: v.string(),
    riskFactors: v.optional(v.array(v.any())),
    mitigationSuggestions: v.optional(v.array(v.string())),
    modelVersion: v.optional(v.string()),
    computedAt: v.float64(),
    basedOnTrustScoreVersion: v.optional(v.float64()),
    basedOnIntegrationScoreVersion: v.optional(v.float64()),
  }).index("by_product", ["productId"])
    .index("by_current", ["productId", "isCurrent"]),

  aiWhatIfSimulations: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    originalStackProductIds: v.array(v.id("novaProducts")),
    swapAction: v.any(),
    resultStack: v.optional(v.any()),
    deltaRisk: v.optional(v.float64()),
    deltaMonthlyCost: v.optional(v.float64()),
    deltaIntegrationComplexity: v.optional(v.float64()),
    aiTradeoffExplanation: v.optional(v.string()),
    simulatedAt: v.float64(),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  aiReviewCopilotSessions: defineTable({
    productId: v.id("novaProducts"),
    userId: v.optional(v.string()),
    useCaseInput: v.string(),
    generatedHighlights: v.optional(v.string()),
    generatedChecklist: v.optional(v.array(v.string())),
    generatedOnboardingPlan: v.optional(v.string()),
    generatedSopDraft: v.optional(v.string()),
    downloadedFormats: v.optional(v.array(v.string())),
    emailCaptured: v.boolean(),
    convertedToSignup: v.boolean(),
    modelVersion: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_date", ["createdAt"]),

  aiCompatibilityNodes: defineTable({
    productId: v.id("novaProducts"),
    supportsWebhooks: v.boolean(),
    supportsOAuth: v.boolean(),
    supportsRestApi: v.boolean(),
    supportsGraphQL: v.boolean(),
    nativeIntegrations: v.optional(v.array(v.string())),
    zapierSupport: v.optional(v.boolean()),
    makeSupport: v.optional(v.boolean()),
    n8nSupport: v.optional(v.boolean()),
    apiDocsUrl: v.optional(v.string()),
    rateLimitTier: v.optional(v.string()),
    lastAgentVerifiedAt: v.optional(v.float64()),
    agentVerificationStatus: v.string(),
    agentConfidenceScore: v.optional(v.float64()),
    rawApiCapabilities: v.optional(v.any()),
    updatedAt: v.float64(),
  }).index("by_product", ["productId"])
    .index("by_verification", ["agentVerificationStatus"]),

  aiCompatibilityEdges: defineTable({
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    isFeasible: v.boolean(),
    connectionMethod: v.string(),
    glueToolsRequired: v.optional(v.array(v.string())),
    setupComplexityScore: v.float64(),
    estimatedSetupHours: v.optional(v.float64()),
    aiExplanation: v.optional(v.string()),
    verifiedAt: v.float64(),
    agentVerificationStatus: v.string(),
    confidenceScore: v.optional(v.float64()),
    exampleUseCases: v.optional(v.array(v.string())),
  }).index("by_product_a", ["productAId"])
    .index("by_product_b", ["productBId"])
    .index("by_pair", ["productAId", "productBId"]),

  aiCommunityInsights: defineTable({
    insightType: v.string(),
    hubSlug: v.optional(v.string()),
    relatedProductIds: v.optional(v.array(v.id("novaProducts"))),
    insightTitle: v.string(),
    insightBody: v.string(),
    evidenceCount: v.float64(),
    confidenceScore: v.float64(),
    isPublished: v.boolean(),
    displayOnProductIds: v.optional(v.array(v.id("novaProducts"))),
    displayOnHubSlugs: v.optional(v.array(v.string())),
    generatedAt: v.float64(),
    expiresAt: v.optional(v.float64()),
    modelVersion: v.optional(v.string()),
  }).index("by_hub", ["hubSlug"])
    .index("by_type", ["insightType"])
    .index("by_published", ["isPublished"]),

  aiEditorialDrafts: defineTable({
    productId: v.id("novaProducts"),
    draftType: v.string(),
    generatedContent: v.string(),
    structuredProsCons: v.optional(v.any()),
    biasFlags: v.optional(v.array(v.any())),
    missingDisclosureFlags: v.optional(v.array(v.string())),
    duplicateContentScore: v.optional(v.float64()),
    readabilityScore: v.optional(v.float64()),
    editorStatus: v.string(),
    editorId: v.optional(v.string()),
    editorNotes: v.optional(v.string()),
    publishedPostId: v.optional(v.id("novaPosts")),
    modelVersion: v.optional(v.string()),
    generatedAt: v.float64(),
    reviewedAt: v.optional(v.float64()),
  }).index("by_product", ["productId"])
    .index("by_status", ["editorStatus"])
    .index("by_date", ["generatedAt"]),

  aiPlaybooks: defineTable({
    title: v.string(),
    slug: v.string(),
    stackProductIds: v.array(v.id("novaProducts")),
    targetSegment: v.string(),
    playbookType: v.string(),
    sections: v.array(v.any()),
    authorType: v.string(),
    authorId: v.optional(v.string()),
    accessLevel: v.string(),
    downloadCount: v.float64(),
    rating: v.optional(v.float64()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.float64()),
    lastUpdatedAt: v.float64(),
  }).index("by_slug", ["slug"])
    .index("by_segment", ["targetSegment"])
    .index("by_access", ["accessLevel"])
    .index("by_published", ["isPublished"]),

  aiConsultationRequests: defineTable({
    userId: v.string(),
    requestType: v.string(),
    stackSessionId: v.optional(v.string()),
    briefDescription: v.string(),
    budgetRange: v.optional(v.string()),
    teamSize: v.optional(v.float64()),
    aiDraftStatus: v.string(),
    aiDraftContent: v.optional(v.any()),
    assignedExpertId: v.optional(v.string()),
    expertNotes: v.optional(v.string()),
    deliverableUrl: v.optional(v.string()),
    paymentStatus: v.string(),
    amountUsd: v.optional(v.float64()),
    createdAt: v.float64(),
    deliveredAt: v.optional(v.float64()),
  }).index("by_user", ["userId"])
    .index("by_status", ["aiDraftStatus"])
    .index("by_payment", ["paymentStatus"]),

  membershipTiers: defineTable({
    tierName: v.string(),
    monthlyPriceUsd: v.float64(),
    annualPriceUsd: v.optional(v.float64()),
    features: v.any(),
    isActive: v.boolean(),
    stripeProductId: v.optional(v.string()),
    displayOrder: v.float64(),
  }).index("by_tier", ["tierName"])
    .index("by_active", ["isActive"]),

  userMemberships: defineTable({
    userId: v.id("novaUsers"),
    tierId: v.id("membershipTiers"),
    tierName: v.string(),
    status: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodStart: v.float64(),
    currentPeriodEnd: v.float64(),
    cancelledAt: v.optional(v.float64()),
    usageThisPeriod: v.optional(v.any()),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"]),

  cmpConsentRecords: defineTable({
    userId: v.optional(v.id("novaUsers")),
    sessionId: v.string(),
    consentVersion: v.string(),
    consentTimestamp: v.float64(),
    ipCountry: v.optional(v.string()),
    necessaryCookies: v.boolean(),
    analyticsCookies: v.boolean(),
    advertisingCookies: v.boolean(),
    functionalCookies: v.boolean(),
    consentMethod: v.string(),
    userAgent: v.optional(v.string()),
    updatedAt: v.optional(v.float64()),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_timestamp", ["consentTimestamp"]),

  adSlotConfigs: defineTable({
    slotName: v.string(),
    pageTemplate: v.string(),
    iabFormat: v.string(),
    position: v.string(),
    isActive: v.boolean(),
    adNetworkTag: v.optional(v.string()),
    isAffiliateSlot: v.boolean(),
    minContentLength: v.optional(v.float64()),
    notes: v.optional(v.string()),
  }).index("by_template", ["pageTemplate"])
    .index("by_active", ["isActive"]),

  contentQualityAudits: defineTable({
    postId: v.id("novaPosts"),
    auditedAt: v.float64(),
    adSenseReadinessScore: v.float64(),
    hasNamedAuthor: v.boolean(),
    hasPublishDate: v.boolean(),
    hasAffiliateDisclosure: v.boolean(),
    hasAdDisclosure: v.boolean(),
    wordCount: v.float64(),
    uniquenessScore: v.optional(v.float64()),
    biasScore: v.optional(v.float64()),
    structureScore: v.float64(),
    flags: v.optional(v.array(v.any())),
    passesAdPolicyCheck: v.boolean(),
    recommendations: v.optional(v.array(v.string())),
  }).index("by_post", ["postId"])
    .index("by_date", ["auditedAt"])
    .index("by_pass", ["passesAdPolicyCheck"]),

  decisionStudioSessions: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.string(),
    toolsUsed: v.array(v.string()),
    productIds: v.array(v.id("novaProducts")),
    switchingCostEstimate: v.optional(v.float64()),
    totalTco: v.optional(v.float64()),
    compatibilityResult: v.optional(v.any()),
    emailCaptured: v.boolean(),
    convertedToSignup: v.boolean(),
    referrer: v.optional(v.string()),
    usedAt: v.float64(),
  }).index("by_user", ["userId"])
    .index("by_date", ["usedAt"])
    .index("by_session", ["sessionId"]),

  embeddableWidgets: defineTable({
    widgetType: v.string(),
    embedCode: v.string(),
    partnerDomain: v.optional(v.string()),
    isActive: v.boolean(),
    impressionCount: v.float64(),
    clickCount: v.float64(),
    createdAt: v.float64(),
  }).index("by_type", ["widgetType"])
    .index("by_active", ["isActive"]),

  seoAuditResults: defineTable({
    postId: v.id("novaPosts"),
    auditedAt: v.float64(),
    titleScore: v.float64(),
    metaScore: v.float64(),
    headingScore: v.float64(),
    internalLinkScore: v.float64(),
    schemaScore: v.float64(),
    readabilityScore: v.float64(),
    overallScore: v.float64(),
    issues: v.optional(v.array(v.any())),
    recommendations: v.optional(v.array(v.string())),
  }).index("by_post", ["postId"])
    .index("by_score", ["overallScore"])
    .index("by_date", ["auditedAt"]),

  paaQuestions: defineTable({
    keyword: v.string(),
    question: v.string(),
    hubSlug: v.optional(v.string()),
    assignedPostId: v.optional(v.id("novaPosts")),
    isCovered: v.boolean(),
    addedAt: v.float64(),
  }).index("by_keyword", ["keyword"])
    .index("by_hub", ["hubSlug"])
    .index("by_covered", ["isCovered"]),

  trendingTopics: defineTable({
    topic: v.string(),
    hubSlug: v.optional(v.string()),
    trendScore: v.float64(),
    searchVolumeDelta: v.optional(v.float64()),
    competitorCoverage: v.optional(v.float64()),
    opportunityScore: v.float64(),
    status: v.string(),
    assignedPostId: v.optional(v.id("novaPosts")),
    discoveredAt: v.float64(),
    targetPublishDate: v.optional(v.float64()),
  }).index("by_hub", ["hubSlug"])
    .index("by_status", ["status"])
    .index("by_opportunity", ["opportunityScore"]),

  livingGuides: defineTable({
    postId: v.id("novaPosts"),
    updateFrequency: v.string(),
    lastReviewedAt: v.float64(),
    nextReviewDue: v.float64(),
    changeLog: v.optional(v.array(v.any())),
    isLivingGuide: v.boolean(),
    editorAssigned: v.optional(v.string()),
  }).index("by_post", ["postId"])
    .index("by_next_review", ["nextReviewDue"]),

  synlabFellows: defineTable({
    userId: v.id("novaUsers"),
    fellowSlug: v.string(),
    specialization: v.array(v.string()),
    bio: v.string(),
    badgeLevel: v.string(),
    contributionCount: v.float64(),
    githubUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    publishedGuideIds: v.optional(v.array(v.id("novaPosts"))),
    featuredSetupId: v.optional(v.id("novaPosts")),
    joinedAt: v.float64(),
    isActive: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_slug", ["fellowSlug"])
    .index("by_badge", ["badgeLevel"])
    .index("by_active", ["isActive"]),

  authorProfiles: defineTable({
    userId: v.string(),
    displayName: v.string(),
    title: v.string(),
    credentials: v.optional(v.array(v.string())),
    expertise: v.optional(v.array(v.string())),
    bio: v.string(),
    longBio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    personalSiteUrl: v.optional(v.string()),
    articleCount: v.float64(),
    reviewCount: v.float64(),
    totalViews: v.float64(),
    isFellow: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_fellow", ["isFellow"]),

  communityScoreRatings: defineTable({
    productId: v.id("novaProducts"),
    userId: v.string(),
    trustDimension: v.string(),
    integrationDimension: v.string(),
    trustRating: v.float64(),
    integrationRating: v.float64(),
    evidence: v.optional(v.string()),
    isVerifiedUser: v.boolean(),
    ratedAt: v.float64(),
  }).index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_dimension", ["trustDimension", "integrationDimension"]),

  newsletterCampaigns: defineTable({
    campaignName: v.string(),
    subject: v.string(),
    previewText: v.optional(v.string()),
    htmlContent: v.string(),
    textContent: v.optional(v.string()),
    segmentFilter: v.optional(v.any()),
    scheduledFor: v.optional(v.float64()),
    sentAt: v.optional(v.float64()),
    recipientCount: v.float64(),
    openCount: v.float64(),
    clickCount: v.float64(),
    unsubscribeCount: v.float64(),
    status: v.string(),
    campaignType: v.string(),
  }).index("by_status", ["status"])
    .index("by_type", ["campaignType"])
    .index("by_scheduled", ["scheduledFor"]),

  socialPosts: defineTable({
    platform: v.string(),
    content: v.string(),
    mediaUrls: v.optional(v.array(v.string())),
    linkedPostId: v.optional(v.id("novaPosts")),
    linkedProductId: v.optional(v.id("novaProducts")),
    scheduledFor: v.optional(v.float64()),
    publishedAt: v.optional(v.float64()),
    status: v.string(),
    impressions: v.optional(v.float64()),
    clicks: v.optional(v.float64()),
    engagements: v.optional(v.float64()),
    utmCampaign: v.optional(v.string()),
  }).index("by_platform", ["platform"])
    .index("by_status", ["status"])
    .index("by_scheduled", ["scheduledFor"]),

  referralProgram: defineTable({
    userId: v.string(),
    referralCode: v.string(),
    referralCount: v.float64(),
    rewardType: v.string(),
    rewardStatus: v.string(),
    earnedAt: v.optional(v.float64()),
  }).index("by_user", ["userId"])
    .index("by_code", ["referralCode"]),

  seoHealthMetrics: defineTable({
    recordedAt: v.float64(),
    hubSlug: v.string(),
    organicSessions: v.optional(v.float64()),
    newReferringDomains: v.optional(v.float64()),
    toolUsageSessions: v.optional(v.float64()),
    newSignups: v.optional(v.float64()),
    avgCoreWebVitalsLCP: v.optional(v.float64()),
    avgCoreWebVitalsCLS: v.optional(v.float64()),
    avgCoreWebVitalsFID: v.optional(v.float64()),
    indexedPageCount: v.optional(v.float64()),
    orphanedPostCount: v.optional(v.float64()),
    postsWithNoSchema: v.optional(v.float64()),
    staleScoreCount: v.optional(v.float64()),
  }).index("by_hub", ["hubSlug"])
    .index("by_date", ["recordedAt"]),

  abTestExperiments: defineTable({
    experimentName: v.string(),
    pageType: v.string(),
    variantA: v.any(),
    variantB: v.any(),
    metric: v.string(),
    startedAt: v.float64(),
    endedAt: v.optional(v.float64()),
    variantAConversions: v.float64(),
    variantBConversions: v.float64(),
    variantAImpressions: v.float64(),
    variantBImpressions: v.float64(),
    winnerVariant: v.optional(v.string()),
    status: v.string(),
    confidenceLevel: v.optional(v.float64()),
  }).index("by_page_type", ["pageType"])
    .index("by_status", ["status"]),

  sitemapEntries: defineTable({
    url: v.string(),
    sitemapType: v.string(),
    priority: v.float64(),
    changefreq: v.string(),
    lastmod: v.float64(),
    isIndexable: v.boolean(),
    entityId: v.optional(v.string()),
    entityType: v.optional(v.string()),
  }).index("by_type", ["sitemapType"])
    .index("by_indexable", ["isIndexable"])
    .index("by_lastmod", ["lastmod"]),

  crawlIssues: defineTable({
    url: v.string(),
    issueType: v.string(),
    severity: v.string(),
    description: v.string(),
    detectedAt: v.float64(),
    resolvedAt: v.optional(v.float64()),
    isResolved: v.boolean(),
    postId: v.optional(v.id("novaPosts")),
  }).index("by_type", ["issueType"])
    .index("by_severity", ["severity"])
    .index("by_resolved", ["isResolved"]),

  // ============ AI FEATURES 2.0 - NEW TABLES ============
  // AF-04: AI Review Sentiment Analysis
  aiReviewSentiment: defineTable({
    reviewId: v.id("productReviews"),
    productId: v.id("novaProducts"),
    overallSentimentLabel: v.union(v.literal("positive"), v.literal("neutral"), v.literal("negative")),
    overallSentimentScore: v.float64(),
    aspects: v.any(),
    summary: v.string(),
    keyThemes: v.array(v.string()),
    sentimentStatus: v.union(v.literal("pending"), v.literal("complete"), v.literal("failed")),
    modelVersion: v.string(),
    processingDurationMs: v.optional(v.float64()),
    rawModelOutput: v.optional(v.any()),
    processedAt: v.optional(v.float64()),
  }).index("by_review", ["reviewId"])
    .index("by_product", ["productId"])
    .index("by_status", ["sentimentStatus"])
    .index("by_product_date", ["productId", "processedAt"]),

  // AF-04: Product Sentiment Aggregates
  productSentimentAggregates: defineTable({
    productId: v.id("novaProducts"),
    overallSentimentScore: v.float64(),
    positivePercent: v.float64(),
    neutralPercent: v.float64(),
    negativePercent: v.float64(),
    aspectAverages: v.any(),
    sentimentTrend30d: v.optional(v.float64()),
    sentimentTrend90d: v.optional(v.float64()),
    topPraised: v.optional(v.string()),
    topComplained: v.optional(v.string()),
    reviewCount: v.float64(),
    lastComputedAt: v.float64(),
    isCurrent: v.boolean(),
  }).index("by_product", ["productId"])
    .index("by_current", ["productId", "isCurrent"]),

  // AF-09: Compliance Memos
  complianceMemos: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    productIds: v.array(v.id("novaProducts")),
    userRegion: v.string(),
    userIndustry: v.optional(v.string()),
    requestedFrameworks: v.array(v.string()),
    memoContent: v.string(),
    complianceMatrix: v.any(),
    overallPosture: v.union(v.literal("compliant"), v.literal("partial"), v.literal("non_compliant")),
    criticalGaps: v.array(v.any()),
    recommendations: v.array(v.string()),
    pdfUrl: v.optional(v.string()),
    generatedAt: v.float64(),
    modelVersion: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_date", ["generatedAt"]),

  // AF-01: AI Stack Comparisons
  aiStackComparisons: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.string(),
    stackAProductIds: v.array(v.id("novaProducts")),
    stackBProductIds: v.array(v.id("novaProducts")),
    stackALabel: v.optional(v.string()),
    stackBLabel: v.optional(v.string()),
    comparisonDimensions: v.any(),
    aiNarrative: v.string(),
    recommendedStack: v.union(v.literal("A"), v.literal("B"), v.literal("hybrid")),
    hybridRecommendation: v.optional(v.any()),
    generatedAt: v.float64(),
    viewCount: v.float64(),
    isPublic: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_public", ["isPublic"]),

  // AF-06: Protocol Adoption Data
  aiProtocolAdoptionData: defineTable({
    protocol: v.string(),
    productId: v.id("novaProducts"),
    supportLevel: v.union(v.literal("native"), v.literal("hub_required"), v.literal("partial"), v.literal("none")),
    supportedSince: v.optional(v.float64()),
    certificationStatus: v.optional(v.string()),
    communityVerified: v.boolean(),
    lastVerifiedAt: v.float64(),
  }).index("by_protocol", ["protocol"])
    .index("by_product", ["productId"])
    .index("by_support", ["protocol", "supportLevel"]),

  // AF-06: Ecosystem Health Snapshots
  aiEcosystemHealthSnapshots: defineTable({
    hubSlug: v.string(),
    snapshotDate: v.float64(),
    avgTrustScore: v.float64(),
    avgIntegrationScore: v.float64(),
    avgSentimentScore: v.float64(),
    vendorRiskCount: v.float64(),
    risingProductIds: v.array(v.id("novaProducts")),
    decliningProductIds: v.array(v.id("novaProducts")),
    breakingChangeAlerts: v.array(v.any()),
    computedBy: v.string(),
    isCurrent: v.boolean(),
  }).index("by_hub", ["hubSlug"])
    .index("by_date", ["snapshotDate"])
    .index("by_current", ["hubSlug", "isCurrent"]),

  // AF-04: Chat with Reviews Sessions
  aiChatWithReviewsSessions: defineTable({
    userId: v.optional(v.string()),
    productId: v.id("novaProducts"),
    conversationHistory: v.array(v.any()),
    sessionContext: v.optional(v.any()),
    totalMessages: v.float64(),
    startedAt: v.float64(),
    lastActivityAt: v.float64(),
    convertedToSignup: v.boolean(),
    emailCaptured: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_date", ["startedAt"]),

  // AF-10: Extension Matches
  extensionMatches: defineTable({
    productId: v.id("novaProducts"),
    domains: v.array(v.string()),
    g2Url: v.optional(v.string()),
    capterraUrl: v.optional(v.string()),
    matchConfidence: v.float64(),
    isVerified: v.boolean(),
    lastVerifiedAt: v.float64(),
  }).index("by_product", ["productId"]),

  // AF-05: AI Migration Roadmaps
  aiMigrationRoadmaps: defineTable({
    simulationId: v.optional(v.id("aiScenarioResults")),
    userId: v.optional(v.string()),
    fromProductId: v.id("novaProducts"),
    toProductId: v.id("novaProducts"),
    phases: v.array(v.any()),
    totalEstimatedDays: v.float64(),
    totalEstimatedHours: v.float64(),
    changeManagementNotes: v.optional(v.string()),
    rollbackPlan: v.optional(v.string()),
    trainingRecommendations: v.array(v.string()),
    generatedAt: v.float64(),
    modelVersion: v.optional(v.string()),
  }).index("by_simulation", ["simulationId"])
    .index("by_user", ["userId"])
    .index("by_products", ["fromProductId", "toProductId"]),
});
