# Animation Studio — AI Capability Reference

**Production UI:** `workshop/animation-studio/index.html`. **Purpose:** Assemble individual frame images into a consistent horizontal animation strip with game-readable metadata.

## Workflow
1. Import individual frames and align/center them on a shared canvas.
2. Set frame dimensions and playback FPS; preview motion.
3. Save the **editable animation project** for later changes (`game-graphics-workshop-animation`, version 1).
4. Choose **Prepare WebP and JSON**, then download the **WebP strip** and **JSON metadata** separately. Keep the matching pair.
5. Test playback in Engine Verification or the target game.

## Game-facing export
See [export contract](workshop/EXPORT-CONTRACT-v1.md). JSON root `format: "game-graphics-animation"`, `version: 1`; includes `asset`, `frameWidth`, `frameHeight`, `frameCount`, `fps`, `layout: "horizontal"`, and `loop`.

- The WebP is a **static horizontal strip**, not a self-playing animated file.
- Frame `i` occupies `[i * frameWidth, 0, frameWidth, frameHeight]`.
- Validate `frameCount * frameWidth === image width` and `frameHeight === image height`; use the matching JSON and WebP from the same export.
- Documented cell sizes: 128/256/512; total strip width <= 4096.
- The project JSON is for editing; the animation JSON is for game playback. Do not interchange them.

## Verification
Animation Studio WebP/JSON export and playback in isolated PixiJS v8 and Phaser 3 tests were accepted on iPad. This does not imply a particular game has a built-in importer. Browser encoding fallback may need internet. See [AI entry point](AI-START-HERE.md).
