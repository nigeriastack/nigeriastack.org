---
name: nigeriastack-locale-review
description: Prepare, review and approve Hausa, Yorùbá, Igbo and Nigerian Pidgin copy for NigeriaStack using source-bound English slots, independent reviewers and rendered language checks. Use for locale inventory, translation, native linguistic review or legal-semantic acceptance.
---
# Review NigeriaStack language copy

- Start with `docs/content/authority-and-precedence.md` and a candidate serving-file receipt. Use [the review workflow](references/locale-workflow.md) to prepare an exact English source inventory, then run this skill's `scripts/prepare_review.py` to initialise the four review queues. Treat starter entries as prompts for source collection.
- Preserve source identity and status. Review the user's task and intended meaning alongside each string. Capture independent linguistic and legal-semantic decisions for reviewed copy. Invalidate the decisions if either source or translation bytes change.
- Verify approved UI on its exact rendered candidate, including the language, labelled English fallback, status announcements, recovery and text reflow. Use [the evidence checker](../nigeriastack-audience-testing/references/evidence-check.md) for the handoff. Keep pending and rejected copy outside the approved bundle.
