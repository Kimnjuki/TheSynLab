// @ts-nocheck
/**
 * Helper to access Convex function references without triggering the
 * TS2589 "excessively deep" / TS2615 circularity errors that arise from
 * instantiating the full `internal` mapped type on very large schemas.
 */
import { internal } from "../../_generated/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const riskAnalyzerRef = (internal as any).ai.riskAnalyzer.analyzeProductRisk;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const anomalyDetectorRef = (internal as any).ai.anomalyDetector.persistAnomalyFlag;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const communityMinerRef = (internal as any).ai.communityMiner.insertCommunityInsight;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const labCoachRef = (internal as any).ai.labCoach.insertCoachAlert;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const playbookGeneratorRef = (internal as any).ai.playbookGenerator.insertPlaybook;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const workflowRecipesRef = (internal as any).ai.workflowRecipes.insertWorkflowRecipe;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupSummarizerGetPostRef = (internal as any).ai.setupSummarizer.getPost;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupSummarizerInsertRef = (internal as any).ai.setupSummarizer.insertSetupBlueprint;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const comparisonWriterFindRef = (internal as any).ai.comparisonWriter.findExistingNarrative;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const comparisonWriterUpsertRef = (internal as any).ai.comparisonWriter.upsertNarrative;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const integrationMapperFindRef = (internal as any).ai.integrationMapper.findExistingEdge;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const integrationMapperUpsertRef = (internal as any).ai.integrationMapper.upsertEdge;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const riskGetCurrentRef = (internal as any).ai.riskAnalyzer.getCurrentRiskAnalysis;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const riskArchiveRef = (internal as any).ai.riskAnalyzer.archiveCurrentAnalyses;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const riskInsertRef = (internal as any).ai.riskAnalyzer.insertRiskAnalysis;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reviewGetProductRef = (internal as any).ai.reviewDraftAssistant.getProduct;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reviewInsertDraftPostRef = (internal as any).ai.reviewDraftAssistant.insertDraftPost;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reviewInsertDraftRef = (internal as any).ai.reviewDraftAssistant.insertReviewDraft;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const schedulersListProductsRef = (internal as any).ai.schedulers.listActiveProductIds;