import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    adId: v.id("adSubmissions"),
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
    hub: v.string(), // ai_workflow, intelligent_home, hybrid_office
    price: v.optional(v.number()),
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
    officialWebsite: v.optional(v.string()),
    documentationUrl: v.optional(v.string()),
    supportUrl: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
    dataHash: v.optional(v.string()),
  }).index("by_slug", ["productSlug"])
    .index("by_hub", ["hub"])
    .index("by_category", ["category"])
    .index("by_status", ["status"]),

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
    readingTimeMinutes: v.optional(v.number()),
    viewCount: v.number(),
    uniqueViewCount: v.number(),
    lastViewedAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    lastModifiedBy: v.optional(v.string()),
  }).index("by_slug", ["postSlug"])
    .index("by_author", ["authorId"])
    .index("by_status", ["postStatus"])
    .index("by_hub", ["hub"]),

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
  }).index("by_link", ["linkId"])
    .index("by_user", ["userId"]),

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
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    verifiedPurchase: v.boolean(),
    helpfulCount: v.number(),
  }).index("by_product", ["productId"])
    .index("by_user", ["userId"]),

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
  }).index("by_thread", ["threadId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentReplyId"]),

  forumThreadLikes: defineTable({
    threadId: v.id("forumThreads"),
    userId: v.string(),
  }).index("by_thread", ["threadId"])
    .index("by_user", ["userId"]),
});
