// Lightweight source-contract regression checks. No npm packages or browser required.
// Run: node --test tests/workshop-contract.test.mjs
// These checks catch accidental format/path drift; they DO NOT replace iPad engine tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const scene = read('workshop/scene-editor/index.html');
const animation = read('workshop/animation-studio/index.html');
const verify = read('workshop/engine-verification/index.html');
const home = read('workshop/index.html');
const workflow = read('workshop/WORKFLOW.md');
const contract = read('workshop/EXPORT-CONTRACT-v1.md');

test('scene export retains versioned placement JSON and separate editable project', () => {
  assert.match(scene, /format:'game-graphics-placement',version:1/);
  assert.match(scene, /format:'game-graphics-workshop-scene',version:4/);
  assert.match(scene, /a\.download='game-placement\.json'/);
  assert.match(scene, /hotspots:hotspots\.map\(h=>\(\{\.\.\.h,type:'rectangle'\}\)\)/);
  assert.match(scene, /touchZone:\{type:'rectangle',\.\.\.zone\(o\)\}/);
});
test('hotspots have stable IDs, names, actions, and export guardrails', () => {
  assert.match(scene, /'hotspot_'\+nextHotspotId\+\+/);
  assert.match(scene, /!h\.name\.trim\(\)\|\|!h\.action\.trim\(\)/);
  assert.match(scene, /hotspots\.length>=100/);
});
test('animation exports a separate WebP strip and versioned JSON metadata', () => {
  assert.match(animation, /format:'game-graphics-animation',version:1/);
  for (const key of ['frameWidth:size','frameHeight:size','frameCount:count','layout:\'horizontal\'','loop:true']) {
    assert.ok(animation.includes(key), 'Missing animation metadata: '+key);
  }
  assert.match(animation, /'RIFF'/);
  assert.match(animation, /'WEBP'/);
  assert.match(animation, /downloadWebp/);
  assert.match(animation, /downloadJson/);
});
test('both engines support background artwork and invisible hotspots', () => {
  assert.match(verify, /id="sceneBackground"/);
  assert.match(verify, /Missing scene background/);
  assert.match(verify, /new PIXI\.Sprite\(PIXI\.Texture\.from\(backgroundImage\)\)/);
  assert.match(verify, /this\.textures\.addCanvas\('scene-background',bc\)/);
  assert.match(verify, /PixiJS invisible hotspot/);
  assert.match(verify, /Phaser invisible hotspot/);
  assert.match(verify, /Missing scene image:/);
});
test('home and documentation link the full toolchain', () => {
  for (const path of ['scene-editor/index.html','animation-studio/index.html','engine-verification/index.html','WORKFLOW.md']) {
    assert.ok(home.includes(path), 'Missing Workshop Home link: '+path);
  }
  assert.match(workflow, /workshop-scene\.json/);
  assert.match(workflow, /game-placement\.json/);
  assert.match(contract, /game-graphics-placement/);
  assert.match(contract, /game-graphics-animation/);
});


test('visual locations have independent editor controls and versioned game export', () => {
  for (const id of ['vlAddLocation','vlAddChoice','vlAddAppearance','vlLocationId','vlChoiceId','vlAppearanceId','vlImage','vlAsset','vlExport']) assert.ok(scene.includes('id="'+id+'"'), 'Missing '+id);
  assert.match(scene, /format:'game-graphics-visual-locations',version:1/);
  assert.match(scene, /a\.download=name/);
  assert.match(scene, /function vlValid\(\)/);
  assert.match(scene, /function vlHit\(p\)/);
  assert.match(scene, /version:4,visualLocations:/);
  assert.match(scene, /\[1,2,3,4\]\.includes\(data\.version\)/);
  assert.match(scene, /const incomingHotspots=data\.version>=3/);
});
