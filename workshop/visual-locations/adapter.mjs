/* Reusable Visual Locations adapter v1. No dependencies, no game-specific rules. */
export function createVisualLocations(scene, onChange = () => {}) {
  if (!scene || scene.format !== 'game-graphics-visual-locations' || scene.version !== 1 || !Array.isArray(scene.locations)) throw Error('Unsupported visual locations export');
  const locations = new Map();
  const validId = id => typeof id === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(id);
  const rect = z => z && z.type === 'rectangle' && [z.x,z.y,z.width,z.height].every(Number.isFinite) && z.width > 0 && z.height > 0;
  if (!Number.isSafeInteger(scene.canvas?.width) || !Number.isSafeInteger(scene.canvas?.height) || scene.canvas.width < 100 || scene.canvas.height < 100 || scene.canvas.width > 4096 || scene.canvas.height > 4096) throw Error('Invalid canvas');
  for (const location of scene.locations) {
    if (!validId(location.id) || locations.has(location.id) || !Array.isArray(location.choices) || !location.choices.length) throw Error('Invalid or duplicate location');
    if (location.touchZone && (!rect(location.touchZone) || location.touchZone.x < 0 || location.touchZone.y < 0 || location.touchZone.x + location.touchZone.width > scene.canvas.width || location.touchZone.y + location.touchZone.height > scene.canvas.height)) throw Error('Invalid touch zone');
    const choices = new Map();
    for (const choice of location.choices) {
      if (!validId(choice.id) || choices.has(choice.id) || !Array.isArray(choice.appearances) || !choice.appearances.length) throw Error('Invalid or duplicate choice');
      const appearances = new Map();
      for (const appearance of choice.appearances) {
        if (!validId(appearance.id) || appearances.has(appearance.id) || typeof appearance.asset !== 'string' || !/^(?!\/)(?!.*\.\.)(?:[\w-]+\/)*[\w.-]+\.webp$/i.test(appearance.asset) || ![appearance.x,appearance.y,appearance.width,appearance.height,appearance.rotation,appearance.layer].every(Number.isFinite) || appearance.width <= 0 || appearance.height <= 0 || appearance.x < 0 || appearance.y < 0 || appearance.x > scene.canvas.width || appearance.y > scene.canvas.height || !Number.isSafeInteger(appearance.layer)) throw Error('Invalid appearance');
        appearances.set(appearance.id, Object.freeze({...appearance}));
      }
      choices.set(choice.id, appearances);
    }
    locations.set(location.id, {source:location,choices,selected:null});
  }
  const api = {
    canvas: Object.freeze({...scene.canvas}),
    ids: () => [...locations.keys()],
    getAppearance(locationId, choiceId, appearanceId) { return locations.get(locationId)?.choices.get(choiceId)?.get(appearanceId) ?? null; },
    select(locationId, choiceId = null, appearanceId = null) {
      const location = locations.get(locationId);
      if (!location) throw Error('Unknown location: '+locationId);
      if (choiceId === null && appearanceId === null) location.selected = null;
      else {
        const appearance = api.getAppearance(locationId,choiceId,appearanceId);
        if (!appearance) throw Error('Unknown choice or appearance at '+locationId);
        location.selected = {choiceId,appearanceId};
      }
      onChange(locationId, api.current(locationId));
      return api.current(locationId);
    },
    current(locationId) {
      const location = locations.get(locationId);
      if (!location) throw Error('Unknown location: '+locationId);
      const s = location.selected;
      return s ? api.getAppearance(locationId,s.choiceId,s.appearanceId) : null;
    },
    visible() {
      return [...locations].flatMap(([id,l]) => l.selected ? [{locationId:id,choiceId:l.selected.choiceId,appearanceId:l.selected.appearanceId,...api.current(id)}] : []).sort((a,b)=>a.layer-b.layer);
    },
    hitTest(x,y) {
      if (![x,y].every(Number.isFinite)) return [];
      return [...locations].filter(([,l])=>{const z=l.source.touchZone;return z && x>=z.x && x<=z.x+z.width && y>=z.y && y<=z.y+z.height}).map(([id,l])=>({locationId:id,action:l.source.action||''}));
    }
  };
  return api;
}
