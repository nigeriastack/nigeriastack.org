# Municipal Multichannel Contract — Operator USSD and Assisted Counters

## Basic-phone USSD service design
### Conditional allocation and operator integration
#### Provisioning is not established
- **Requested menu pattern:** `*347*LGA#`; illustrative short per-module requests use `*347*LGA*09#` etc. **No licensed allocation, switching, tariff or operator integration receipt was supplied.** The public website must not describe these as live dialable services.
- Operator must supply allocation/license evidence, approved security/routing, a signed session callback, cross-network availability tests, USSD billing and locale support. NCC guidance makes allocation a separate process.
- A session MUST authenticate an opaque operator session ref, enforce expiry, rate limits and request-to-council binding. Phone number is not equivalent to statutory identity.

## Safe default menu tree
### Service scope and privacy
#### Presentation example; do not publish as a functioning dial code
```
NigeriaStack-compliant council service (operated by your council)
1. Report a municipal problem     [LGA-01]
2. Check an existing reference    [LGA-01..14: opaque status only]
3. See approved council charges   [LGA-09/10]
4. Request counter appointment    [LGA-02/04/05/06/07/11]
5. Report water or sanitation      [LGA-03]
6. Find a paper-assisted location [ALL]
0. Exit
```
- Never expose family, juvenile, clinical, case-party, NIN/BVN, court exhibits, account numbers, or indigene-status details in USSD/SMS. A one-time code may support status retrieval but is not proof of identity or a decision.
- Do not finalize paid status from USSD callback alone. Return pending reference, then allow independently verified status/receipt by secure verifier.
- Use `en-NG`, `ha-NG`, `yo-NG`, `ig-NG`, `pcm-NG` as supported **target locales**. Strings in the source are English only; non-English statutory or rights texts require translator/legal review; no fabricated translations are included.

## Paper-assisted counter
### Intake, corrections and identity
#### Document custody
- Counter officer records source form serial, scanned evidence digest (where allowed), witnessed submission, consent/lawful basis explanation, receipt class, correction pathway and dispatch reference.
- Stamped acknowledgement is **provisional intake**, not an official certificate or proof of payment. Any finalized legal receipt requires the appropriate authority signature and independent settlement evidence.
- Make accessible disability routes, local-language assistance, non-smartphone service, readable kiosk print and assistive-device support part of the acceptance test.
