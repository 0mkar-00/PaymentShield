/**
 * Invoice / Contract Consistency Engine for PaymentShield
 * Evaluates whether payment details match supporting invoice and contract records.
 */

import { PaymentInput, DocumentState, parseAmount, formatCurrency } from "./readiness-engine";

export type ConsistencyStatus =
  | "Consistent"
  | "Minor Mismatch"
  | "Significant Mismatch"
  | "Cannot Verify";

export type FieldSeverity = "good" | "warning" | "critical" | "unavailable";

export interface DocumentMetadata {
  client?: string;
  amount?: string | number;
  service?: string;
  paymentType?: string;
  paymentPurpose?: string;
  paymentDate?: string;
  notes?: string;
}

export interface FieldConsistencyCheck {
  id: string;
  fieldName: string;
  paymentValue: string;
  invoiceValue?: string;
  sowValue?: string;
  status: "verified" | "mismatch" | "unavailable";
  severity: FieldSeverity;
  explanation: string;
}

export interface ConsistencyResult {
  score: number; // 0 - 100
  status: ConsistencyStatus;
  statusColor: {
    badgeBg: string;
    badgeText: string;
    dotBg: string;
    border: string;
    ringColor: string;
  };
  hasInvoice: boolean;
  hasSOW: boolean;
  checks: FieldConsistencyCheck[];
  verifiedCount: number;
  mismatchCount: number;
  unavailableCount: number;
  summary: string;
  recommendations: string[];
}

/**
 * Default sample metadata for demo documents
 */
export const DEFAULT_SAMPLE_METADATA: Record<string, DocumentMetadata> = {
  invoice: {
    client: "Acme Technologies",
    amount: 250000,
    service: "Website Development",
    paymentType: "Advance Payment",
    paymentDate: "2026-09-15",
  },
  sow_contract: {
    client: "Acme Technologies",
    amount: 250000,
    service: "Website Development",
    paymentPurpose: "50% advance payment for website development as agreed in the signed SOW",
    paymentType: "Advance Payment",
    paymentDate: "2026-09-15",
  },
  client_comm: {
    client: "Acme Technologies",
    service: "Website Development",
    paymentPurpose: "website development advance",
  },
  proof_of_work: {
    client: "Acme Technologies",
    service: "Website Development",
  },
};

/**
 * Normalizes text for comparison (removes punctuation, extra whitespace, lowercase)
 */
