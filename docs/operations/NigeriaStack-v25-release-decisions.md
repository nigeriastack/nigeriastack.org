# NigeriaStack v2.5 release decisions

## Owner review and release scope

The owner preview is the corrected English candidate. The build binds 955 canonical pages and 968 serving files. It includes the approved wordmark, plain-language navigation, the Working Group draft and revision handoff, the parent-to-child paths and the institutional notice restricted to the seven parent footers. English is the only published language for this preview.

The localization target covers navigation, task copy, directory and search controls, generated status and result labels, accessible names, errors, and the Working Group and sample verifier workflows. Keep route identities, government and partner names, product names, standard identifiers, pinned revisions, technical values and source links stable across locales. Preserve normative RFC text and machine-readable artefacts as exact source material. Where a localized route presents authoritative English prose, identify its language and provide a local-language introduction and source action. Apply equivalent status wording in search results and direct page entry. Publish the institutional notice translation only after checking institutional attribution, independence and custody wording against the exact English. The original notice remains available with its language identified.

The 3,240 pilot entries are draft copy. The wider 7,402-slot inventory is scope evidence. Preserve the anchor and private worksheet context when reviewing these strings. Render reviewed language bundles, metadata, fragment links, plurals, fallbacks and result states against a new bound receipt before offering a language selector. Independent fluent-language and legal-semantic decisions, representative audience observations, heard screen-reader results, active forced colours and handset keyboard checks require evidence from the stated contexts. The owner preview can be used for controlled review. These requirements remain part of the public release acceptance.

## Cloudflare Pages

Use a Cloudflare Pages **Preview** deployment for the receipt-bound static candidate, with Cloudflare Access enabled and an authenticated and unauthenticated smoke test. On an existing Git-integrated project, use a nonproduction branch and manual Wrangler upload if the branch must stay independent of Git triggers. On an existing Direct Upload project, use its preview deployment. Preserve the project’s existing deployment method. Enabling preview access protects preview URLs. Verify access separately for any production alias or custom domain.

The exact source can be rebuilt using the command in `apps/archive-web-v25/README.md`. Keep the audited source ZIP and corrected route index as independently supplied inputs. Run the packaging step against the matching build output and its receipt:

```sh
python3 apps/archive-web-v25/stage_pages.py /path/to/dist /path/to/source-receipt.json \
  /path/to/protected-preview.zip /path/to/package-receipt.json
```

The package adds a root 404 page and preview headers. It preserves every audited candidate file, including its `noindex` markup. The GitHub review commit uses Cloudflare’s Pages-specific skip prefix to prevent an automatic deployment. Keep the existing production URL and routing in place while verifying the preview. [Cloudflare preview access](https://developers.cloudflare.com/pages/configuration/preview-deployments/) · [Cloudflare GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)

On a protected preview, check the seven parent routes, sample nested pages, deep links, search with and without results, the verifier, a missing path returning HTTP 404, the indexing header and JSON types. Check anonymous access from a separate session. For production, require the completed acceptance record, a separate indexed serving receipt, the verified production project and domain binding, and the recorded rollback deployment. Verify the public canonical URLs and search indexing configuration on the production candidate before promotion.
