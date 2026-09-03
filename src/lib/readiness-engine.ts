/**
 * Payment Readiness Engine for PaymentShield
 * Deterministic, explainable scoring and signal analysis for freelance payments.
 */

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
  category: "core" | "documentation" | "clarity";
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
  breakdown: {
    coreScore: number;
    coreMax: number;
    docScore: number;
    docMax: number;
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
    actionType: "docs" | "purpose" | "info";
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

  if (wordCount >= 4 && (hasMilestone || lower.includes(serviceSample.toLowerCase()) || lower.includes("website") || lower.includes("development") || lower.includes("design"))) {
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
  documents: DocumentState = {}
): ReadinessResult {
  const amountVal = parseAmount(payment.amount);
  const clientName = (payment.clientName || "").trim();
  const serviceType = (payment.serviceType || "").trim();
  const purpose = (payment.purpose || "").trim();
  const paymentType = (payment.paymentType || "").trim();
  const clientEmail = (payment.clientEmail || "").trim();
  const paymentDate = (payment.paymentDate || "").trim();

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

  // 2. Documentation (Max 40)
  let docScore = 0;
  const docMax = 40;

  if (hasInvoice) docScore += 15;
  if (hasSOW) docScore += 15;
  if (hasComm) docScore += 5;
  if (hasProofOfWork) docScore += 5;

  // 3. Clarity & Specificity (Max 20)
  let clarityScore = 0;
  const clarityMax = 20;

  if (paymentType) clarityScore += 5;

  const purposeAnalysis = analyzePurposeQuality(purpose, serviceType);
  if (purposeAnalysis.specificity === "strong") {
    clarityScore += 15;
  } else if (purposeAnalysis.specificity === "better") {
    clarityScore += 10;
  } else if (purposeAnalysis.specificity === "weak") {
    clarityScore += 4;
  } else {
    clarityScore += 0;
  }

  // Calculate total score bounded between 0 and 100
  const rawScore = coreScore + docScore + clarityScore;
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
      id: "purpose-specificity",
      title:
        purposeAnalysis.specificity === "strong"
          ? "Payment purpose is well-defined"
          : purposeAnalysis.specificity === "better"
          ? "Payment purpose reasonably clear"
          : "Payment purpose could be more specific",
      description:
        purposeAnalysis.specificity === "strong"
          ? "References deliverables and contractual agreement"
          : purposeAnalysis.recommendation,
      satisfied:
        purposeAnalysis.specificity === "strong" ||
        purposeAnalysis.specificity === "better",
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
      id: "docs-verification",
      title:
        hasComm && hasProofOfWork
          ? "Supporting evidence fully attached"
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

  // Purpose signal
  if (purposeAnalysis.specificity === "strong") {
    signals.push({
      id: "sig-purpose-strong",
      label: "Clear transaction purpose",
      detail: "Purpose clearly connects this payment to specific deliverables and signed terms.",
      level: "positive",
    });
  } else if (purposeAnalysis.specificity === "better") {
    signals.push({
      id: "sig-purpose-better",
      label: "Payment purpose clarity",
      detail: "Specific service identified, but milestone or contract reference could improve clarity.",
      level: "advisory",
    });
  } else {
    signals.push({
      id: "sig-purpose-weak",
      label: "Vague payment description",
      detail: "Generic purpose description may warrant additional preparation if reviewed.",
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

  // Prioritized actions & recommendations
  const prioritizedActions: Array<{
    priority: number;
    title: string;
    detail: string;
    actionType: "docs" | "purpose" | "info";
  }> = [];

  let pCount = 1;
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

  if (purposeAnalysis.specificity === "strong") {
    explanationParts.push(
      `The payment purpose is well-defined and clearly states milestone deliverables.`
    );
  } else {
    explanationParts.push(
      `Refining the payment purpose to explicitly mention agreed deliverables will eliminate ambiguity.`
    );
  }

  const aiExplanation = explanationParts.join(" ");

  return {
    score,
    level,
    levelColor,
    purposeSpecificity: purposeAnalysis.specificity,
    purposeFeedback: purposeAnalysis,
    breakdown: {
      coreScore,
      coreMax,
      docScore,
      docMax,
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
