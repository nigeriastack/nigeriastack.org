"""Reviewed en-NG copy for the archive review interface.

Mappings use existing route paths and fragments so editorial changes do not
change the admitted URL set. RFC and working group identifiers name records.
"""

PARENT_COPY = {
    "/": {
        "h1": "Make Nigeria’s digital systems work together",
        "lead": "Use open standards to share data, verify records and keep services running. Each institution stays in control of its records.",
        "title": "Open standards for Nigeria’s digital systems | NigeriaStack",
        "description": "Find NigeriaStack standards and guides for sharing data, verifying records and keeping services running. Browse state and council records.",
    },
    "/sectors": {
        "h1": "Find standards for your industry",
        "lead": "Find your industry and see what its systems need to exchange. Check the evidence before you choose a standard.",
        "title": "Find standards by industry | NigeriaStack",
        "description": "Compare industries by sector, gaps and maturity. See what has been assessed and find standards that may help.",
    },
    "/protocols": {
        "h1": "Find a protocol guide",
        "lead": "Choose what your systems need to do. Find a guide to check a record, share data with permission or recover after a timeout.",
        "title": "Protocol guides and municipal workflows | NigeriaStack",
        "description": "Find protocol guides for safe retries, consent, verified records and offline work. Each guide links to the relevant specifications.",
    },
    "/rfcs": {
        "h1": "Find a NigeriaStack specification",
        "lead": "Enter an RFC identifier or search by topic. Open a specification to see its approval status, Working Group and source revision.",
        "title": "Find a specification by topic or RFC identifier | NigeriaStack",
        "description": "Find NigeriaStack specifications by identifier or topic. Check approval status and source revisions, or browse archived profiles.",
    },
    "/conformance": {
        "h1": "Check a sample payload",
        "lead": "Check whether a sample document matches its SHA-256 digest. Run the check in your browser and download an unsigned result.",
        "title": "Check a sample payload in your browser | NigeriaStack",
        "description": "Check a sample document against its SHA-256 digest in your browser and download the unsigned result.",
    },
    "/atlas": {
        "h1": "Find a state or council",
        "lead": "Find a place by name. Check the source for its directory entry and see what is known about local services.",
        "title": "Find states, the FCT and councils | NigeriaStack Atlas",
        "description": "Find state and council directory records, check sources and browse proposed workflows for local services.",
    },
    "/governance": {
        "h1": "How NigeriaStack is governed",
        "lead": "Read the charter to see how NigeriaStack works. Find the Working Group for your topic and prepare a draft if you have a change to suggest.",
        "title": "Charter, Working Groups and contributions | NigeriaStack",
        "description": "Read NigeriaStack’s charter and safeguards. Find a Working Group and prepare a draft proposal, correction or concern.",
    },
}

HOME_TASKS = (
    ("/sectors", "Find industry standards", "Compare industry profiles and see what has been assessed."),
    ("/protocols", "Connect systems", "Find a guide for sharing data, verifying records or recovering after an interruption."),
    ("/rfcs", "Find a specification", "Find an RFC and check which revision and approval status apply."),
    ("/conformance", "Check a sample payload", "See whether a sample document matches its digest."),
    ("/atlas", "Find a state or council", "Find a directory entry and check its sources."),
    ("/governance", "Inspect safeguards", "See who keeps official records and how to prepare a contribution."),
)

ATLAS_TASKS = (
    ("/atlas/states", "Browse states and the FCT", "See council lists and what is known about local services."),
    ("/atlas/lga-774", "Find a council", "Look up a local government area or FCT area council."),
)

PARENT_RETURN_LABELS = {
    "/": "Go to NigeriaStack home",
    "/search": "Return to search",
    "/sectors": "Browse industries",
    "/protocols": "Browse protocol guides",
    "/protocols/lga-governance-stack": "Browse municipal workflows",
    "/rfcs": "Browse specifications",
    "/conformance": "Return to the sample check",
    "/atlas": "Browse the Atlas",
    "/atlas/states": "Browse states and the FCT",
    "/atlas/lga-774": "Browse councils",
    "/governance": "Back to Governance",
}

