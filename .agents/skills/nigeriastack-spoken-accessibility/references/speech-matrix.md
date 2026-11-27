# Spoken journey matrix

Use the platform's normal screen-reader controls. Record each exact version. If the device speaks too quickly to transcribe, reduce its speech rate and note the setting. Where needed, obtain consent and retain only a redacted transcript or controlled reference. Do not record credentials, device notifications or user records. [GOV.UK assistive technology testing](https://www.gov.uk/service-manual/technology/testing-with-assistive-technologies) · [W3C status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)

| Profile key | Test combination | Input |
| --- | --- | --- |
| `nvda-windows` | NVDA on Windows with Chrome or Firefox | Keyboard, including browse and focus modes where relevant |
| `voiceover-ios` | VoiceOver on iOS with Safari | Touch navigation, including the rotor |
| `talkback-android` | TalkBack on Android with Chrome | Touch gestures and normal focus traversal |

| Case key | Task and expected information |
| --- | --- |
| `home-landmarks` | On Home hear the page title, find the main landmark and H1, and activate a task link after using the skip control where available. Hear the brand's accessible name when using the home link. |
| `search-matches` | Search for AMAC, hear the resulting status, open the council record and use its return link. Confirm that focus stays usable and the query is restored. |
| `search-no-match` | Submit a name that does not exist. Hear the no-match status and recovery guidance while remaining in context. |
| `search-unavailable` | On an authorised test surface make the search index unavailable. Hear that the directory cannot be loaded and find the available navigation or retry. |
| `industry-filters` | Open filters in Industries, set fields and apply. Hear the names of the controls, the result status and the applied state on return from a result. |
| `specification-exact` | Find NS-RFC-001 using the exact search. Hear the result, source reference and status. Return to the exact result list. |
| `working-group-draft` | Open a shared working group anchor, hear the group name and expanded state, then open a draft. Hear the selected group and task, and the local draft confirmation. |
| `faq-disclosure` | Open a shared FAQ link. Hear the question, heading or disclosure state, then the answer. Activate its copy link and listen for confirmation or recovery guidance. |
| `verifier-outcomes` | Submit malformed JSON, run a matching sample and edit it to mismatch. Hear each state, confirm the outdated result is cleared and reach the current unsigned download control. |

Complete the planned matrix unless the approved scope explicitly differs. Record every case that is blocked, including unsupported voice languages or unavailable device combinations. Screen readers may phrase a role or state differently. Judge whether the intended name, purpose and actionable result are communicated. Avoid interpreting a visual status, speech-viewer text alone, synthetic narration or a DOM diff as audible evidence. Scope this matrix to the cited build and tested combinations.
