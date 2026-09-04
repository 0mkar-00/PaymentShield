/**
 * Payment Readiness Engine for PaymentShield
 * Deterministic, explainable scoring and signal analysis for freelance payments.
 */

import {
  evaluateConsistency,
  ConsistencyResult,
  DocumentMetadata,
} from "./consistency-engine";

export interface PaymentInput {
  clientName?: string;
  amount?: string | number;
  serviceType?: string;
  purpose?: string;
  paymentType?: string;
  clientEmail?: string;
  paymentDate?: string;
}

export interface DocumentRecord {
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  metadata?: DocumentMetadata;
}

export type DocumentState = Record<string, DocumentRecord>;

export type ReadinessLevel =
  | "Review Ready"
  | "Good — Minor Gaps"
  | "Needs Attention"
  | "High Attention";

export type PurposeSpecificity = "missing" | "weak" | "better" | "strong";

export interface ReadinessCheck {
  id: string;
  title: string;
  description: string;
  satisfied: boolean;
  category: "core" | "documentation" | "consistency" | "clarity";
}

export interface TransactionSignal {
  id: string;
  label: string;
  detail: string;
  level: "positive" | "advisory" | "attention";
}

export interface ReadinessResult {
  score: number; // 0 - 100
  level: ReadinessLevel;
  levelColor: {
    badgeBg: string;
    badgeText: string;
    dotBg: string;
    border: string;
    ringColor: string;
  };
  purposeSpecificity: PurposeSpecificity;
  purposeFeedback: {
    rating: string;
    explanation: string;
    recommendation: string;
    suggestedText: string;
  };
  consistencyResult: ConsistencyResult;
  breakdown: {
    coreScore: number;
    coreMax: number;
    docScore: number;
    docMax: number;
    consistencyScore: number;
    consistencyMax: number;
    clarityScore: number;
    clarityMax: number;
  };
  checks: ReadinessCheck[];
  satisfiedCount: number;
  attentionCount: number;
  signals: TransactionSignal[];
  recommendations: string[];
  prioritizedActions: Array<{
    priority: number;
    title: string;
    detail: string;
    actionType: "docs" | "purpose" | "consistency" | "info";
  }>;
  aiExplanation: string;
}