HEADING_COPY = {
    "/": {
        "platform-purpose--architecture-model": "How systems connect",
        "open-specifications-and-reference-tooling": "Standards and tools you can use",
        "decoupled-interoperability-without-centralized-databases": "Records stay with the responsible institution",
        "core-capability-layer": "Common tasks",
        "cryptographic-evidence-sureevidence": "Check digital records with SureEvidence",
        "permitted-consent-envelopes-clearam": "Share data with permission using ClearAm",
        "offline-store-and-forward-sync-kioskbase": "Keep working offline with KioskBase",
        "action--implementation-routes": "Find what you need",
        "for-integration-engineers--technical-leads": "Connect and test systems",
        "specification-registry-rfcs": "Specifications",
        "interactive-conformance-testbed-conformance": "Sample payload check",
        "for-sector-architects--ecosystem-leads": "Choose where to start",
        "32-industry-interoperability-directory-sectors": "Industry profiles",
        "institutional-governance-charter-governance": "Charter and Working Groups",
        "ecosystem-safeguards--statutory-boundaries": "Who is responsible",
        "statutory-authority-of-record": "Who keeps official records",
        "vendor-neutrality-and-open-licensing-standards": "Open licensing and choice of provider",
    },
    "/sectors": {
        "directory-search--sector-filter-controls": "Search and filter industries",
        "filter-by-industry-sector-category": "Filter by sector, gap or maturity",
        "keyword--workflow-search-parameters": "Search by name, workflow or identifier",
        "industry-profiles--participant-role-mappings-32-sectors": "Industry profiles",
        "sector-extension--proposal-framework": "Suggest a change",
        "submitting-new-industry-workflow-rfcs": "Draft a proposal for your industry",
    },
    "/protocols": {
        "problem-led-integration-selector": "Choose a task",
        "selecting-standards-by-exchange-requirement": "Match a protocol to your task",
        "protocol-developer-guides": "Developer guides",
        "sureevidence--cryptographic-record-verification": "SureEvidence for digital records",
        "clearam--permitted-data-sharing--consent-envelopes": "ClearAm for consent and revocation",
        "confluence--idempotent-exchanges--direct-treasury-routing": "Confluence for message exchange and safe retries",
        "marketlink--federated-catalogues--order-discovery": "MarketLink for catalogues and orders",
        "givepower--bounded-agent-delegation--human-approval": "GivePower for agent permissions and approval",
        "kioskbase--offline-storage--hybrid-logical-clock-sync": "KioskBase for offline records",
        "lawtree--structured-legal-text--bi-temporal-asts": "LawTree for structured legal text",
        "local-government-integration-suite": "Local government workflows",
        "municipal-governance-stack-protocolslga-governance-stack": "Municipal Governance Stack",
        "14-municipal-service-modules-across-774-councils": "Browse municipal workflows",
        "capabilities--normative-binding": "What SureEvidence covers",
        "capabilities--normative-binding-1": "What ClearAm covers",
        "capabilities--normative-binding-2": "What Confluence covers",
        "capabilities--normative-binding-3": "What MarketLink covers",
        "capabilities--normative-binding-4": "What GivePower covers",
        "capabilities--normative-binding-5": "What KioskBase covers",
        "capabilities--normative-binding-6": "What LawTree covers",
    },
    "/rfcs": {
        "registry-search-and-lifecycle-filters": "Search and filter specifications",
        "filter-by-identifier-category-or-stage": "Search by identifier or topic",
        "specification-maturity-stages": "What each status means",
        "draft-candidate-standard-ratified-standard-extended-track": "Current specifications and archived profiles",
        "registered-specification-index-core-001014--extended-015080": "Specification index",
        "extended-specification-track-ns-rfc-015-through-ns-rfc-080": "Extended archive profiles",
        "complete-66-specification-extended-index": "Browse extended profiles",
    },
    "/conformance": {
        "verification-execution-modes": "Available checks",
        "in-browser-schema-validation-client-side-wasm": "Digest check in your browser",
        "live-sandbox-endpoint-verification-beckn-async-pattern": "Live testing",
        "test-suite-selection": "Protocol references",
        "cryptographic-evidence-checks-sureevidence--ns-rfc-001": "SureEvidence reference",
        "consent--revocation-envelopes-clearam--ns-rfc-002": "ClearAm reference",
        "idempotency--treasury-routing-confluence--ns-rfc-003--ns-rfc-009": "Safe retries and treasury routing",
        "delegated-authority-guardrails-givepower--ns-rfc-008": "GivePower reference",
        "test-execution--input-control": "Run the local check",
        "test-input": "Sample input",
        "load-verified-synthetic-examples": "Load a sample",
        "configure-custom-node-url-and-handshake-keys": "Connection settings",
        "results--cryptographic-audit-receipts": "Check result",
        "real-time-execution-log-and-rule-assertions": "What the result means",
        "download-signed-test-receipt-json": "Download the local result",
    },
    "/atlas": {
        "jurisdictional-atlas-scope": "What the Atlas covers",
        "coverage-across-36-states-fct-and-774-lgas": "States, the FCT and councils",
        "directory-navigation-paths": "Choose a directory",
        "state--federal-capital-territory-directory-atlasstates": "States and the FCT",
        "jurisdiction-profiles-and-regional-mappings": "State records and service evidence",
        "local-government-area--area-council-directory-atlaslga-774": "Local government areas and area councils",
        "municipal-profiles-and-council-records": "Council records and proposed workflows",
        "atlas-coverage--data-provenance": "Sources and evidence",
        "distinguishing-installed-integrations-from-canonical-registry-entries": "Directory records and live services",
    },
    "/governance": {
        "charter": "Institutional charter",
        "operational-independence-and-purpose": "What NigeriaStack does",
        "preservation-of-statutory-custody--authority": "Who keeps official records",
        "safeguards": "Safeguards and open licensing",
        "specification-licensing-cc0-standard": "Open licensing",
        "vendor-neutrality-and-portability-mandates": "Public safeguards",
        "core-architecture--evidence-working-groups-wg-01--wg-02": "Architecture and evidence",
        "financial-consent--commerce-working-groups-wg-03--wg-04": "Privacy, revenue and commerce",
        "civic-offline--agent-safety-working-groups-wg-05--wg-06": "Local services and agent safety",
        "contribute": "Prepare a contribution",
        "submitting-standards-extensions--errata": "Draft a proposal, correction or concern",
        "faqs": "Common questions",
        "institutional-status--statutory-agency-boundaries": "Role and responsibilities",
        "technical-protocol--data-security-clarifications": "Protocols and the Atlas",
        "legal-admissibility--regulatory-scope-definitions": "Participation and reuse",
        "are-nigeriastack-rfcs-and-its-institutional-charter-governed-by-the-same-approval-status": "Does charter approval cover every RFC?",
        "does-nigeriastack-take-over-or-centralize-government-master-databases": "Who keeps official government records?",
        "does-the-nigeriastack-atlas-cover-all-774-lgas": "Which councils does the Atlas cover?",
        "how-does-nigeriastack-address-interoperability-across-32-industries": "What can I find in the industry directory?",
        "what-can-developers-verify-through-the-interoperability-test-bed": "What can I check in my browser?",
        "how-do-nigeriastack-specifications-accommodate-citizens-without-smartphones": "How can people access services without a smartphone?",
        "does-mentioning-a-nigerian-technology-provider-imply-endorsement": "Does NigeriaStack endorse providers it mentions?",
    },
}