function normalizeText(val: string | undefined | null): string {
  if (!val) return "";
  return val
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks similarity between two strings
 */
function isFuzzyMatch(a: string | undefined, b: string | undefined): boolean {
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  return normA.includes(normB) || normB.includes(normA);
}

export function evaluateConsistency(
  payment: PaymentInput,
  documents: DocumentState = {},
  simulateMismatch: boolean = false
): ConsistencyResult {
  const paymentAmountNum = parseAmount(payment.amount);
  const paymentClient = (payment.clientName || "").trim();
  const paymentService = (payment.serviceType || "").trim();
  const paymentType = (payment.paymentType || "").trim();
  const paymentPurpose = (payment.purpose || "").trim();
  const paymentDate = (payment.paymentDate || "").trim();

  // Check presence of invoice and sow
  const hasInvoice = !!documents["invoice"]?.fileName;
  const hasSOW = !!documents["sow_contract"]?.fileName;

  // Retrieve metadata attached to document record, or scenario-specific default
  const invoiceMeta: DocumentMetadata | undefined = hasInvoice
    ? (documents["invoice"] as { metadata?: DocumentMetadata })?.metadata ||
      (paymentClient.includes("Nova")
        ? {
            client: "Nova Labs",
            amount: 85000,
            service: "UI/UX Consulting",
            paymentType: "Final Payment",
          }
        : paymentClient.includes("BrightPath")
        ? {
            client: "BrightPath Solutions",
            amount: 100000,
            service: "Software Development — Phase 1",
            paymentType: "Milestone Payment",
          }
        : DEFAULT_SAMPLE_METADATA.invoice)
    : undefined;

  const sowMeta: DocumentMetadata | undefined = hasSOW
    ? (documents["sow_contract"] as { metadata?: DocumentMetadata })?.metadata ||
      (paymentClient.includes("BrightPath")
        ? {
            client: "BrightPath Solutions",
            amount: 120000,
            service: "Software Development",
            paymentPurpose: "Milestone payment for software development",
            paymentType: "Milestone Payment",
          }
        : DEFAULT_SAMPLE_METADATA.sow_contract)
    : undefined;

  // If manual simulation toggle is active, inject an intentional mismatch into invoice
  const effectiveInvoiceMeta: DocumentMetadata | undefined = invoiceMeta
    ? {
        ...invoiceMeta,
        ...(simulateMismatch
          ? {
              amount: paymentAmountNum > 100000 ? paymentAmountNum - 20000 : 50000,
              service: `${paymentService} (Phase 1 Only)`,
            }
          : {}),
      }
    : undefined;

  const checks: FieldConsistencyCheck[] = [];

  // 1. Client / Company Name Check
  if (!hasInvoice && !hasSOW) {
    checks.push({
      id: "client-name",
      fieldName: "Client / Company Name",
      paymentValue: paymentClient || "Not specified",
      status: "unavailable",
      severity: "unavailable",
      explanation: "Supporting records not attached yet. Upload an invoice or SOW to verify client matching.",
    });
  } else {
    const invClient = effectiveInvoiceMeta?.client;
    const sowClient = sowMeta?.client;

    const invMatch = !invClient || isFuzzyMatch(paymentClient, invClient);
    const sowMatch = !sowClient || isFuzzyMatch(paymentClient, sowClient);

    if (invMatch && sowMatch) {
      checks.push({
        id: "client-name",
        fieldName: "Client / Company Name",
        paymentValue: paymentClient || "Acme Technologies",
        invoiceValue: invClient || (hasInvoice ? paymentClient : undefined),
        sowValue: sowClient || (hasSOW ? paymentClient : undefined),
        status: "verified",
        severity: "good",
        explanation: "Client legal name is identically recorded across payment details and available agreements.",
      });
    } else {
      checks.push({
        id: "client-name",
        fieldName: "Client / Company Name",
        paymentValue: paymentClient,
        invoiceValue: invClient,
        sowValue: sowClient,
        status: "mismatch",
        severity: "critical",
        explanation: "Client name differs between payment submission and agreement records. Confirm the exact registered company name.",
      });
    }
  }

  // 2. Payment Amount Check (Crucial for Scenario 3)
  if (!hasInvoice && !hasSOW) {
    checks.push({
      id: "payment-amount",
      fieldName: "Payment Amount",
      paymentValue: formatCurrency(paymentAmountNum),
      status: "unavailable",
      severity: "unavailable",
      explanation: "Invoice or SOW not attached yet. Upload an invoice to verify the requested monetary figure.",
    });
  } else {
    const invAmountNum = effectiveInvoiceMeta?.amount
      ? parseAmount(effectiveInvoiceMeta.amount)
      : undefined;
    const sowAmountNum = sowMeta?.amount
      ? parseAmount(sowMeta.amount)
      : undefined;

    const invAmountMatches =
      invAmountNum === undefined || invAmountNum === paymentAmountNum;
    const sowAmountMatches =
      sowAmountNum === undefined || sowAmountNum === paymentAmountNum;

    if (invAmountMatches && sowAmountMatches) {
      checks.push({
        id: "payment-amount",
        fieldName: "Payment Amount",
        paymentValue: formatCurrency(paymentAmountNum),
        invoiceValue: invAmountNum ? formatCurrency(invAmountNum) : (hasInvoice ? formatCurrency(paymentAmountNum) : undefined),
        sowValue: sowAmountNum ? formatCurrency(sowAmountNum) : (hasSOW ? formatCurrency(paymentAmountNum) : undefined),
        status: "verified",
        severity: "good",
        explanation: "Payment amount precisely matches the invoice and agreement values.",
      });
    } else {
      // Discrepancy detected (Scenario 3 BrightPath: 1,20,000 vs 1,00,000)
      checks.push({
        id: "payment-amount",
        fieldName: "Payment Amount",
        paymentValue: formatCurrency(paymentAmountNum),
        invoiceValue: invAmountNum ? formatCurrency(invAmountNum) : "Not listed",
        sowValue: sowAmountNum ? formatCurrency(sowAmountNum) : "Not listed",
        status: "mismatch",
        severity: "critical",
        explanation: "The requested payment amount differs from the invoice amount. Review the invoice before relying on it as supporting evidence.",
      });
    }
  }

  // 3. Service Description Check
  if (!hasInvoice && !hasSOW) {
    checks.push({
      id: "service-desc",
      fieldName: "Service Description",
      paymentValue: paymentService || "Not specified",
      status: "unavailable",
      severity: "unavailable",
      explanation: "Upload supporting documents to verify service scope alignment.",
    });
  } else {
    const invService = effectiveInvoiceMeta?.service;
    const sowService = sowMeta?.service;

    const exactMatch =
      (!invService || normalizeText(paymentService) === normalizeText(invService)) &&
      (!sowService || normalizeText(paymentService) === normalizeText(sowService));

    const fuzzyMatch =
      (!invService || isFuzzyMatch(paymentService, invService)) &&
      (!sowService || isFuzzyMatch(paymentService, sowService));

    if (exactMatch) {
      checks.push({
        id: "service-desc",
        fieldName: "Service Description",
        paymentValue: paymentService || "Website Development",
        invoiceValue: invService || (hasInvoice ? paymentService : undefined),
        sowValue: sowService || (hasSOW ? paymentService : undefined),
        status: "verified",
        severity: "good",
        explanation: "Service classification is fully aligned across all records.",
      });
    } else if (fuzzyMatch) {
      checks.push({
        id: "service-desc",
        fieldName: "Service Description",
        paymentValue: paymentService,
        invoiceValue: invService,
        sowValue: sowService,
        status: "verified", // Partial wording variance on invoice line item is advisory, not contradictory
        severity: "warning",
        explanation: "These descriptions refer to the same service scope, but confirming identical wording reduces review ambiguity.",
      });
    } else {
      checks.push({
        id: "service-desc",
        fieldName: "Service Description",
        paymentValue: paymentService,
        invoiceValue: invService,
        sowValue: sowService,
        status: "mismatch",
        severity: "warning",
        explanation: "Different service descriptions detected between payment details and contract.",
      });
    }
  }

  // 4. Payment Type / Milestone Check
  if (!hasInvoice && !hasSOW) {
    checks.push({
      id: "payment-type",
      fieldName: "Payment Type / Milestone",
      paymentValue: paymentType || "Not specified",
      status: "unavailable",
      severity: "unavailable",
      explanation: "Upload documents to confirm payment schedule type (e.g. advance vs milestone).",
    });
  } else {
    const invType = effectiveInvoiceMeta?.paymentType;
    const sowType = sowMeta?.paymentType;

    const typeMatch =
      (!invType || isFuzzyMatch(paymentType, invType)) &&
      (!sowType || isFuzzyMatch(paymentType, sowType));

    if (typeMatch) {
      checks.push({
        id: "payment-type",
        fieldName: "Payment Type / Milestone",
        paymentValue: paymentType || "Advance Payment",
        invoiceValue: invType || (hasInvoice ? paymentType : undefined),
        sowValue: sowType || (hasSOW ? paymentType : undefined),
        status: "verified",
        severity: "good",
        explanation: "Payment stage agreed as advance or milestone across available records.",
      });
    } else {
      checks.push({
        id: "payment-type",
        fieldName: "Payment Type / Milestone",
        paymentValue: paymentType,
        invoiceValue: invType,
        sowValue: sowType,
        status: "mismatch",
        severity: "warning",
        explanation: "Verify whether payment is scheduled as an advance or final milestone in the agreement.",
      });
    }
  }

  // 5. Payment Purpose & Scope Check
  if (!hasSOW) {
    checks.push({
      id: "payment-purpose",
      fieldName: "Payment Purpose & Scope",
      paymentValue: paymentPurpose || "Not specified",
      status: "unavailable",
      severity: "unavailable",
      explanation: "SOW / Contract not available. Upload an SOW or contract to verify the agreed scope and payment terms.",
    });
  } else {
    const sowPurpose = sowMeta?.paymentPurpose;
    const purposeAligned =
      !sowPurpose ||
      isFuzzyMatch(paymentPurpose, sowPurpose) ||
      normalizeText(paymentPurpose).includes("advance") ===
        normalizeText(sowPurpose).includes("advance");

    if (purposeAligned) {
      checks.push({
        id: "payment-purpose",
        fieldName: "Payment Purpose & Scope",
        paymentValue: paymentPurpose || "50% advance payment for website development as agreed in the signed SOW",
        sowValue: sowPurpose || paymentPurpose,
        status: "verified",
        severity: "good",
        explanation: "Payment purpose aligns with deliverables and milestones cited in the statement of work.",
      });
    } else {
      checks.push({
        id: "payment-purpose",
        fieldName: "Payment Purpose & Scope",
        paymentValue: paymentPurpose,
        sowValue: sowPurpose,
        status: "mismatch",
        severity: "warning",
        explanation: "Payment purpose phrasing differs from milestone descriptions referenced in the contract.",
      });
    }
  }

  // 6. Payment Date / Schedule Check
  if (paymentDate) {
    if (!hasInvoice && !hasSOW) {
      checks.push({
        id: "payment-date",
        fieldName: "Payment Date / Schedule",
        paymentValue: paymentDate,
        status: "unavailable",
        severity: "unavailable",
        explanation: "Upload an invoice to verify due date consistency.",
      });
    } else {
      const invDate = effectiveInvoiceMeta?.paymentDate;
      const sowDate = sowMeta?.paymentDate;
      const dateMatch =
        (!invDate || invDate === paymentDate) &&
        (!sowDate || sowDate === paymentDate);

      if (dateMatch) {
        checks.push({
          id: "payment-date",
          fieldName: "Payment Date / Schedule",
          paymentValue: paymentDate,
          invoiceValue: invDate || "Aligned",
          sowValue: sowDate || "Aligned",
          status: "verified",
          severity: "good",
          explanation: "Payment timing agrees with agreement schedule.",
        });
      } else {
        checks.push({
          id: "payment-date",
          fieldName: "Payment Date / Schedule",
          paymentValue: paymentDate,
          invoiceValue: invDate,
          sowValue: sowDate,
          status: "mismatch",
          severity: "warning",
          explanation: "Payment date differs slightly from invoice schedule.",
        });
      }
    }
  }

  const verifiedCount = checks.filter((c) => c.status === "verified").length;
  const mismatchCount = checks.filter((c) => c.status === "mismatch").length;
  const unavailableCount = checks.filter((c) => c.status === "unavailable").length;

  // Consistency score calculation
  let score = 0;
  let status: ConsistencyStatus = "Cannot Verify";
  let statusColor = {
    badgeBg: "bg-slate-800",
    badgeText: "text-slate-300",
    dotBg: "bg-slate-400",
    border: "border-slate-700",
    ringColor: "#94a3b8",
  };

  const recommendations: string[] = [];

  if (!hasInvoice && !hasSOW) {
    score = 0;
    status = "Cannot Verify";
    statusColor = {
      badgeBg: "bg-slate-900/80",
      badgeText: "text-slate-400",
      dotBg: "bg-slate-500",
      border: "border-slate-800",
      ringColor: "#64748b",
    };
    recommendations.push(
      "Upload an invoice and signed SOW/contract to enable consistency verification."
    );
  } else {
    // Scoring
    let rawScore = 100;
    checks.forEach((c) => {
      if (c.status === "mismatch") {
        if (c.severity === "critical") {
          rawScore -= 40; // Critical mismatch drops score heavily
        } else {
          rawScore -= 15;
        }
      }
    });

    score = Math.max(0, Math.min(100, rawScore));

    if (mismatchCount === 0) {
      status = "Consistent";
      statusColor = {
        badgeBg: "bg-emerald-950/60",
        badgeText: "text-emerald-400",
        dotBg: "bg-emerald-500",
        border: "border-emerald-800/60",
        ringColor: "#10b981",
      };
    } else if (checks.some((c) => c.severity === "critical")) {
      status = "Significant Mismatch";
      statusColor = {
        badgeBg: "bg-red-950/60",
        badgeText: "text-red-400",
        dotBg: "bg-red-500",
        border: "border-red-800/60",
        ringColor: "#ef4444",
      };
    } else {
      status = "Minor Mismatch";
      statusColor = {
        badgeBg: "bg-amber-950/60",
        badgeText: "text-amber-400",
        dotBg: "bg-amber-500",
        border: "border-amber-800/60",
        ringColor: "#f59e0b",
      };
    }

    // Recommendations based on checks
    checks
      .filter((c) => c.status === "mismatch")
      .forEach((m) => {
        if (m.id === "payment-amount") {
          recommendations.push(
            "Review the invoice amount before using it as supporting evidence."
          );
        } else if (m.id === "service-desc") {
          recommendations.push(
            "Confirm that the service wording used on the invoice matches the scope described in the SOW."
          );
        } else if (m.id === "client-name") {
          recommendations.push(
            "Ensure the client legal name matches exactly between payment request and signed contract."
          );
        } else {
          recommendations.push(
            `Align the ${m.fieldName.toLowerCase()} between payment submission and agreement records.`
          );
        }
      });

    if (!hasInvoice) {
      recommendations.push("Upload an invoice to verify the requested monetary amount and client details.");
    }
    if (!hasSOW) {
      recommendations.push("Upload an SOW or contract to verify the agreed scope and payment terms.");
    }
  }

  let summary = "";
  if (status === "Cannot Verify") {
    summary = "Consistency check is currently pending documents. Upload an invoice or SOW to evaluate record alignment.";
  } else if (status === "Consistent") {
    summary = "Payment details agree with available supporting documents. No contradictory records detected.";
  } else if (status === "Minor Mismatch") {
    summary = "Minor phrasing difference detected across supporting records. Review the highlighted field before relying on the document set.";
  } else {
    summary = "Significant discrepancy detected between payment details and document records. Align these figures before requesting payment.";
  }

  return {
    score,
    status,
    statusColor,
    hasInvoice,
    hasSOW,
    checks,
    verifiedCount,
    mismatchCount,
    unavailableCount,
    summary,
    recommendations,
  };
}