export function parseAmount(amount: string | number | undefined): number {
  if (typeof amount === "number") return amount;
  if (!amount) return 0;
  const cleaned = String(amount).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatCurrency(amount: string | number | undefined): string {
  const num = parseAmount(amount);
  if (num === 0) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
}

export function analyzePurposeQuality(
  purpose: string | undefined,
  serviceType: string = ""
): {
  specificity: PurposeSpecificity;
  rating: string;
  explanation: string;
  recommendation: string;
  suggestedText: string;
} {
  const text = (purpose || "").trim();
  const lower = text.toLowerCase();

  const serviceSample = serviceType || "Website Development";
  const suggestedText = `50% advance payment for ${serviceSample.toLowerCase()} as agreed in the signed SOW`;

  if (!text) {
    return {
      specificity: "missing",
      rating: "Missing Purpose",
      explanation: "No payment purpose has been entered yet.",
      recommendation: `Add a descriptive payment purpose referencing the agreed milestone or contract.`,
      suggestedText,
    };
  }

  const wordCount = text.split(/\s+/).length;

  const milestoneKeywords = [
    "advance",
    "milestone",
    "deposit",
    "phase",
    "final",
    "50%",
    "30%",
    "retainer",
  ];
  const referenceKeywords = [
    "sow",
    "contract",
    "agreement",
    "deliverable",
    "signed",
    "scope",
    "inv-",
    "invoice",
  ];

  const hasMilestone = milestoneKeywords.some((kw) => lower.includes(kw));
  const hasReference = referenceKeywords.some((kw) => lower.includes(kw));

  if (wordCount >= 6 && hasMilestone && hasReference) {
    return {
      specificity: "strong",
      rating: "Highly Specific",
      explanation: "Payment purpose provides concrete scope and formal agreement context.",
      recommendation: "Keep this descriptive wording in your invoicing and gateway payment links.",
      suggestedText: text,
    };
  }

  if (
    wordCount >= 4 &&
    (hasMilestone ||
      lower.includes(serviceSample.toLowerCase()) ||
      lower.includes("website") ||
      lower.includes("development") ||
      lower.includes("design"))
  ) {
    return {
      specificity: "better",
      rating: "Reasonably Specific",
      explanation: "Identifies the core service and payment stage, but could reference milestone or contract details.",
      recommendation: `Consider referencing the agreed milestone or contract (e.g., "${suggestedText}").`,
      suggestedText,
    };
  }

  return {
    specificity: "weak",
    rating: "Vague Purpose",
    explanation: "The description is brief and generic (e.g., 'payment for work').",
    recommendation: `Upgrade description to specify the deliverable and agreed terms (e.g., "${suggestedText}").`,
    suggestedText,
  };
}

export function calculateReadiness(
  payment: PaymentInput,
  documents: DocumentState = {},
  simulateMismatch: boolean = false
): ReadinessResult {
  const amountVal = parseAmount(payment.amount);
  const clientName = (payment.clientName || "").trim();
  const serviceType = (payment.serviceType || "").trim();
  const purpose = (payment.purpose || "").trim();
  const paymentType = (payment.paymentType || "").trim();
  const clientEmail = (payment.clientEmail || "").trim();
  const paymentDate = (payment.paymentDate || "").trim();

  // Run consistency engine
  const consistencyResult = evaluateConsistency(payment, documents, simulateMismatch);

  // Document existence flags
  const hasInvoice = !!documents["invoice"]?.fileName;
  const hasSOW = !!documents["sow_contract"]?.fileName;
  const hasComm = !!documents["client_comm"]?.fileName;
  const hasProofOfWork = !!documents["proof_of_work"]?.fileName;

  // 1. Core Payment Information (Max 40)
  let coreScore = 0;
  const coreMax = 40;

  if (clientName) coreScore += 10;
  if (amountVal > 0) coreScore += 10;
  if (serviceType) coreScore += 10;
  if (clientEmail) coreScore += 5;
  if (paymentDate) coreScore += 5;

  // 2. Documentation Completeness (Max 30)
  let docScore = 0;
  const docMax = 30;

  if (hasInvoice) docScore += 11;
  if (hasSOW) docScore += 11;
  if (hasComm) docScore += 4;
  if (hasProofOfWork) docScore += 4;

  // 3. Consistency (Max 15)
  const consistencyMax = 15;
  let consistencyScore = 0;
  if (hasInvoice || hasSOW) {
    consistencyScore = Math.round((consistencyResult.score / 100) * consistencyMax);
  } else {
    consistencyScore = 0;
  }

  // 4. Clarity & Specificity (Max 15)
  let clarityScore = 0;
  const clarityMax = 15;

  if (paymentType) clarityScore += 3;

  const purposeAnalysis = analyzePurposeQuality(purpose, serviceType);
  if (purposeAnalysis.specificity === "strong") {
    clarityScore += 12;
  } else if (purposeAnalysis.specificity === "better") {
    clarityScore += 8;
  } else if (purposeAnalysis.specificity === "weak") {
    clarityScore += 3;
  } else {
    clarityScore += 0;
  }

  // Calculate total score bounded between 0 and 100
  const rawScore = coreScore + docScore + consistencyScore + clarityScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Determine readiness level
  let level: ReadinessLevel = "Needs Attention";
  let levelColor = {
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    dotBg: "bg-amber-500",
    border: "border-amber-200/60",
    ringColor: "#d97706",
  };

  if (score >= 90) {
    level = "Review Ready";
    levelColor = {
      badgeBg: "bg-green-50",
      badgeText: "text-green-700",
      dotBg: "bg-green-500",
      border: "border-green-200/60",
      ringColor: "#16a34a",
    };
  } else if (score >= 75) {
    level = "Good — Minor Gaps";
    levelColor = {
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-700",
      dotBg: "bg-blue-600",
      border: "border-blue-200/60",
      ringColor: "#2563eb",
    };
  } else if (score >= 50) {
    level = "Needs Attention";
    levelColor = {
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      dotBg: "bg-amber-500",
      border: "border-amber-200/60",
      ringColor: "#d97706",
    };
  } else {
    level = "High Attention";
    levelColor = {
      badgeBg: "bg-red-50",
      badgeText: "text-red-700",
      dotBg: "bg-red-600",
      border: "border-red-200/60",
      ringColor: "#dc2626",
    };
  }

  // Generate dynamic checklist
  const checks: ReadinessCheck[] = [
    {
      id: "client-id",
      title: clientName ? "Client identified" : "Client name missing",
      description: clientName
        ? `Identified entity: ${clientName}`
        : "Add the legal or registered client/company name",
      satisfied: !!clientName,
      category: "core",
    },
    {
      id: "amount-rec",
      title: amountVal > 0 ? "Payment amount recorded" : "Payment amount missing",
      description: amountVal > 0
        ? `Documented amount: ${formatCurrency(amountVal)}`
        : "Specify the exact agreed payment amount",
      satisfied: amountVal > 0,
      category: "core",
    },
    {
      id: "service-spec",
      title: serviceType ? "Service description provided" : "Service type missing",
      description: serviceType
        ? `Categorized under: ${serviceType}`
        : "Select the primary freelance service domain",
      satisfied: !!serviceType,
      category: "core",
    },
    {
      id: "purpose-provided",
      title: purpose ? "Payment purpose provided" : "Payment purpose missing",
      description: purpose
        ? purposeAnalysis.explanation
        : "Add a clear rationale for the transfer",
      satisfied: !!purpose && purposeAnalysis.specificity !== "missing",
      category: "clarity",
    },
    {
      id: "docs-invoice-sow",
      title:
        hasInvoice && hasSOW
          ? "Primary agreements uploaded"
          : hasInvoice || hasSOW
          ? "Core agreement partially uploaded"
          : "Supporting documentation not uploaded",
      description:
        hasInvoice && hasSOW
          ? "Both invoice and signed SOW/contract are attached"
          : hasInvoice
          ? "Invoice attached; signed SOW/contract recommended"
          : hasSOW
          ? "SOW attached; formal invoice recommended"
          : "No invoice or signed SOW attached yet",
      satisfied: hasInvoice && hasSOW,
      category: "documentation",
    },
    {
      id: "consistency-check",
      title:
        consistencyResult.status === "Consistent"
          ? "Invoice & contract details consistent"
          : consistencyResult.status === "Minor Mismatch"
          ? "Minor wording mismatch in supporting records"
          : consistencyResult.status === "Significant Mismatch"
          ? "Significant mismatch between payment & invoice"
          : "Consistency check pending documents",
      description:
        consistencyResult.status === "Consistent"
          ? "Payment figures and client name agree across available records"
          : consistencyResult.summary,
      satisfied:
        consistencyResult.status === "Consistent" ||
        (hasInvoice && hasSOW && consistencyResult.mismatchCount === 0),
      category: "consistency",
    },
    {
      id: "docs-verification",
      title:
        hasComm && hasProofOfWork
          ? "Supplemental records attached"
          : hasComm || hasProofOfWork
          ? "Supplemental evidence partially attached"
          : "Supplemental records not uploaded",
      description:
        hasComm && hasProofOfWork
          ? "Client communication and proof-of-work available"
          : "Client email confirmations or work samples reinforce readiness",
      satisfied: hasComm && hasProofOfWork,
      category: "documentation",
    },
  ];

  const satisfiedCount = checks.filter((c) => c.satisfied).length;
  const attentionCount = checks.filter((c) => !c.satisfied).length;

  // Transaction signals
  const signals: TransactionSignal[] = [];

  // High-value signal
  if (amountVal >= 100000) {
    signals.push({
      id: "sig-high-value",
      label: "Higher-value transaction",
      detail: `${formatCurrency(amountVal)} is a significant transaction amount. Higher-value transactions may warrant additional preparation.`,
      level: "attention",
    });
  } else if (amountVal > 0) {
    signals.push({
      id: "sig-standard-value",
      label: "Standard transaction amount",
      detail: `${formatCurrency(amountVal)} falls within standard freelance milestone ranges.`,
      level: "positive",
    });
  }

  // Consistency signal
  if (consistencyResult.status === "Consistent") {
    signals.push({
      id: "sig-consistency-pass",
      label: "Record alignment verified",
      detail: "Transaction details agree with the attached invoice and contract metadata.",
      level: "positive",
    });
  } else if (consistencyResult.status === "Minor Mismatch") {
    signals.push({
      id: "sig-consistency-warn",
      label: "Record phrasing mismatch",
      detail: "Minor description difference detected between payment details and invoice/SOW.",
      level: "advisory",
    });
  } else if (consistencyResult.status === "Significant Mismatch") {
    signals.push({
      id: "sig-consistency-mismatch",
      label: "Contradiction in records",
      detail: "Important details (such as amount or client name) disagree between payment details and supporting documents.",
      level: "attention",
    });
  }

  // Documentation signal
  const docNames = [];
  if (hasInvoice) docNames.push("Invoice");
  if (hasSOW) docNames.push("SOW/Contract");
  if (hasComm) docNames.push("Client Comm");
  if (hasProofOfWork) docNames.push("Proof of Work");

  if (docNames.length === 4) {
    signals.push({
      id: "sig-docs-complete",
      label: "Comprehensive documentation",
      detail: "All 4 supporting document categories are indexed and ready for verification.",
      level: "positive",
    });
  } else if (docNames.length >= 2) {
    const missing: string[] = [];
    if (!hasComm) missing.push("client communication");
    if (!hasProofOfWork) missing.push("proof-of-work");
    signals.push({
      id: "sig-docs-partial",
      label: "Documentation coverage",
      detail: `${docNames.join(" and ")} available; ${missing.join(" and ")} are still missing.`,
      level: "advisory",
    });
  } else {
    signals.push({
      id: "sig-docs-missing",
      label: "Missing supporting documentation",
      detail: "Supporting documentation incomplete; uploading an invoice and signed contract is recommended.",
      level: "attention",
    });
  }

  // Prioritized actions
  const prioritizedActions: Array<{
    priority: number;
    title: string;
    detail: string;
    actionType: "docs" | "purpose" | "consistency" | "info";
  }> = [];

  let pCount = 1;

  // If there is a consistency mismatch, prioritize it!
  if (consistencyResult.mismatchCount > 0) {
    const firstMismatch = consistencyResult.checks.find((c) => c.status === "mismatch");
    prioritizedActions.push({
      priority: pCount++,
      title: `Align ${firstMismatch?.fieldName || "inconsistent fields"} between payment and invoice`,
      detail: firstMismatch?.explanation || "Ensure payment details agree with attached document figures.",
      actionType: "consistency",
    });
  }

  if (!hasInvoice || !hasSOW) {
    prioritizedActions.push({
      priority: pCount++,
      title: "Upload invoice and signed SOW/contract",
      detail: "Having formal signed agreements ready substantiates the legitimacy of the payment terms.",
      actionType: "docs",
    });
  }

  if (purposeAnalysis.specificity !== "strong") {
    prioritizedActions.push({
      priority: pCount++,
      title: "Make the payment purpose more specific",
      detail: `Include milestone deliverables or reference agreement numbers (e.g. "${purposeAnalysis.suggestedText}").`,
      actionType: "purpose",
    });
  }

  if (!hasComm || !hasProofOfWork) {
    prioritizedActions.push({
      priority: pCount++,
      title: "Keep client communication and proof-of-work records available",
      detail: "Maintain email threads, chat approvals, or deliverable links for quick turnaround if asked.",
      actionType: "docs",
    });
  }

  if (!clientEmail) {
    prioritizedActions.push({
      priority: pCount++,
      title: "Record client finance contact email",
      detail: "Having verified corporate contact information accelerates verification if inquiries arise.",
      actionType: "info",
    });
  }

  const recommendations = prioritizedActions.map((a) => a.title);

  // Dynamic AI Explanation
  const explanationParts: string[] = [];
  explanationParts.push(
    `PaymentShield evaluated this transaction for ${clientName || "the client"}${
      serviceType ? ` for ${serviceType}` : ""
    } (${formatCurrency(amountVal)}).`
  );

  if (amountVal >= 100000) {
    explanationParts.push(
      `Because this is a higher-value payment, keeping supporting evidence organized is recommended.`
    );
  }

  if (consistencyResult.status === "Significant Mismatch") {
    explanationParts.push(
      `A notable mismatch was detected between the payment details and supporting document records. Resolving this discrepancy will significantly reduce verification delays.`
    );
  } else if (consistencyResult.status === "Minor Mismatch") {
    explanationParts.push(
      `Minor wording differences exist between your payment description and invoice, though core figures align.`
    );
  } else if (consistencyResult.status === "Consistent") {
    explanationParts.push(
      `The payment information is consistent across the available invoice and contract records.`
    );
  }

  if (docNames.length === 4) {
    explanationParts.push(
      `Documentation is comprehensive with all supporting records attached, providing high confidence for review preparation.`
    );
  } else if (docNames.length > 0) {
    const missingDocs: string[] = [];
    if (!hasInvoice) missingDocs.push("invoice");
    if (!hasSOW) missingDocs.push("SOW/contract");
    if (!hasComm) missingDocs.push("client communication");
    if (!hasProofOfWork) missingDocs.push("proof-of-work");
    explanationParts.push(
      `The current documentation is partially ready (${docNames.join(", ")} attached), while ${missingDocs.join(" and ")} remain unattached.`
    );
  } else {
    explanationParts.push(
      `No supporting documentation has been attached yet. Preparing an invoice and signed SOW will significantly improve review readiness.`
    );
  }

  const aiExplanation = explanationParts.join(" ");

  return {
    score,
    level,
    levelColor,
    purposeSpecificity: purposeAnalysis.specificity,
    purposeFeedback: purposeAnalysis,
    consistencyResult,
    breakdown: {
      coreScore,
      coreMax,
      docScore,
      docMax,
      consistencyScore,
      consistencyMax,
      clarityScore,
      clarityMax,
    },
    checks,
    satisfiedCount,
    attentionCount,
    signals,
    recommendations,
    prioritizedActions,
    aiExplanation,
  };
}