FAQ_ANSWERS = {
    "is-nigeriastack-a-nigerian-government-agency": "NigeriaStack is an independent standards commons designed in Nigeria. Its charter credits the Digital Economic Development Initiative (DIGITECO). Public authorities keep their legal powers.",
    "is-nigeriastack-the-same-organization-as-india-stack": "NigeriaStack and India Stack are separate initiatives. Each operates within its own legal and institutional setting.",
    "are-nigeriastack-rfcs-and-its-institutional-charter-governed-by-the-same-approval-status": "The charter has been ratified. Each RFC has its own approval status, which you can check in the specification registry.",
    "does-nigeriastack-take-over-or-centralize-government-master-databases": "Public institutions keep their official records and decide who can access them. NigeriaStack publishes rules their systems can use to share permitted data.",
    "does-nigeriastack-operate-as-a-payment-processor-or-treasury": "Licensed payment providers and the responsible treasuries handle settlement. NigeriaStack publishes SplitDirect (NS-RFC-009), which describes how public funds may be routed.",
    "how-does-sureevidence-support-trustworthy-digital-records": "SureEvidence (NS-RFC-005) describes how to check who issued a record, whether it has changed and where it came from. The authority receiving the record decides whether to accept it.",
    "what-does-clearam-provide-for-data-consent-and-revocation": "ClearAm (NS-RFC-006) sets out how systems record what a person agreed to share, why and for how long. It also describes how systems communicate consent withdrawal.",
    "does-the-nigeriastack-atlas-cover-all-774-lgas": "The Atlas lists 768 local government areas across the states and six area councils in the Federal Capital Territory. Each profile identifies the council and lists any evidence that its services are running.",
    "how-does-nigeriastack-address-interoperability-across-32-industries": "Use the industry directory to see which organisations need to exchange data and which standards may help. Each profile shows what has been assessed and what remains unverified.",
    "what-can-developers-verify-through-the-interoperability-test-bed": "You can check whether a sample document matches its SHA-256 digest and download an unsigned result. Live testing, signature verification and certification require different checks.",
    "how-do-nigeriastack-specifications-accommodate-citizens-without-smartphones": "The offline and council specifications describe ways to offer assisted access and work with limited connectivity. Ask the institution responsible for the service which options it offers.",
    "can-institutions-contribute-to-nigeriastack-standards-and-documentation": "Choose the Working Group for your topic. Prepare and download a draft proposal, correction or concern. If the group lists a verified submission channel, use it to send your draft.",
    "can-developers-reuse-or-implement-nigeriastack-specifications": "You can reuse the specifications under CC0 1.0. Check the licence for any software, data or other material you want to reuse.",
    "does-mentioning-a-nigerian-technology-provider-imply-endorsement": "Provider references point to examples and sources. They carry no recommendation or procurement preference.",
    "can-nigeriastack-agent-delegation-tools-authorize-changes-to-official-records": "The institution responsible for an official record decides who can change it. GivePower (NS-RFC-008) describes how to limit what an agent can do and require a person’s approval.",
}

