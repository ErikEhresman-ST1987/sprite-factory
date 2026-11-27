# Game Graphics Workshop — redevelopment feasibility

Status: investigation; no production migration approved.

## Goal
Produce attractive, consistent reusable 2D game graphics in the browser through established tools, kitbashing, procedural construction and AI collaboration. Optimize for iPad. Adopt before developing; adapt before rewriting; retain useful functions. Offline operation is not a requirement. Do not build a general-purpose 3D editor or game engine.

## Baseline
Branch starts from development/foundation-consolidation. Preserve main and existing backup branches. Source inventory inspected 2026-11-27:
- index.html / app.js: sprite, background, sheet, standard image, scene graphics; color key, enclosed removal, edge cleanup, cropping, subject extraction, background scroll preview, WebP.
- workshop/scene-editor/index.html: layering, transforms, hotspots, editable projects, placement JSON, reusable visual locations, choices and appearances, foundation and zone editing.
- workshop/animation-studio/index.html: individual images, alignment, playback, frame navigation, WebP and JSON, editable projects.
- workshop/index.html: independent tool launcher and engine verification entry.
Inventory is preliminary; inspect schemas and baseline tests before replacement.

## Candidates (pending independent code/license/runtime verification)
- Construction: 3D Map Creator, Open World Builder; compare existing placement, import and save functionality.
- Rendering: glb2sprite, Threepipe; assess static transparent output and animation capture.
- Assets: Kenney, Quaternius; verify licenses and compatibility per pack.
- Image editing: miniPaint, Paint Studio; compare against specialized current workflows.
- Animation: glb2sprite and existing frame editors; preserve current frame-based workflows unless demonstrably superseded.
- Scene composition: existing editor, tile/object editors; preserve hotspot and reusable visual-location semantics.

## Acceptance gates
Actual game usefulness, visual quality, repeatability, iPad touch operation, AI-readable definitions, editable save/reopen, acceptable performance, license compatibility, WebP/JSON interoperability and baseline regression checks. Decide retain/enhance/replace/introduce per capability. No engine selected. No production changes until verified.

## First feasibility slice
Review source and licenses of construction and sprite capture candidates. Use an existing modular asset pack to construct a small sci-fi equipment assembly, render it with transparent background, process through existing WebP workflow and place it in an existing scene. Establish whether placement and save/reopen are reliable. Do not build a custom editor before evaluating existing software. Record evidence, failures and decisions. iPad execution requires actual device verification.
