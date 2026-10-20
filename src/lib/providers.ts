/** Integration boundaries. No browser secrets or simulated live responses. */
export interface RecognitionProvider {
  identify(audio: Blob): Promise<{ artistId: string; confidence: number }>;
}
export interface DistributionProvider {
  submit(releaseId: string): Promise<{ externalId: string }>;
  status(externalId: string): Promise<string>;
}
export interface PaymentProvider {
  fundAgreement(id: string): Promise<{ reference: string }>;
  requestPayout(amountCents: number): Promise<{ reference: string }>;
}
export interface VerificationProvider {
  verify(entityId: string): Promise<{ verified: boolean; source: string }>;
}
export const integrationReadiness = {
  recognition: false,
  distribution: false,
  payments: false,
  verification: false,
  authentication: false,
  radio: false,
  editorialAudio: false,
} as const;
export class UnconfiguredProvider
  implements
    RecognitionProvider,
    DistributionProvider,
    PaymentProvider,
    VerificationProvider
{
  async identify(): Promise<never> {
    throw new Error(
      "Music recognition is not configured. Use the explicitly labelled sample journey.",
    );
  }
  async submit(): Promise<never> {
    throw new Error("No DSP distributor is configured.");
  }
  async status(): Promise<never> {
    throw new Error("No DSP distributor is configured.");
  }
  async fundAgreement(): Promise<never> {
    throw new Error("No payment provider is configured.");
  }
  async requestPayout(): Promise<never> {
    throw new Error("No payment provider is configured.");
  }
  async verify(): Promise<never> {
    throw new Error("No independent verification source is configured.");
  }
}