WORKING_GROUPS = {
    "wg-01": {
        "title": "Architecture and reliable data exchange",
        "remit": "How systems exchange messages and recover when it is unclear whether a request went through.",
        "examples": "Topics include signing messages, interrupted exchanges and safe retries.",
        "rfcs": ("NS-RFC-001", "NS-RFC-002", "NS-RFC-003"),
    },
    "wg-02": {
        "title": "Digital evidence and legal records",
        "remit": "How to trace a digital record and identify the version of a legal text.",
        "examples": "Topics include record issuers, document history and legal citations.",
        "rfcs": ("NS-RFC-005", "NS-RFC-013"),
    },
    "wg-03": {
        "title": "Consent, privacy and public revenue",
        "remit": "How systems record consent and route public funds under applicable rules.",
        "examples": "Topics include data access, consent withdrawal and public payment routing.",
        "rfcs": ("NS-RFC-006", "NS-RFC-009", "NS-RFC-014"),
    },
    "wg-04": {
        "title": "Commerce, logistics and agriculture",
        "remit": "How businesses share catalogues, orders and delivery records.",
        "examples": "Topics include stalled orders, duplicate data entry and incompatible records.",
        "rfcs": ("NS-RFC-007", "NS-RFC-010", "NS-RFC-012"),
    },
    "wg-05": {
        "title": "Local registries, offline services and health",
        "remit": "How local services keep records usable when connections are unreliable.",
        "examples": "Topics include planning a council service or reconciling records after an outage.",
        "rfcs": ("NS-RFC-004", "NS-RFC-011", "NS-RFC-014"),
    },
    "wg-06": {
        "title": "Agent delegation and safety checks",
        "remit": "How organisations decide what agents can do and when a person must approve a change.",
        "examples": "Topics include reviewing an agent’s permissions and deciding when approval is needed.",
        "rfcs": ("NS-RFC-008",),
    },
}

