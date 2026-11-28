# Validate the human acceptance evidence

Use the evidence checker with the exact serving-file receipt for the candidate being reviewed. Copy the supplied templates outside the skill directories and fill them with observed data. `--audience`, `--speech` and `--locale` can be run independently or together. A combined result can report `allThreeGatesPassed` only when it receives all three complete receipts.

```sh
python3 .agents/skills/nigeriastack-audience-testing/scripts/check_acceptance.py \
  --build-receipt /path/to/serving-file-receipt.json \
  --audience /path/to/audience-receipt.json \
  --speech /path/to/speech-receipt.json \
  --locale /path/to/locale-receipt.json \
  --inventory /path/to/english-inventory.json
```

Use `--english-source-receipt` when the original English inventory came from a different build of the same reviewed English source. The target `--build-receipt` still binds audience, spoken and rendered locale evidence. With `--allow-open`, properly shaped pending evidence may exit successfully for preparation work. The result itself keeps the gate pending and lists what is missing. Invalid data and unresolved blocking findings return an error.

For an audience observation, record a pseudonymous `participant`, the `audience` key, `mode` set to `actual-representative`, a `date` in `YYYY-MM-DD`, `device`, `input`, `connection`, `startRoute`, `firstAction`, `observed`, `comprehension`, `recovery`, `outcome`, `understoodAuthorityAndStatus`, `recovered`, `findingIds` and an `evidenceRef`. Use outcome values `completed-unassisted`, `completed-assisted` or `not-completed`. The checker needs positive observations covering each audience and dispositions for incomplete tasks. This minimum supports qualitative findings and does not establish a statistically representative sample.

In a spoken profile fill actual tool versions and add a result for each case. Use `outcome` of `pass`, `fail` or `blocked`. For a completed run include `route`, `action`, `heard`, `focusAfter`, `speechHeardByHuman` and an `evidenceRef`. For a failure include `findingId`. For a blocked run explain why in `reason`. Reuse the same finding structure across the first two receipts. Each finding records `id`, `impact`, `evidenceRef`, `blocking` and `status`. Close a finding with both `resolution` and `retestRef`.

A rendered locale check takes `locale`, `reviewer`, `testedRoutes`, `evidenceRef` and these verified booleans: `documentLanguage`, `fallbackLanguage`, `navigation`, `statusMessages`, `narrowReflow`.

The checker verifies coverage, shape and byte bindings. Ensure an authorised reviewer reads the underlying evidence before recording the actual decision. A successful check does not grant permission to publish or share evidence or replace the exact-build product review.
