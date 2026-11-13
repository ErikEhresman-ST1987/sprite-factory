# Sprite Factory — AI Entry Point

**Audience:** AI development chats working on Sprite Factory or consuming its assets. **Production source:** `main` in `ErikEhresman-ST1987/sprite-factory`. **Workshop:** https://erikehresman-st1987.github.io/sprite-factory/workshop/

## Mandatory startup procedure
1. Identify the requested task: image preparation, scene composition, animation, game integration, or enhancement.
2. Read the relevant current tool reference: [Sprite Factory](AI-SPRITE-FACTORY.md), [Scene Editor](AI-SCENE-EDITOR.md), [Animation Studio](AI-ANIMATION-STUDIO.md), and/or [Game integration](AI-ASSET-INTEGRATION.md).
3. For code changes or disputed details, inspect production source on `main`; code is authoritative for implementation. Check [Production status](PROJECT-STATUS-AND-HISTORY.md) for accepted decisions and outstanding verification.
4. Distinguish **implemented**, **user-tested**, **experimental**, **unverified**, and **proposed**. Never equate a documented design or historical branch with a deployed feature.
5. Do not assume that reading a GitHub URL automatically loads its content into another chat. In another project, explicitly fetch this entry point and the relevant linked references.

## Capability verification and enhancement rule
- **Supported:** Use the documented workflow and confirm its constraints.
- **Not supported but potentially useful:** Clearly identify the missing capability and propose a reusable Sprite Factory enhancement. Explain the friction removed, beneficiaries across projects, smallest useful increment, risks, and verification needed.
- **Not supported and not worthwhile:** Recommend a simpler existing workflow or alternative.
- **Never invent a capability, imply a proposal already works, or silently modify the app.** Obtain user approval before implementing changes. After implementation and testing, update this reference and the relevant tool documentation.
- Prefer reusable, function-first improvements to one-off features; preserve existing working behavior and iPad Safari usability.

## Documentation ownership
- **Human instructions belong inside each tool's interface.** Do not create or expand external human manuals as the default.
- **Repository Markdown is written for AI consumption:** inputs, transformations, outputs, file contracts, limitations, acceptance status, and code locations.
- Existing documents are supporting references, not competing entry points. Older README development status and historical branch notes may be stale; check current production.
- For changes to the documentation or code, keep this index and the affected capability reference consistent.

## Tool selection
| Need | Tool |
| --- | --- |
| Remove background from individual artwork; resize; convert to WebP | Sprite Factory — Sprite |
| Fill/crop game scenery to a target canvas | Sprite Factory — Background |
| Convert a horizontal pose image to a horizontal frame strip | Sprite Factory — Sprite Sheet |
| Preserve illustration without cropping/background removal | Sprite Factory — Standard Image |
| Make partial-height scenery/cockpit/window overlays with optional transparency | Sprite Factory — Scene Graphics |
| Place assets, define hotspots and interaction zones, save editable scene | Scene Editor |
| Assemble individual animation frames and matching metadata | Animation Studio |
| Test exports in an isolated PixiJS/Phaser harness | Engine Verification |

## Safety of changes
Use the current `main` implementation, inspect the affected files and regression guidance, propose a bounded increment, and verify before claiming acceptance. Do not merge historical branches wholesale or overwrite working code from older documentation.