CONTRIBUTION_COPY = {
    "availability": "You can prepare a local draft. A verified submission channel is unavailable.",
    "instructions": "Say what happened, who is affected and what should change. For a specification, include the RFC, revision and relevant clause. Disclose any interests that could affect your proposal.",
    "action": "Download draft",
    "success": "Draft downloaded. It has not been submitted.",
    "disclosure": "Use sample data. Keep personal, customer and payment details out of your draft.",
    "evidence_unavailable": "A public decision record for this group has not been verified.",
}

CHECK_COPY = {
    "scope": "Use sample data. Your browser calculates a SHA-256 digest from the document and compares it with the digest you supply.",
    "input": "Sample JSON",
    "example": "Load a sample",
    "run": "Run the check",
    "download": "Download unsigned result",
    "reference_only": "Read the specification for the requirements. A runnable check for this revision has not been verified.",
}

# Replace the explanatory paragraph following the matching heading. Reference
# links, list controls and legal-source citations are rendered separately.
SECTION_COPY = {
    "/": {
        "open-specifications-and-reference-tooling": "Use NigeriaStack’s specifications, guides and reference checks in your own systems.",
        "decoupled-interoperability-without-centralized-databases": "The responsible institution keeps its official registers. Shared protocols describe how to exchange information that each party is allowed to receive.",
        "core-capability-layer": "Choose a guide based on what you need to do with a record or message.",
        "cryptographic-evidence-sureevidence": "Check a record’s issuer, integrity and history. Open the SureEvidence guide or read NS-RFC-005.",
        "permitted-consent-envelopes-clearam": "Record what can be shared, for which purpose and for how long. Open the ClearAm guide or read NS-RFC-006.",
        "offline-store-and-forward-sync-kioskbase": "Record permitted work during an interruption and reconcile changes when the connection returns. Open the KioskBase guide or read NS-RFC-004.",
        "for-integration-engineers--technical-leads": "Read the specification and check its revision before choosing which references to use.",
        "specification-registry-rfcs": "Find an RFC by title or identifier. The registry shows its source and status.",
        "interactive-conformance-testbed-conformance": "Compare a sample document with its digest in your browser and download the unsigned result.",
        "for-sector-architects--ecosystem-leads": "Start with the industry closest to your work. Check what has been assessed before you choose a standard.",
        "32-industry-interoperability-directory-sectors": "Browse industry profiles, linked specifications and gaps still to be assessed.",
        "institutional-governance-charter-governance": "Read the charter, find who is responsible for a topic and see how to prepare a contribution.",
        "statutory-authority-of-record": "Public authorities keep legal control over their records and registries. Service providers and institutions run their own systems.",
        "vendor-neutrality-and-open-licensing-standards": "Institutions can use the open specifications with a provider of their choice. Check the licence in each source.",
    },
    "/sectors": {
        "filter-by-industry-sector-category": "Filter by sector, gap or maturity. The results show where an assessment is still needed.",
        "keyword--workflow-search-parameters": "Search by industry name or identifier, or try a task such as payments or delivery.",
        "submitting-new-industry-workflow-rfcs": "Describe the workflow, where it breaks and who is affected. Use Governance to prepare a draft for the right Working Group.",
    },
    "/protocols": {
        "capabilities--normative-binding": "SureEvidence describes how to check the issuer, integrity and history of a digital record. The responsible authority decides whether to accept the record.",
        "capabilities--normative-binding-1": "ClearAm defines what a consent record contains, including its purpose, scope, expiry and withdrawal.",
        "capabilities--normative-binding-2": "Confluence describes how services exchange messages. Its safe-retry companion explains what to do when a timeout leaves the outcome unknown.",
        "capabilities--normative-binding-3": "MarketLink describes how independent buyer and seller systems can share catalogues and exchange orders.",
        "capabilities--normative-binding-4": "GivePower describes how to limit what an agent may do and record when a person must approve a change.",
        "capabilities--normative-binding-5": "KioskBase describes how to keep records available during a network interruption and reconcile changes when a connection returns.",
        "capabilities--normative-binding-6": "LawTree describes a structured form for legal texts so readers can identify the provision and version they are using.",
    },
    "/rfcs": {
        "filter-by-identifier-category-or-stage": "Enter an exact RFC identifier or search by topic. Filter by approval status, or choose core specifications or archive profiles.",
    },
    "/conformance": {
        "in-browser-schema-validation-client-side-wasm": "Compare the supplied SHA-256 digest with one calculated from the sample document in your browser.",
        "live-sandbox-endpoint-verification-beckn-async-pattern": "This page offers the browser check. A live testing service has not been verified.",
        "cryptographic-evidence-checks-sureevidence--ns-rfc-001": "Read NS-RFC-005 for SureEvidence requirements. This page compares a sample document and its digest.",
        "consent--revocation-envelopes-clearam--ns-rfc-002": "Read NS-RFC-006 for consent and revocation requirements. The sample digest check does not assess them.",
        "idempotency--treasury-routing-confluence--ns-rfc-003--ns-rfc-009": "Read NS-RFC-003 for safe retries and NS-RFC-009 for treasury routing.",
        "delegated-authority-guardrails-givepower--ns-rfc-008": "Read NS-RFC-008 for agent permissions and human approval requirements.",
        "load-verified-synthetic-examples": "Load the sample or paste sample JSON with a document and supplied digest.",
        "configure-custom-node-url-and-handshake-keys": "The local check needs a sample document and digest. It runs without an external connection.",
        "real-time-execution-log-and-rule-assertions": "A match means the browser calculated the digest you supplied. A mismatch means the digests differ.",
        "download-signed-test-receipt-json": "Keep the result as an unsigned JSON file.",
    },
    "/atlas": {
        "coverage-across-36-states-fct-and-774-lgas": "Browse 36 states, the Federal Capital Territory, 768 local government areas and six FCT area councils.",
        "distinguishing-installed-integrations-from-canonical-registry-entries": "Use the directory to identify a place. To check which services are open, read the evidence in its profile and contact the responsible institution.",
    },
    "/governance": {
        "operational-independence-and-purpose": "NigeriaStack publishes open technical specifications and reference checks. Institutions and service providers decide how to implement them in their own systems.",
        "preservation-of-statutory-custody--authority": "The responsible public institutions keep their official registers and public revenues.",
        "specification-licensing-cc0-standard": "The specifications are available under CC0 1.0 for reuse. Check the source for notices attached to software or other material.",
        "vendor-neutrality-and-portability-mandates": "The charter sets out the freedom to leave, inspect the code, audit decisions, take part in governance and reproduce the work.",
        "core-architecture--evidence-working-groups-wg-01--wg-02": "Find the group for message exchange, evidence checks or legal sources.",
        "financial-consent--commerce-working-groups-wg-03--wg-04": "Find the group for data permissions, treasury rules or commerce.",
        "civic-offline--agent-safety-working-groups-wg-05--wg-06": "Find the group for local services, offline records or agent permissions.",
        "submitting-standards-extensions--errata": "Prepare a local draft. Send it through the group’s verified submission channel when one is listed.",
    },
    "/search": {
        "input-parameters-name-topic-specification-id": "Search by name, topic or identifier. Try AMAC, safe retries or NS-RFC-004.",
        "suggesting-new-index-entries--content-contributions": "Use Governance to draft a correction or suggest a missing source.",
    },
    "/atlas/states": {
        "distinguishing-registry-coverage-from-deployed-systems": "The listed state services have yet to be assessed. You can still look up directory records and their sources.",
    },
    "/atlas/lga-774": {
        "verifiable-legal-sources-for-naming-variations": "Each profile cites the source for the council’s name and lists other names where the source verifies them.",
    },
    "/protocols/lga-governance-stack": {
        "fourth-schedule-mandate--sccv3432024-direct-treasury-routing": "The candidate specification describes how a council could run a service. Where money is involved, the separate treasury rules apply. The implementing authority keeps responsibility for the service and its records.",
        "35-kb-progressive-web-shell--ussd-fallbacks": "The modules describe ways to work offline and offer assisted access. Ask the responsible institution which services and access options it offers.",
    },
}

