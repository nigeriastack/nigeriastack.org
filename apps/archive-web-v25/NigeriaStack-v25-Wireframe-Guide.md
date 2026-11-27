# NigeriaStack v2.5 UI wireframes

Extract the wireframe archive to open the seven entry pages below or find any admitted route in `route-index.csv`. The archive contains one wireframe document per URL, with four viewports in each. Its folders mirror the public paths. The frames show content order and control placement at 1440, 768, 390 and 320 CSS px. Their character widths illustrate reflow. Browser zoom, device rendering and spoken accessibility require their own checks.

| Entry page | What the visitor does | Example next page |
| --- | --- | --- |
| [Home](wireframes/index.md) | Find a service area, specification, jurisdiction or safeguard. Use Search in the shared navigation to find a name or identifier. | [Search results](wireframes/search/index.md) or [Hourglass reference](wireframes/rfcs/NS-RFC-001/index.md) |
| [Industries](wireframes/sectors/index.md) | Combine sector, gap and maturity filters, compare the records and export the result set. | [Payments and money movement](wireframes/sectors/finance-revenue-and-fiscal-systems/IND-01/index.md) |
| [Protocols](wireframes/protocols/index.md) | Start from a practical problem, then open a guide and its exact requirement. | [Recover after a timeout](wireframes/protocols/confluence-gateway/index.md) or [Municipal workflows](wireframes/protocols/lga-governance-stack/index.md) |
| [Specifications](wireframes/rfcs/index.md) | Use an exact ID or browse by topic, lifecycle and track, then inspect the requirement with its source. | [Safe workflow retry](wireframes/rfcs/NS-RFC-003/index.md) or [Municipal specification](wireframes/rfcs/NS-RFC-014/index.md) |
| [Conformance](wireframes/conformance/index.md) | Run a browser-local synthetic digest comparison and inspect an unsigned result. | The result and receipt controls stay within the Conformance page. |
| [Atlas](wireframes/atlas/index.md) | Search council identities or browse jurisdiction readiness by name. | [Council directory](wireframes/atlas/lga-774/index.md), [AMAC](wireframes/atlas/lga-774/FC/FC-AC-02/index.md), [State and FCT directory](wireframes/atlas/states/index.md) or [FCT readiness](wireframes/atlas/states/FC/index.md) |
| [Governance](wireframes/governance/index.md) | Read the charter and safeguards, find a Working Group, prepare a local draft or open an answer. | Group records, the draft form and FAQs are addressable sections within Governance. |

## How the page paths work

```text
[ Home | Search | shared record link ]
                    |
          [ What do you need? ]
         /          |           \
[ Learn or test ] [ Find a place ] [ Inspect governance ]
        |              |                    |
[ Collection ]  [ State or council ]  [ Charter or group ]
        |              |                    |
[ Exact record ] [ Identity or evidence ] [ Prepare a draft ]
        |
[ Matched check available? ]
        |                         |
[ Run and inspect result ]   [ Read the reference and scope ]
```

A list result names the destination and its evidence status. A shared record link offers the same breadcrumb and collection link. Restore search, filtering, sorting and position on Back where those controls apply. Keep the record’s own breadcrumb when offering a return to global search. Distinguish no matches from unavailable data and an unassessed record.

## Governance detail

```text
[ Charter ] [ Safeguards ] [ Working groups ] [ Contribution ] [ Answers ]
                                  |
                       [ Show all topics v ]
                                  |
                    [ Individual group record ]
                    /                         \
[ Remit, references, decision status ]  [ Prepare draft ]
                                              |
                       [ Proposal | Erratum | Concern ]
                                              |
                            [ Copy draft ] [ Download draft ]
```

Record links use the six individually addressable Working Group anchors. Contribution links carry the named group to the existing contribution section. The draft screen states the absence of a verified submission channel. When a FAQ or group is opened through a shared anchor, expand the target in place and focus its label. Retain the distinction between the four archive inventory fragments and the six added group anchors.

## Visual and interaction notes

- Put the full Open Standards & Non-Impersonation notice below the footer links as fine print on the seven entry pages. Keep a shared footer with Explore, Project and Developer resources. Link to NigeriaStack on GitHub and the specification source.
- Frame the full approved v2.3 lockup around the visible mark. Use the project’s parchment, forest ink, deep emerald and typography tokens. Keep structural borders sharp, use ordinary tool labels and place the first task ahead of supporting copy. Reserve identifiers for record lookup, policy references and source detail.
- Keep narrow list results in reading order. Group additional controls behind a labelled disclosure and announce changes to the result count. Keep active facets visible or summarised. Align the normative text and reference panes on wide readers, then read them in order on small screens.
- The use cases leave sensitive or personal information out of example payloads and Working Group drafts. Scope, evidence and current status appear beside each action.
- Five distinct journey scripts are represented by the exact source handoffs in the archive. A regulator can open safeguards and a group remit. A local leader can find council identity or jurisdiction readiness. An enterprise lead can compare industry records. An engineer can inspect the exact specification and verification scope. A resident can look up a council by name or read a plain-language answer.

## Coverage and reproduction

`route-index.csv` links every admitted route to its artboard, source digest, navigation parent and collection return. `handoffs.json` records intended targets and link observations when the corresponding HTML is supplied. `receipt.json` records route counts and input digests. The route inventory contains 955 pages and four first-class archive fragments. The RFC-004 alternate source uses the existing URL. The six new group links remain in-page anchors.

Reproduce with Python 3.11 or later. Use the versioned route ledger, RFC and heading readback, existing project data and an optional build directory.

```sh
python3 generate_wireframes.py \
  --ledger /path/to/NigeriaStack-v25-Route-Admission-and-Parent-Ledger.csv \
  --readback /path/to/source-readback.json \
  --project /path/to/website \
  --dist /path/to/candidate/dist \
  --verify-footer-notice \
  --output /path/to/output
```

Omitting `--dist` and `--verify-footer-notice` emits the design against the ledger and sources. Linking a candidate checks the exact page set and binds each artboard to the candidate’s H1 and HTML digest. The link observations identify where intended handoffs have HTML anchors. Browser history, focus, button actions, filters, disclosure and draft behavior need separate tests.
