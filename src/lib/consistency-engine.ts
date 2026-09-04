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
    paymentPurpose: "50% advance payment for website development",
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

  // Retrieve or associate metadata
  const invoiceMeta: DocumentMetadata | undefined = hasInvoice
    ? (documents["invoice"] as { metadata?: DocumentMetadata })?.metadata ||
      DEFAULT_SAMPLE_METADATA.invoice
    : undefined;

  const sowMeta: DocumentMetadata | undefined = hasSOW
    ? (documents["sow_contract"] as { metadata?: DocumentMetadata })?.metadata ||
      DEFAULT_SAMPLE_METADATA.sow_contract
    : undefined;

  // If simulation is active, inject an intentional mismatch into invoice
  const effectiveInvoiceMeta: DocumentMetadata | undefined = invoiceMeta
    ? {
        ...invoiceMeta,
        ...(simulateMismatch
          ? {
              amount: 200000, // Mismatch: ₹2,00,000 vs payment's ₹2,50,000
              service: "Web Development (Phase 1 Only)", // Minor wording difference
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
      explanation: "Upload an invoice or SOW to verify client entity matching.",
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
        invoiceValue: invClient || "Not provided",
        sowValue: sowClient || "Not provided",
        status: "verified",
        severity: "good",
        explanation: "Client name is identically recorded across payment details and agreements.",
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
        explanation: "Client name differs between payment submission and agreement records.",
      });
    }
  }

  // 2. Payment Amount Check
  if (!hasInvoice && !hasSOW) {
    checks.push({
      id: "payment-amount",
      fieldName: "Payment Amount",
      paymentValue: formatCurrency(paymentAmountNum),
      status: "unavailable",
      severity: "unavailable",
      explanation: "Upload an invoice to verify the requested monetary amount.",
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
        invoiceValue: invAmountNum ? formatCurrency(invAmountNum) : "Not listed",
        sowValue: sowAmountNum ? formatCurrency(sowAmountNum) : "Not listed",
        status: "verified",
        severity: "good",
        explanation: "Payment amount precisely matches the invoice and agreement values.",
      });
    } else {
      checks.push({
        id: "payment-amount",
        fieldName: "Payment Amount",
        paymentValue: formatCurrency(paymentAmountNum),
        invoiceValue: invAmountNum ? formatCurrency(invAmountNum) : "Not listed",
        sowValue: sowAmountNum ? formatCurrency(sowAmountNum) : "Not listed",
        status: "mismatch",
        severity: "critical",
        explanation: `Amount discrepancy detected (${formatCurrency(paymentAmountNum)} requested vs ${formatCurrency(invAmountNum)} on invoice). Review the invoice amount before using it as supporting evidence.`,
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
      explanation: "Upload supporting documents to verify scope alignment.",
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
        invoiceValue: invService || "Not listed",
        sowValue: sowService || "Not listed",
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
        status: "mismatch",
        severity: "warning",
        explanation: "These descriptions may refer to the same work, but confirming consistent wording can reduce ambiguity during review.",
      });
    } else {
      checks.push({
        id: "service-desc",
        fieldName: "Service Description",
        paymentValue: paymentService,
        invoiceValue: invService,
        sowValue: sowService,
        status: "mismatch",
        severity: "critical",
        explanation: "Different service descriptions detected between payment details and contract.",
      });
    }
  }

  // 4. Payment Type Check
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
        invoiceValue: invType || "Not specified",
        sowValue: sowType || "Not specified",
        status: "verified",
        severity: "good",
        explanation: "Payment stage agreed as advance/milestone across records.",
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
        explanation: "Verify whether payment is defined as advance or final milestone in the agreement.",
      });
    }
  }

  // 5. Payment Purpose & Milestone Clarity
  if (!hasSOW) {
    checks.push({
      id: "payment-purpose",
      fieldName: "Payment Purpose & Scope",
      paymentValue: paymentPurpose || "Not specified",
      status: "unavailable",
      severity: "unavailable",
      explanation: "Upload an SOW or contract to verify the agreed scope and payment terms.",
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
        paymentValue: paymentPurpose || "50% advance payment for website development",
        sowValue: sowPurpose || "Consistent milestone defined",
        status: "verified",
        severity: "good",
        explanation: "Payment purpose aligns with deliverables cited in the statement of work.",
      });
    } else {
      checks.push({
        id: "payment-purpose",
        fieldName: "Payment Purpose & Scope",
        paymentValue: paymentPurpose,
        sowValue: sowPurpose,
        status: "mismatch",
        severity: "warning",
        explanation: "Payment purpose phrasing differs from milestones referenced in the contract.",
      });
    }
  }

  // 6. Payment Date Check (if date provided)
  if (paymentDate) {
    if (!hasInvoice && !hasSOW) {
      checks.push({
        id: "payment-date",
        fieldName: "Payment Date / Schedule",
        paymentValue: paymentDate,
        status: "unavailable",
        severity: "unavailable",
        explanation: "Upload invoice to verify due date consistency.",
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

  // Calculate consistency score
  let score = 0;
  let status: ConsistencyStatus = "Cannot Verify";
  let statusColor = {
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    dotBg: "bg-slate-400",
    border: "border-slate-200",
    ringColor: "#94a3b8",
  };

  const recommendations: string[] = [];

  if (!hasInvoice && !hasSOW) {
    score = 0;
    status = "Cannot Verify";
    statusColor = {
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-600",
      dotBg: "bg-slate-400",
      border: "border-slate-200",
      ringColor: "#94a3b8",
    };
    recommendations.push(
      "Upload an invoice and signed SOW/contract to enable consistency verification."
    );
  } else {
    // Base score starts from verified fields
    const totalApplicable = checks.length - unavailableCount;
    if (totalApplicable > 0) {
      let rawScore = 100;
      checks.forEach((c) => {
        if (c.status === "mismatch") {
          if (c.severity === "critical") {
            rawScore -= 35;
          } else {
            rawScore -= 12;
          }
        }
      });
      score = Math.max(0, Math.min(100, rawScore));
    } else {
      score = 0;
    }

    if (mismatchCount === 0 && unavailableCount === 0) {
      status = "Consistent";
      statusColor = {
        badgeBg: "bg-green-50",
        badgeText: "text-green-700",
        dotBg: "bg-green-600",
        border: "border-green-200/70",
        ringColor: "#16a34a",
      };
    } else if (checks.some((c) => c.severity === "critical")) {
      status = "Significant Mismatch";
      statusColor = {
        badgeBg: "bg-red-50",
        badgeText: "text-red-700",
        dotBg: "bg-red-600",
        border: "border-red-200/70",
        ringColor: "#dc2626",
      };
    } else if (mismatchCount > 0) {
      status = "Minor Mismatch";
      statusColor = {
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        dotBg: "bg-amber-500",
        border: "border-amber-200/70",
        ringColor: "#d97706",
      };
    } else {
      // Partial documentation
      status = "Consistent";
      statusColor = {
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-700",
        dotBg: "bg-blue-600",
        border: "border-blue-200/70",
        ringColor: "#2563eb",
      };
    }

    // Build recommendations
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
      recommendations.push(
        "Upload an invoice to verify the amount and client details."
      );
    }
    if (!hasSOW) {
      recommendations.push(
        "Upload an SOW or contract to verify the agreed scope and payment terms."
      );
    }
  }

  let summary = "";
  if (status === "Cannot Verify") {
    summary =
      "Consistency check is currently unavailable because supporting documents have not yet been attached.";
  } else if (status === "Consistent") {
    summary =
      "The payment details currently agree with the available supporting documents. No contradictions detected.";
  } else if (status === "Minor Mismatch") {
    summary =
      "Minor mismatch detected across supporting records. Review the highlighted field before relying on the document set.";
  } else {
    summary =
      "Significant discrepancy detected between payment details and document records. Align these figures before requesting payment.";
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