# Adopted presentation text for admitted protocol guides and collection children.
# Each route, identifier and source binding is a separate field.
GUIDE_COPY = {
    "/protocols/sure-evidence": {
        "h1": "SureEvidence for digital records",
        "lead": "Check who issued a digital record, where it came from and whether it has changed. The receiving authority decides whether to accept it.",
        "rfcs": ("NS-RFC-005",),
    },
    "/protocols/clearam-consent": {
        "h1": "ClearAm for consent and revocation",
        "lead": "Record what a person agreed to share, why and for how long. Tell receiving systems when consent is withdrawn.",
        "rfcs": ("NS-RFC-006",),
    },
    "/protocols/confluence-gateway": {
        "h1": "Confluence for message exchange and safe retries",
        "lead": "Send signed messages between services. If a request times out, check what happened before retrying.",
        "rfcs": ("NS-RFC-002", "NS-RFC-003"),
    },
    "/protocols/marketlink-commerce": {
        "h1": "MarketLink for catalogues and orders",
        "lead": "Let buyers and sellers exchange catalogues, orders and updates between their own systems.",
        "rfcs": ("NS-RFC-007",),
    },
    "/protocols/givepower-agents": {
        "h1": "GivePower for agent permissions and approval",
        "lead": "Set what a software agent can do and which changes a person must approve.",
        "rfcs": ("NS-RFC-008",),
    },
    "/protocols/kioskbase-registries": {
        "h1": "KioskBase for offline records",
        "lead": "Keep working with permitted records when the network goes down. Reconcile changes once the connection returns.",
        "rfcs": ("NS-RFC-004",),
    },
    "/protocols/lawtree-ast": {
        "h1": "LawTree for structured legal text",
        "lead": "Use a format software can read while keeping each legal provision linked to the right version of its source.",
        "rfcs": ("NS-RFC-013",),
    },
}

