# Space Invaders - Modern Edition

A modern take on the classic Space Invaders game with custom SVG graphics and enhanced visual effects.

## Features

- **Custom Hand-Drawn SVG Graphics**: All game objects are created with custom SVG shapes
- **Pixel-Based Destructible Shields**: Minecraft-style damage system where shields erode pixel by pixel
- **Dynamic Difficulty**: Aliens speed up as you destroy them, with carefully balanced acceleration
- **Power-Up System**: Destroy UFOs for temporary triple-shot power
- **Modern Visual Effects**: 
  - Glowing neon aesthetics
  - Particle explosions
  - Screen shake effects
  - Blinking star background with nebulas
- **Pause Functionality**: Press 'P' to pause the game
- **Progressive Levels**: Different alien patterns and increased difficulty each level

## Controls

- **Arrow Keys**: Move left/right
- **Space**: Shoot
- **P**: Pause/Resume

## How to Play

1. Open `index.html` in a modern web browser
2. Or run a local server: `python3 -m http.server 8000`
3. Navigate to `http://localhost:8000`

## Technologies

- Phaser.js 3.70.0
- Custom SVG graphics
- Pure JavaScript

## Game Mechanics

- 3 lives per game
- Invincibility period after being hit (2 seconds with blinking effect)
- Shields have pixel-based damage with 3 health per pixel
- Alien bullets do more shield damage than player bullets
- UFO appears periodically with mystery score (50-300 points)
- Speed increases exponentially as aliens are destroyed (2% faster per kill)

Enjoy the game!