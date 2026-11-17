import { describe, it, expect } from "vitest";
import { validateLgaTreasuryInvariance, renderUssd347Menu } from "../src/index.js";

describe("@nigeriastack/lga-kiosk-kit (NS-RFC-014 & SC/CV/343/2024 / ITB-04)", () => {
  it("enforces zero platform and SJLGA intermediary escrow and renders illustrative menus without an allocated shortcode", () => {
    const validEnv = validateLgaTreasuryInvariance({
      envelopeUlid: "cop_01JBM8K9P2Q4R6S8T0V2W4X700",
      lgaCode: "LA-LGA-11",
      moduleId: "LGA-10",
      kioskBaseDeltaId: "kbd_01JBM8K9P2Q4R6S8T0V2W4X722",
      clockSyncStatus: "NTP_GPS_VERIFIED",
      splitDirectTreasuryProof: {
        statutoryAmountKobo: 20000,
        directLgaTreasuryAccountRef: "CBN-LGA-LA-11",
        platformEscrowAmountKobo: 0,
        stateIntermediaryEscrowKobo: 0,
      },
    });
    expect(validEnv.valid).toBe(true);
    for (const locale of ["en-NG", "pcm-NG", "ha-NG", "yo-NG", "ig-NG"] as const) {
      expect(renderUssd347Menu(locale)).toContain("ILLUSTRATIVE MENU");
      expect(renderUssd347Menu(locale)).not.toContain("*347");
    }
  });
});