SECONDARY_COPY = {
    "/search": {
        "h1": "Search NigeriaStack",
        "lead": "Find a specification, industry, guide, state or council by name, topic or identifier.",
        "title": "Search specifications, industries and places | NigeriaStack",
        "description": "Find NigeriaStack specifications, guides, industry profiles, states and councils by name, topic or identifier.",
    },
    "/atlas/states": {
        "h1": "Browse states and the FCT",
        "lead": "Find a state or the Federal Capital Territory. Open its profile to see councils and evidence about local services.",
        "title": "State and Federal Capital Territory directory | NigeriaStack Atlas",
        "description": "Find states and the Federal Capital Territory, browse their council lists and check evidence about public services.",
    },
    "/atlas/lga-774": {
        "h1": "Browse local government areas and area councils",
        "lead": "Look up a council by name. If several share the same name, filter by state or territory.",
        "title": "Local government and area council directory | NigeriaStack Atlas",
        "description": "Find a local government area or FCT area council. Check its name and sources in the directory record.",
    },
    "/protocols/lga-governance-stack": {
        "h1": "Municipal Governance Stack",
        "lead": "Browse proposed ways to run local council services. Open a module to see what it covers and who would operate it.",
        "title": "Municipal workflow specifications | NigeriaStack",
        "description": "Read candidate specifications for council workflows, including service requests, permits, payments and assisted access.",
    },
}

RFC_STATUS_COPY = {
    "core": "Candidate standard",
    "extended": "Archive profile",
    "extended_scope": "This archive profile has no verified approval status or Working Group assignment. Browse the registry for current specifications.",
}
