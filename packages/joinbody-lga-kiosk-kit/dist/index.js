/**
 * @package @nigeriastack/lga-kiosk-kit
 * @license Apache-2.0 OR MIT
 * @normative NS-RFC-014 (774-LGA Municipal Governance Stack) & NS-RFC-009 (SplitDirect)
 */
const LGA_CODE_REGEX = /^[A-Z]{2}-LGA-[0-9]{2}$/;
export function validateLgaTreasuryInvariance(envelope) {
    if (!LGA_CODE_REGEX.test(envelope.lgaCode)) {
        return { valid: false, httpStatus: 422, errorCode: "INVALID_CONSTITUTIONAL_LGA_CODE" };
    }
    const proof = envelope.splitDirectTreasuryProof;
    if (proof.platformEscrowAmountKobo !== 0 ||
        proof.stateIntermediaryEscrowKobo !== 0 ||
        proof.statutoryAmountKobo <= 0 ||
        !proof.directLgaTreasuryAccountRef.startsWith("CBN-LGA-")) {
        return {
            valid: false,
            httpStatus: 422,
            errorCode: "TREASURY_PASSTHROUGH_INVARIANCE_BREACH",
        };
    }
    return { valid: true, httpStatus: 200 };
}
export function renderUssd347Menu(locale = "en-NG") {
    const menus = {
        "en-NG": "CON Welcome to 774-LGA Public Service (*347*LGA#)\n" +
            "1. Report Road/Water Fault (CouncilComplain)\n" +
            "2. Pay Market/Motor-Park Ticket (100% Direct to LGA)\n" +
            "3. Verify Inter-LGA Commercial Transit Pass\n" +
            "4. Track 72h Indigene Certificate (IndigeneProof)",
        "pcm-NG": "CON Welcome to 774 Local Govt Service (*347*LGA#)\n" +
            "1. Report Bad Road or Pipe (CouncilComplain)\n" +
            "2. Pay Market/Park Ticket Direct to Council\n" +
            "3. Check Inter-LGA Motor Transit Pass\n" +
            "4. Check 72-Hour Indigene Certificate",
        "ha-NG": "CON Barka da zuwa Hidimar Kananan Hukumomi 774 (*347*LGA#)\n" +
            "1. Kai Rahoton Matsalar Hanya ko Ruwa\n" +
            "2. Biyan Harajin Kasuwa/Tasha Kai Tsaye\n" +
            "3. Tantance Izinin Motar Kasuwanci\n" +
            "4. Duba Takardar Dan Asalin Karamar Hukuma (72h)",
        "yo-NG": "CON E kaabo si Ise Ijoba Ibile 774 (*347*LGA#)\n" +
            "1. Fi Esun Oju-Ona tabi Omi Re Sile\n" +
            "2. San Owo Oja tabi Ibudo Moto Taara si Ijoba Ibile\n" +
            "3. Daju Iwe-Irinaoko Ero/Eru\n" +
            "4. Bere Iwe Eri Omo Ibile (Wakati 72)",
        "ig-NG": "CON Nnoo na Oru Okpuru Ochichi 774 (*347*LGA#)\n" +
            "1. Kpesa Nsogbu Uzo ma obu Mmiri\n" +
            "2. Kwuo Ugwo Ahia/Ogige Ugboala Ozugbo\n" +
            "3. Nyochaa Akwukwo Ngafe Ugboala\n" +
            "4. Lelee Asambodo Nwa Afo (Aka 72)",
    };
    return menus[locale];
}
