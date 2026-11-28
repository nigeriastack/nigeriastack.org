---
name: nigeriastack-spoken-accessibility
description: Capture audible screen-reader evidence for the NigeriaStack candidate on Windows NVDA, iOS VoiceOver and Android TalkBack. Use for spoken accessibility verification, announcement and focus checks, and review evidence.
---
# Verify the spoken screen-reader journeys

- Confirm the target candidate and bind every run to its serving-file receipt SHA-256. Prepare [the run matrix](references/speech-matrix.md) and [the speech receipt](assets/speech-receipt.json). Observe the actual candidate on a real screen reader. Record device, OS, browser, reader, voice language and settings.
- Listen for the interface name and role, the task result, error or recovery, and unexpected repeat speech. Transcribe the relevant words, record the input and focus afterwards, and include a redacted evidence reference. Record whether the intended information was audible without moving focus for status messages.
- Keep inspection, scripted browser results and spoken evidence distinct. Record `PENDING` for combinations without an actual observed reader, with the reason. Treat text exposed in the accessibility tree as diagnostic evidence for remediation.
- Record blocking findings with exact expected and observed speech, route, device and versions. Retain earlier failed reports with the repair and exact-build retest references. Use [the evidence checker](../nigeriastack-audience-testing/references/evidence-check.md) for the final handoff. Report the tested coverage.
