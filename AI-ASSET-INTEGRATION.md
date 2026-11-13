# Game Integration — AI Reference for Sprite Factory Assets

**Audience:** Development chats for Little Field Farm, Farpoint Rift, or other games. Begin with [AI-START-HERE.md](AI-START-HERE.md) and read the relevant tool reference. This is an integration contract, not a claim that any specific game already supports the outputs.

## Choose the minimal asset pipeline
| Game need | Preparation | Files to retain / deliver |
| --- | --- | --- |
| Static character/item | Sprite Factory → Sprite | Original source + transparent WebP |
| Full-screen scenery | Sprite Factory → Background | Original source + sized WebP |
| Full illustration | Sprite Factory → Standard Image | Original source + WebP |
| Cockpit overlay/partial exterior | Sprite Factory → Scene Graphics | Original source + WebP, verify transparency if needed |
| Existing horizontal pose strip | Sprite Factory → Sprite Sheet | Original source + static WebP strip |
| Separate animation frames | Animation Studio | Editable animation project + WebP strip + matching animation JSON |
| Clickable scene | Scene Editor | Editable scene project + placement JSON + separate image assets |
| Reusable scene choices/stages | Scene Editor visual locations | Editable scene project + visual locations JSON + separate WebP assets |

## Integration checklist
1. Confirm target game's logical canvas dimensions, rendering library, desired alpha/cropping, asset naming and location. Do not assume one game's settings apply to another.
2. Choose a documented processing mode. For animation, decide whether game needs metadata JSON or already knows strip layout.
3. Preserve editable masters and source images. Exported placement JSON is **not** an editable Scene Editor project.
4. Copy exported WebP files into the game; replace placeholder paths in scene JSON. No Workshop export automatically installs images or implements actions in the game.
5. For scene placement, center-anchor sprites; use logical scene coordinates; convert degrees to radians where required. Map interaction keys to game behavior. Keep hotspots invisible in gameplay.
6. For animation, use the JSON's frame size/count/FPS and matching strip; validate dimensions.
7. Test in the target game on intended devices; isolated PixiJS/Phaser acceptance is not evidence of successful integration in every game.

## Missing capability protocol
When a requested game feature exceeds documented capabilities, **do not pretend the tool supports it**. Propose a reusable enhancement to Sprite Factory or its Workshop tools, specifying: missing operation, expected use across projects, minimal viable implementation, risks to existing modes, and acceptance test. Ask for approval before coding. If enhancement is not justified, recommend the simplest alternative. After a tested change, update the affected AI reference and production status.

## Authoritative contracts
- [Scene placement and animation metadata](workshop/EXPORT-CONTRACT-v1.md)
- [Visual locations](workshop/VISUAL-LOCATIONS-CONTRACT-v1.md)
- [Production status / known verification gaps](PROJECT-STATUS-AND-HISTORY.md)
