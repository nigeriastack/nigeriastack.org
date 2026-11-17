# GitHub access boundary and remediation — 17 November 2026

The connected `nigeriastack` identity reports admin/push/read permissions on `nigeriastack/nigeriastack.org`. An actual create-reference operation for `repair/corrected-p0-p7-v2-1` returned HTTP403 `Resource not accessible by integration`. Remote main was read back at `2083b50267c4fc1af5f41692a96658c37d6b4723`. No remote write succeeded. The six other required repository names return404; their absence cannot be distinguished conclusively from missing installation visibility.

Account ownership, the app installation's selected repositories, the app's declared permissions and the current installation/user token permissions are separate. Account admin metadata is not proof of connector write or administration capability. ChatGPT approval preferences cannot expand provider OAuth scopes. There is no available action here to grant the integration new GitHub administration privileges or create repositories.

## Owner-controlled remediation

1. In ChatGPT Settings → Plugins → GitHub, open repository/account management. Confirm the `nigeriastack` account is selected; do not reconnect an unrelated account.
2. Confirm that the code-writing Codex GitHub integration is installed for that same owner and selected repositories. The standard read-only ChatGPT GitHub integration is not equivalent. Review any pending permission update in GitHub before approving only the required scope.
3. Ensure Contents read/write for commits and refs, Pull requests read/write for review workflows, Actions read for CI results, and workflow editing authority where required for the CI change. Administration write is required only for repository settings/protection/provisioning operations; do not grant unrelated secrets/account access.
4. Create or expose the six named repositories if they are genuinely absent; preserve any existing repositories and histories. Installation repository selection must include each target.
5. After reauthorization, read the current ref, create the approved review branch, read it back, commit a bounded change and read it back, open the authorized PR, and retrieve the CI job results. A metadata-only permission check does not close this issue.
6. Repository protection should require the named quality checks after their first real successful runs. Do not require a nonexistent check or lock the owner out. No protection change is reported as applied by this checkpoint.

No password or token is requested in chat. Earlier secure browser verification did not complete; the current browser session has no retained tabs. Permanent access cannot be guaranteed because account/app permissions and token lifetimes remain under GitHub and account-owner control.

## Sources

- https://docs.github.com/en/enterprise-cloud@latest/rest/using-the-rest-api/troubleshooting-the-rest-api (Resource not accessible / token permissions)
- https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt (installation/account/repository selection and distinction from Codex writing)
- https://help.openai.com/en/articles/20001495-managing-app-permissions-in-chatgpt (approval settings versus provider permissions)

## No execution deadlock

Access blocks only remote writes, repository creation and hosted CI. Continue source reconciliation, local tests, source exports and durable checkpoints. Use bounded command timeouts, explicit BLOCKED states and dependency tracking. Do not retry authentication indefinitely, substitute another account, bypass security controls or mark a blocked check as passed.

## Resolved installation gap — current continuation

The owner completed GitHub Mobile verification and explicitly approved installation. GitHub now shows ChatGPT Codex Connector installation183083839 under nigeriastack with only nigeriastack/nigeriastack.org selected. It grants read/write actions, code, issues, pull requests and workflows, and read checks, commit statuses and metadata. The connector now lists the account and successfully created repair/corrected-p0-p7-v2-1; a separate ref readback confirmed2083b50267c4fc1af5f41692a96658c37d6b4723. This closes the write blocker without changing execution environment. The earlier403 entries above are historical evidence. No administration permission was included in this app grant, and no six-repository provisioning or production deployment is inferred.

## Remote writes and merge now verified

The installation now supports code commits, review branches, pull requests, workflow editing and merge for the selected portal. PR #2 merged at 7fd69e72cc53d53977e0962c078637eef7aa35e0, with hosted source/browser/evidence jobs passing in run44178043156. This is verified Work execution without moving to another environment. No administration grant is implied.

The owner browser proved protocol-specifications is private and already contains source/history. Do not infer that the six404s mean repositories are absent, and do not recreate them. The remaining repository grant must explicitly select protocol-specifications, industry-capability-ledger, subnational-readiness-atlas, clearam-consent-templates, conformance-test-bed and joinbody-reference-sdks in addition to the portal. No expansion was saved before the cloud browser disconnected. Preserve private visibility and histories.
