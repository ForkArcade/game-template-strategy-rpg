# Strategy RPG — Game Design Prompt

You are creating a Strategy RPG game for the ForkArcade platform. The game uses multi-file architecture with the FA engine.

## File Architecture

```
forkarcade-sdk.js   — PLATFORM: SDK (scoring, auth) (do not modify)
fa-narrative.js     — PLATFORM: narrative module (do not modify)
sprites.js          — generated from _sprites.json (do not modify manually)
fa-engine.js        — ENGINE (from template): game loop, event bus, state, registry (do not modify)
fa-renderer.js      — ENGINE (from template): canvas, layers, draw helpers (do not modify)
fa-input.js         — ENGINE (from template): keyboard/mouse, keybindings (do not modify)
fa-audio.js         — ENGINE (from template): Web Audio, sounds (do not modify)
data.js             — GAME DATA: definitions of units, abilities, terrain, battles
game.js             — GAME LOGIC: battle setup, turns, combat, AI
render.js           — RENDERING: hex/grid, units, UI panel, overlay
main.js             — ENTRY POINT: keybindings, wiring, ForkArcade.onReady
```

**You only modify: `data.js`, `game.js`, `render.js`, `main.js`.**

## Key Mechanics

### Combat System
- Turn-based: player phase → enemy phase
- Grid-based (hex or square)
- Each unit: HP, ATK, DEF, SPD, range, move
- Terrain modifiers: forest (+DEF), mountain (blocked), water (impassable)

### Units
- Classes: Warrior (tank), Archer (range), Mage (AOE), Healer (support)
- Each class has 2 unique abilities
- Defined in registry as data

### Progression
- Series of battles (chapters)
- Difficulty scaling: more enemies, new types

### Win/Lose
- Win: destroy castle / defeat all enemies
- Lose: all players defeated
- End → `ForkArcade.submitScore()`

## Scoring
```
score = (chapters * 1000) + (kills * 10) + (survived * 500) - (turns * 5)
```

## How to Add Content (data.js)

### New Unit Type
```js
FA.register('unitTypes', 'paladin', {
  name: 'Paladin', char: 'P',
  hp: 35, atk: 8, def: 10, spd: 2,
  range: 1, move: 2,
  abilities: ['holyStrike', 'divineShield']
});
```

### New Ability
```js
FA.register('abilities', 'holyStrike', {
  name: 'Holy Strike',
  targetType: 'enemy',
  range: 1,
  effect: function(attacker, target, state) {
    var dmg = attacker.atk + 5 - target.def;
    target.hp -= Math.max(1, dmg);
    return { msg: 'Holy Strike!', color: '#ff0' };
  }
});
```

### New Terrain
```js
FA.register('terrain', 'swamp', {
  name: 'Swamp', color: '#4a6a3a',
  moveCost: 2, defBonus: 0.8
});
```

### New Battle
```js
FA.register('battles', 2, {
  name: 'Forest Stronghold',
  enemyTypes: ['warrior', 'archer', 'mage', 'warrior'],
  castlePos: { col: 7, row: 0 },
  terrainBias: { forest: 0.25, water: 0.05 }
});
```

## Event Bus — Key Events

| Event | Payload | When |
|-------|---------|-------|
| `input:click` | `{ x, y }` | Click on canvas |
| `input:action` | `{ action, key }` | Action key |
| `entity:damaged` | `{ entity, damage, attacker }` | Damage dealt |
| `entity:killed` | `{ entity, killer }` | Unit defeated |
| `turn:player` | `{}` | Player turn |
| `turn:enemy` | `{}` | Enemy turn |
| `battle:end` | `{ victory }` | Battle end |
| `game:over` | `{ victory, score }` | Game over |
| `message` | `{ text, color }` | Floating message |

## Rendering (render.js)

Use layer system and FA.draw helpers:
```js
FA.addLayer('grid', function(ctx) {
  // draw hex grid — FA.draw.hex(cx, cy, size, fill, stroke)
}, 0);

FA.addLayer('units', function(ctx) {
  // draw units — FA.draw.sprite + FA.draw.bar (HP)
}, 10);

FA.addLayer('highlights', function(ctx) {
  // reachable tiles, attack targets
}, 5);

FA.addLayer('ui', function(ctx) {
  // side panel with stats, action buttons
}, 30);
```

## Hex Math (game.js)
```js
function hexToPixel(col, row) { /* offset coords → pixel */ }
function pixelToHex(px, py) { /* pixel → offset coords */ }
function hexDistance(c1, r1, c2, r2) { /* cube distance */ }
function hexNeighbors(col, row) { /* 6 neighbors */ }
```

## Narrative

Use `FA.narrative` (from engine):
```js
FA.narrative.init({
  startNode: 'chapter-1',
  variables: { morale: 5, battles_won: 0, casualties: 0 },
  graph: { nodes: [...], edges: [...] }
});

FA.narrative.transition('chapter-2', 'Advancing to Forest Stronghold');
FA.narrative.setVar('morale', 7, 'Victory boost');
```

Node types: `scene`, `choice`, `condition`.

## Sprites

Use `create_sprite` and `get_asset_guide`. Integration:
```js
FA.draw.sprite('units', 'warrior', x - size, y - size, size * 2, 'W', '#44c')
```

## What to Avoid
- Drag & drop inventory
- Cutscenes — short texts before battle
- Modifying ENGINE files (fa-*.js)
- Focus on: select unit → move → attack → next turn
