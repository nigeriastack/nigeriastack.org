# Prepare, review and verify locale copy

| Locale | Review audience |
| --- | --- |
| `ha-NG` | A fluent Hausa reviewer with experience in written civic or service copy |
| `yo-NG` | A fluent Yorùbá reviewer who checks tone marks and underdots |
| `ig-NG` | A fluent Igbo reviewer who checks standard orthography and understands the intended readership |
| `pcm-NG` | A fluent Nigerian Pidgin reviewer who applies the agreed plain-language register consistently |

Run the extractor on the exact served files and archive build receipt. It checks each inspected file against its receipt digest. It extracts text, headings, link labels, form labels and accessible-name attributes from the seven parents and selected supporting pages by default, and captures likely runtime messages from the served interaction scripts. Use `--extra-route` to add approved handoffs or `--all-routes` for the complete receipt route set. Add `--expanded-copy` to inventory page metadata, list and table prose, generated Working Group draft labels and result titles and statuses from the served search indexes. Inspect the generated JSON alongside browser states. Resolve inline markup and authoritative English excerpts, and complete missing dynamic wording, including plurals, template parameters and accessible status changes. The extractor reports a starting inventory and never marks scope complete.

```sh
python3 .agents/skills/nigeriastack-locale-review/scripts/extract_source.py \
  --dist /path/to/served-files \
  --build-receipt /path/to/serving-file-receipt.json \
  --source-revision COMMIT_OR_SOURCE_REVISION \
  --output /path/to/english-inventory.json
```

Alternatively use [the source inventory template](../assets/english-inventory.json). Preserve stable slot identities and exact English hashes. Record relevant destination URLs, verified reference names and interpolation tokens as protected terms. Record covered and excluded copy in your review evidence. After a human checks scope completeness, record their alias and evidence in `scopeReview`. Re-run the queue generator if the approved inventory changes. Never carry forward approvals across changed text or source silently.

```sh
python3 .agents/skills/nigeriastack-locale-review/scripts/prepare_review.py \
  --build-receipt /path/to/serving-file-receipt.json \
  --inventory /path/to/english-inventory.json \
  --output /path/to/locale-receipt.json
```

The generator records each source text hash and creates one empty row per locale and slot. It marks each row `DRAFT_UNPUBLISHED`. After filling a draft, compute the text SHA-256 from the exact UTF-8 translation and record it in the review decision. The primary reviewer checks natural terms, instructions and form labels in context. Record `LINGUISTIC_REVIEW_PASSED` only with that review. The second named role checks authority, scope, legal or consent meaning, exact references, candidates and signed/unsigned wording against the source. Record `LEGAL_SEMANTIC_REVIEW_APPROVED` only after both decisions bind the current text hash. Use different reviewer aliases for the two decisions. Review all changes before replacing an approved version.

When implementing approved language, declare the document language and identify English content where it appears inside another language. Where statutory or consent copy has no approved translation, retain the authoritative English text with the existing labelled fallback. If a locale has no approved bundle, keep it unavailable for release review. In the actual rendered locale check that the selected language survives navigation; accented text renders, searches and wraps; and visible labels and status announcements retain their intended meaning. Use the 320 CSS px layout check and wider representative widths. Test actual translated copy and report synthetic text expansion separately. [W3C HTML language declarations](https://www.w3.org/International/questions/qa-html-language-declarations.en) · [IANA language subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

Record a separate rendered result for each locale in `renderedChecks`. The approved English source receipt binds the translation rows, and `renderedBuildReceiptSha256` binds locale integration to separately identified actual rendered bytes. The two receipts may coincide for a candidate that already integrates the approved translations. Add coverage for document and fallback languages, status, navigation and narrow reflow. Preserve tested paths and evidence. The checker only validates the recorded evidence and the hashes it is given. A human review is still needed to establish translation and experience quality.

## Assemble agent drafts for review

Have a translation agent return a JSON object keyed by source slot for each locale. Give a separate reviewer the English source, route context and drafts. Keep their issue decisions separate from the translator's output. Use the assembler to create a byte-bound draft receipt and a reviewer worksheet for each locale. Blank or flagged entries remain drafts. Review the source and target together before accepting an identically worded proper name or making any editorial change.

```sh
python3 .agents/skills/nigeriastack-locale-review/scripts/assemble_drafts.py \
    --inventory english-inventory.json --queue locale-receipt.json \
    --draft-directory /path/to/per-locale-json --out /path/to/new-review-folder
```

The runtime placeholder and protected-token checks supplement semantic review. Review the highest-risk status, consent, signature, authority and evidence language in the rendered task. Keep agent-generated or agent-reviewed entries out of the authorised approval fields until the required linguistic and legal-semantic decisions are recorded.
