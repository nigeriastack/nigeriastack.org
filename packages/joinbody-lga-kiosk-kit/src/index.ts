/**
 * @package @nigeriastack/lga-kiosk-kit
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-014 (774-LGA Municipal Governance Stack) & NS-RFC-009 (SplitDirect)
 */

export type LgaModuleId =
  | "LGA-01" | "LGA-02" | "LGA-03" | "LGA-04" | "LGA-05" | "LGA-06" | "LGA-07"
  | "LGA-08" | "LGA-09" | "LGA-10" | "LGA-11" | "LGA-12" | "LGA-13" | "LGA-14";

export interface SplitDirectLgaTreasuryProof {
  statutoryAmountKobo: number;
  directLgaTreasuryAccountRef: string;
  platformEscrowAmountKobo: number;
  stateIntermediaryEscrowKobo: number;
}

export interface LgaGovernanceServiceEnvelope {
  envelopeUlid: string;
  lgaCode: string;
  moduleId: LgaModuleId;
  kioskBaseDeltaId: string;
  clockSyncStatus: "NTP_GPS_VERIFIED" | "DEGRADED_LOCAL_HLC";
  splitDirectTreasuryProof: SplitDirectLgaTreasuryProof;
  sureEvidenceSealId?: string;
}

const LGA_CODE_REGEX = /^[A-Z]{2}-LGA-[0-9]{2}$/;

export function validateLgaTreasuryInvariance(envelope: LgaGovernanceServiceEnvelope): {
  valid: boolean;
  httpStatus: 200 | 422;
  errorCode?: "INVALID_CONSTITUTIONAL_LGA_CODE" | "TREASURY_PASSTHROUGH_INVARIANCE_BREACH";
} {
  if (!LGA_CODE_REGEX.test(envelope.lgaCode)) {
    return { valid: false, httpStatus: 422, errorCode: "INVALID_CONSTITUTIONAL_LGA_CODE" };
  }
  const proof = envelope.splitDirectTreasuryProof;
  if (
    proof.platformEscrowAmountKobo !== 0 ||
    proof.stateIntermediaryEscrowKobo !== 0 ||
    !Number.isSafeInteger(proof.statutoryAmountKobo) ||
    proof.statutoryAmountKobo <= 0 ||
    !proof.directLgaTreasuryAccountRef.startsWith("CBN-LGA-")
  ) {
    return {
      valid: false,
      httpStatus: 422,
      errorCode: "TREASURY_PASSTHROUGH_INVARIANCE_BREACH",
    };
  }
  return { valid: true, httpStatus: 200 };
}

/** Illustrative menu only; the legacy function name does not identify an allocated shortcode. */
export function renderUssd347Menu(locale: "en-NG" | "ha-NG" | "yo-NG" | "ig-NG" | "pcm-NG" = "en-NG"): string {
  const menus: Record<typeof locale, string> = {
    "en-NG":
      "CON ILLUSTRATIVE MENU: Welcome to 774-LGA Public Service\n" +
      "1. Report Road/Water Fault (CouncilComplain)\n" +
      "2. Pay Market/Motor-Park Ticket (100% Direct to LGA)\n" +
      "3. Verify Inter-LGA Commercial Transit Pass\n" +
      "4. Track 72h Indigene Certificate (IndigeneProof)",
    "pcm-NG":
      "CON ILLUSTRATIVE MENU: Welcome to 774 Local Govt Service\n" +
      "1. Report Bad Road or Pipe (CouncilComplain)\n" +
      "2. Pay Market/Park Ticket Direct to Council\n" +
      "3. Check Inter-LGA Motor Transit Pass\n" +
      "4. Check 72-Hour Indigene Certificate",
    "ha-NG":
      "CON ILLUSTRATIVE MENU: Barka da zuwa Hidimar Kananan Hukumomi 774\n" +
      "1. Kai Rahoton Matsalar Hanya ko Ruwa\n" +
      "2. Biyan Harajin Kasuwa/Tasha Kai Tsaye\n" +
      "3. Tantance Izinin Motar Kasuwanci\n" +
      "4. Duba Takardar Dan Asalin Karamar Hukuma (72h)",
    "yo-NG":
      "CON ILLUSTRATIVE MENU: E kaabo si Ise Ijoba Ibile 774\n" +
      "1. Fi Esun Oju-Ona tabi Omi Re Sile\n" +
      "2. San Owo Oja tabi Ibudo Moto Taara si Ijoba Ibile\n" +
      "3. Daju Iwe-Irinaoko Ero/Eru\n" +
      "4. Bere Iwe Eri Omo Ibile (Wakati 72)",
    "ig-NG":
      "CON ILLUSTRATIVE MENU: Nnoo na Oru Okpuru Ochichi 774\n" +
      "1. Kpesa Nsogbu Uzo ma obu Mmiri\n" +
      "2. Kwuo Ugwo Ahia/Ogige Ugboala Ozugbo\n" +
      "3. Nyochaa Akwukwo Ngafe Ugboala\n" +
      "4. Lelee Asambodo Nwa Afo (Aka 72)",
  };
  return menus[locale];
}

/** Local routing plan using a caller-supplied trusted account registry; no transfer is executed. */
export function planDirectTreasuryRouting(
  envelope: LgaGovernanceServiceEnvelope, verifiedTreasuryAccounts: ReadonlyMap<string, string>,
): { valid: false; httpStatus: 422; errorCode: string } | { valid: true; httpStatus: 200; transfers: { accountRef: string; amountKobo: number }[] } {
  const result = validateLgaTreasuryInvariance(envelope);
  if (!result.valid) return { valid: false, httpStatus: 422, errorCode: result.errorCode! };
  const proof = envelope.splitDirectTreasuryProof;
  if (verifiedTreasuryAccounts.get(envelope.lgaCode) !== proof.directLgaTreasuryAccountRef) {
    return { valid: false, httpStatus: 422, errorCode: "TREASURY_ACCOUNT_NOT_VERIFIED" };
  }
  return { valid: true, httpStatus: 200, transfers: [{ accountRef: proof.directLgaTreasuryAccountRef, amountKobo: proof.statutoryAmountKobo }] };
}
