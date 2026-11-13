# Sprite Factory — AI Capability Reference

**Scope:** Root `index.html`, `app.js`, `style.css` on `main`. This is an image **processing** tool, not an image generator. Import PNG/JPEG/WebP; prepare and verify WebP output in the browser. See [AI entry point](AI-START-HERE.md).

## Current five graphic types
| Mode | Input / controls | Output / behavior | Important boundaries |
| --- | --- | --- | --- |
| **Sprite** | Individual image; white or selected-color background removal, tolerance, optional enclosed-area removal, edge softening, auto crop/subject coverage; presets 64/128/256/512/1024 or custom | Transparent WebP with optional centered/resized subject | Extraction can remove legitimate pale details. Dimensions 1–4096 per axis; inspect alpha and halos. |
| **Background** | Scenery; landscape 1280×720, 1920×1080, 1024×768; portrait 360×640, 720×1280, 1080×1920; tall 720×2560; or custom | Opaque scenery WebP; fills frame without stretching, cropping excess | Crop notice is geometric estimate. Vertical scrolling preview reveals joins but does **not** repair seams or change export. |
| **Sprite Sheet** | One horizontal source row; 2–16 frames; cell 128/256/512; stationary/moving alignment; equal-width, experimental smart-boundary, or experimental connected-character extraction | One horizontal WebP strip of equally sized transparent frames | Strip width max 4096. Not a self-playing animated WebP and no atlas JSON from this mode. Diagnostics do not alter processing. Smart/components may reject sources; complex/touching artwork may fail. |
| **Standard Image** | Illustration; maximum dimension 512/1024/2048/4096; WebP quality 60–100% | WebP retaining original image proportions and full composition | No background removal or cropping. Inspect output and file size; quality is a control, not a guaranteed byte size. |
| **Scene Graphics** | Cockpit overlays, partial-height exterior views; optional selected-color transparency and tolerance; original dimensions, 1024×768, 1024×384, 1280×480, custom; contain/cover | WebP preserving proportions unless cover cropping is selected; transparency optional | Do not confuse with **Scene Editor**. The mode prepares an image; it does not place objects or create hotspots. Verify alpha and WebP download in target Safari. |

**Source confirmation:** The five modes and controls above appear in production `index.html` (build label 2026-11-10). Earlier README text listing only three modes is outdated. Processing semantics should be checked against current `app.js` before implementation changes or exact edge-case claims.

## Processing and integration rules
- Prepare source artwork externally; Sprite Factory does not create the illustration.
- Preview the output and download the WebP. Do not rename a PNG as WebP.
- Browser WebP encoding can require a network-loaded fallback; offline export is **not guaranteed**.
- Scene graphics and transparent sprites may be consumed by Scene Editor, but Sprite Factory itself does not generate scene placement JSON.
- Sprite Sheet is a static strip. For a WebP strip **plus** `game-graphics-animation` metadata, use Animation Studio.
- For current implementation details, inspect `app.js`; for historical tested extraction behavior see [README](README.md) and [production history](PROJECT-STATUS-AND-HISTORY.md).
- Treat the November Scene Graphics/Standard Image additions as present in source, not automatically proven by every previous October acceptance test.
