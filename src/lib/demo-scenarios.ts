/**
 * Demo Scenario Definitions for PaymentShield
 * Provides 3 realistic fintech evaluation scenarios for demo and review.
 */

import { PaymentInput, DocumentState } from "./readiness-engine";

export interface DemoScenario {
  id: "ready-payment" | "missing-documents" | "invoice-mismatch";
  name: string;
  badge: string;
  badgeType: "ready" | "warning" | "error";
  description: string;
  payment: PaymentInput;
  documents: DocumentState;
}

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  "ready-payment": {
    id: "ready-payment",
    name: "Ready Payment",
    badge: "Verified Ready",
    badgeType: "ready",
    description: "Fully documented ₹2,50,000 milestone with matching invoice and signed SOW.",
    payment: {
      clientName: "Acme Technologies",
      amount: "₹2,50,000",
      serviceType: "Website Development",
      purpose: "50% advance payment for website development as agreed in the signed SOW",
      paymentType: "Advance Payment",
      clientEmail: "finance@acmetech.example",
      paymentDate: "2026-09-15",
    },
    documents: {
      invoice: {
        fileName: "Acme_Invoice_INV-2026-089.pdf",
        fileSize: "184 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "Acme Technologies",
          amount: 250000,
          service: "Website Development",
          paymentType: "Advance Payment",
          paymentDate: "2026-09-15",
        },
      },
      sow_contract: {
        fileName: "Acme_Signed_SOW_Phase1.pdf",
        fileSize: "342 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "Acme Technologies",
          amount: 250000,
          service: "Website Development",
          paymentPurpose: "50% advance payment for website development as agreed in the signed SOW",
          paymentType: "Advance Payment",
          paymentDate: "2026-09-15",
        },
      },
      client_comm: {
        fileName: "Acme_Approval_Email_Thread.pdf",
        fileSize: "95 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "Acme Technologies",
          service: "Website Development",
          paymentPurpose: "website development advance",
        },
      },
      proof_of_work: {
        fileName: "Website_Development_Deliverables.pdf",
        fileSize: "512 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "Acme Technologies",
          service: "Website Development",
        },
      },
    },
  },

  "missing-documents": {
    id: "missing-documents",
    name: "Missing Documents",
    badge: "Needs Documentation",
    badgeType: "warning",
    description: "₹85,000 final payment with invoice only; SOW and supporting proof missing.",
    payment: {
      clientName: "Nova Labs",
      amount: "₹85,000",
      serviceType: "UI/UX Consulting",
      purpose: "Final payment for UI/UX consulting engagement",
      paymentType: "Final Payment",
      clientEmail: "accounts@novalabs.design",
      paymentDate: "2026-09-20",
    },
    documents: {
      invoice: {
        fileName: "NovaLabs_Invoice_INV-104.pdf",
        fileSize: "142 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "Nova Labs",
          amount: 85000,
          service: "UI/UX Consulting",
          paymentType: "Final Payment",
          paymentDate: "2026-09-20",
        },
      },
      // sow_contract: intentionally missing
      // client_comm: intentionally missing
      // proof_of_work: intentionally missing
    },
  },

  "invoice-mismatch": {
    id: "invoice-mismatch",
    name: "Invoice Mismatch",
    badge: "Mismatch Detected",
    badgeType: "error",
    description: "₹1,20,000 requested but attached invoice cites ₹1,00,000 — contradiction flagged.",
    payment: {
      clientName: "BrightPath Solutions",
      amount: "₹1,20,000",
      serviceType: "Software Development",
      purpose: "Milestone payment for software development phase 1",
      paymentType: "Milestone Payment",
      clientEmail: "billing@brightpath.io",
      paymentDate: "2026-09-25",
    },
    documents: {
      invoice: {
        fileName: "BrightPath_Invoice_INV-302.pdf",
        fileSize: "196 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "BrightPath Solutions",
          amount: 100000, // Contradiction: ₹1,00,000 vs Payment ₹1,20,000
          service: "Software Development — Phase 1",
          paymentType: "Milestone Payment",
          paymentDate: "2026-09-25",
        },
      },
      sow_contract: {
        fileName: "BrightPath_Master_SOW.pdf",
        fileSize: "410 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "BrightPath Solutions",
          amount: 120000, // SOW matches payment ₹1,20,000
          service: "Software Development",
          paymentPurpose: "Milestone payment for software development",
          paymentType: "Milestone Payment",
          paymentDate: "2026-09-25",
        },
      },
      client_comm: {
        fileName: "BrightPath_Milestone_Signoff.pdf",
        fileSize: "115 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "BrightPath Solutions",
          service: "Software Development",
        },
      },
      proof_of_work: {
        fileName: "Sprint_Release_Notes.pdf",
        fileSize: "320 KB",
        uploadedAt: "Verified today",
        metadata: {
          client: "BrightPath Solutions",
          service: "Software Development",
        },
      },
    },
  },
};

/**
 * Loads a scenario into sessionStorage and returns its details
 */
export function applyScenario(scenarioId: "ready-payment" | "missing-documents" | "invoice-mismatch"): DemoScenario {
  const scenario = DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS["ready-payment"];
  try {
    sessionStorage.setItem("paymentshield_payment", JSON.stringify(scenario.payment));
    sessionStorage.setItem("paymentshield_documents", JSON.stringify(scenario.documents));
    sessionStorage.setItem("paymentshield_scenario_id", scenario.id);
  } catch {
    // Ignore storage issues
  }
  return scenario;
}
