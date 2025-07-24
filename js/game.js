// Space Invaders with modern effects
class SpaceInvaders extends Phaser.Scene {
    constructor() {
        super({ key: 'SpaceInvaders' });
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.alienDirection = 1;
        this.alienSpeed = 100;
        this.lastAlienShotTime = 0;
        this.alienShotDelay = 2000;
        this.gameOver = false;
        this.ufoActive = false;
        this.lastUfoTime = 0;
        this.powerUpActive = false;
        this.powerUpTime = 0;
        this.isPaused = false;
        this.pauseText = null;
        this.baseAlienSpeed = 800; // Base delay between moves
        this.alienMoveTimer = null;
    }

    preload() {
        // Convert SVGs to textures
        this.createTextureFromSVG('player', SVGShapes.playerShip);
        this.createTextureFromSVG('alien1', SVGShapes.alien1);
        this.createTextureFromSVG('alien2', SVGShapes.alien2);
        this.createTextureFromSVG('alien3', SVGShapes.alien3);
        this.createTextureFromSVG('ufo', SVGShapes.ufo);
        this.createTextureFromSVG('playerBullet', SVGShapes.playerBullet);
        this.createTextureFromSVG('alienBullet', SVGShapes.alienBullet);
        this.createTextureFromSVG('explosion', SVGShapes.explosion);
        this.createTextureFromSVG('shield', SVGShapes.shield);
    }

    createTextureFromSVG(key, svgString) {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.load.image(key, url);
    }

    create() {
        // Background with stars
        this.createStarfield();

        // Create player
        this.player = this.physics.add.sprite(400, 550, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setData('invincible', false);
        
        // Blinking effect for player
        this.tweens.add({
            targets: this.player,
            alpha: { from: 1, to: 0.7 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Create alien grid
        this.aliens = this.physics.add.group();
        this.createAlienGrid();

        // Create shields with new pixel-based system
        this.shields = [];
        this.createShields();

        // Create bullets groups
        this.playerBullets = this.physics.add.group();
        this.alienBullets = this.physics.add.group();

        // Create UFO
        this.ufo = this.physics.add.sprite(-100, 50, 'ufo');
        this.ufo.setVisible(false);
        this.ufo.setActive(false);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // UI
        this.createUI();

        // Collisions
        this.setupCollisions();

        // Particles
        this.createParticleEmitters();

        // Start alien movement with dynamic speed
        this.startAlienMovement();

        // Start UFO spawning
        this.time.addEvent({
            delay: 20000,
            callback: this.spawnUFO,
            callbackScope: this,
            loop: true
        });
    }

    createStarfield() {
        const graphics = this.add.graphics();
        
        // Create blinking stars
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff);
            
            this.tweens.add({
                targets: star,
                alpha: { from: 1, to: 0.2 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }

        // Add nebula effect
        const nebula = this.add.graphics();
        nebula.fillStyle(0x0066ff, 0.1);
        nebula.fillCircle(200, 100, 150);
        nebula.fillStyle(0xff0066, 0.1);
        nebula.fillCircle(600, 200, 120);
    }

    createAlienGrid() {
        const alienTypes = ['alien3', 'alien2', 'alien2', 'alien1', 'alien1'];
        const points = [40, 20, 20, 10, 10];
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const x = 80 + col * 60;
                const y = 100 + row * 45;
                const alien = this.aliens.create(x, y, alienTypes[row]);
                alien.points = points[row];
                alien.row = row;
                
                // Pulsing effect
                this.tweens.add({
                    targets: alien,
                    scaleX: { from: 1, to: 1.1 },
                    scaleY: { from: 1, to: 1.1 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    delay: row * 100 + col * 50
                });

                // Color tint animation
                this.tweens.add({
                    targets: alien,
                    tint: { from: 0xffffff, to: 0xff00ff },
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    delay: row * 200
                });
            }
        }
    }

    createShields() {
        const positions = [150, 300, 450, 600];
        
        positions.forEach(x => {
            const shield = new Shield(this, x, 450);
            this.shields.push(shield);
        });
    }

    createUI() {
        const style = { 
            font: '20px Courier New', 
            fill: '#00ff00',
            stroke: '#004400',
            strokeThickness: 2
        };
        
        this.scoreText = this.add.text(10, 10, 'SCORE: 0', style);
        this.livesText = this.add.text(10, 40, 'LIVES: 3', style);
        this.levelText = this.add.text(700, 10, 'LEVEL: 1', style);
        
        // Make UI elements blink
        [this.scoreText, this.livesText, this.levelText].forEach(text => {
            this.tweens.add({
                targets: text,
                alpha: { from: 1, to: 0.6 },
                duration: 2000,
                yoyo: true,
                repeat: -1
            });
        });
    }

    createParticleEmitters() {
        // Create particle configuration for explosions
        this.explosionEmitter = this.add.particles(0, 0, 'explosion', {
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            speed: { min: 100, max: 200 },
            lifespan: 500,
            quantity: 5
        });
        this.explosionEmitter.stop();
    }

    setupCollisions() {
        // Player bullets hit aliens
        this.physics.add.overlap(this.playerBullets, this.aliens, this.hitAlien, null, this);
        
        // Player bullets hit UFO
        this.physics.add.overlap(this.playerBullets, this.ufo, this.hitUFO, null, this);
        
        // Alien bullets hit player
        this.physics.add.overlap(this.alienBullets, this.player, this.hitPlayer, null, this);
        
        // Note: Shield collisions are now handled in update()
        
        // Aliens reach player
        this.physics.add.overlap(this.aliens, this.player, this.alienReachPlayer, null, this);
    }

    update(time, delta) {
        if (this.gameOver) return;
        
        // Pause handling
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.togglePause();
        }
        
        if (this.isPaused) return;

        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // Player shooting
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.playerShoot();
        }

        // Alien shooting
        if (time > this.lastAlienShotTime + this.alienShotDelay) {
            this.alienShoot();
            this.lastAlienShotTime = time;
        }

        // Update bullets
        this.updateBullets();
        
        // Check bullet-shield collisions
        this.checkBulletShieldCollisions();
        
        // Check alien-shield collisions
        this.checkAlienShieldCollisions();

        // Update UFO
        if (this.ufo.active) {
            if (this.ufo.x > 850) {
                this.ufo.setActive(false);
                this.ufo.setVisible(false);
            }
        }

        // Check for level complete
        if (this.aliens.countActive() === 0) {
            this.nextLevel();
        }

        // Power-up timer
        if (this.powerUpActive && time > this.powerUpTime + 5000) {
            this.powerUpActive = false;
        }
    }

    startAlienMovement() {
        if (this.alienMoveTimer) {
            this.alienMoveTimer.remove();
        }
        
        const totalAliens = 55; // 5 rows * 11 columns
        const remainingAliens = this.aliens.countActive();
        const killedAliens = totalAliens - remainingAliens;
        
        // Calculate speed: starts at baseAlienSpeed, decreases as aliens are killed
        // But with a gentler curve to avoid too fast movement
        const speedMultiplier = Math.pow(0.98, killedAliens); // 2% faster per kill
        const currentDelay = Math.max(100, this.baseAlienSpeed * speedMultiplier);
        
        this.alienMoveTimer = this.time.addEvent({
            delay: currentDelay,
            callback: this.moveAliens,
            callbackScope: this,
            loop: true
        });
    }
    
    moveAliens() {
        if (this.isPaused || this.gameOver) return;
        
        let hitEdge = false;
        
        this.aliens.children.entries.forEach(alien => {
            if (alien.active) {
                alien.x += this.alienDirection * 20;
                
                if (alien.x <= 30 || alien.x >= 770) {
                    hitEdge = true;
                }
            }
        });

        if (hitEdge) {
            this.alienDirection *= -1;
            this.aliens.children.entries.forEach(alien => {
                if (alien.active) {
                    alien.y += 20;
                }
            });
        }
    }

    playerShoot() {
        const bullet = this.playerBullets.create(this.player.x, this.player.y - 20, 'playerBullet');
        bullet.setVelocityY(-500);
        
        // Add glow effect to bullet
        this.tweens.add({
            targets: bullet,
            scaleX: { from: 1, to: 1.5 },
            scaleY: { from: 1, to: 1.5 },
            alpha: { from: 1, to: 0.5 },
            duration: 200,
            yoyo: true,
            repeat: -1
        });

        // Double shot if powered up
        if (this.powerUpActive) {
            const bullet2 = this.playerBullets.create(this.player.x - 15, this.player.y - 20, 'playerBullet');
            const bullet3 = this.playerBullets.create(this.player.x + 15, this.player.y - 20, 'playerBullet');
            bullet2.setVelocityY(-500);
            bullet3.setVelocityY(-500);
        }
    }

    alienShoot() {
        const activeAliens = this.aliens.children.entries.filter(alien => alien.active);
        if (activeAliens.length > 0) {
            const shooter = Phaser.Utils.Array.GetRandom(activeAliens);
            const bullet = this.alienBullets.create(shooter.x, shooter.y + 20, 'alienBullet');
            bullet.setVelocityY(200);
            
            // Zigzag movement
            this.tweens.add({
                targets: bullet,
                x: { from: bullet.x - 20, to: bullet.x + 20 },
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }

    updateBullets() {
        // Remove off-screen bullets
        this.playerBullets.children.entries.forEach(bullet => {
            if (bullet.y < -10) {
                bullet.destroy();
            }
        });

        this.alienBullets.children.entries.forEach(bullet => {
            if (bullet.y > 610) {
                bullet.destroy();
            }
        });
    }

    hitAlien(bullet, alien) {
        // Create explosion
        this.explosionEmitter.emitParticleAt(alien.x, alien.y);
        
        // Screen shake
        this.cameras.main.shake(100, 0.005);
        
        // Flash effect
        this.cameras.main.flash(100, 255, 255, 255, false);
        
        bullet.destroy();
        alien.destroy();
        
        this.score += alien.points;
        this.scoreText.setText('SCORE: ' + this.score);
        
        // Restart alien movement with new speed
        this.startAlienMovement();
    }

    hitUFO(bullet, ufo) {
        bullet.destroy();
        
        // Big explosion for UFO
        for (let i = 0; i < 10; i++) {
            this.time.delayedCall(i * 50, () => {
                this.explosionEmitter.emitParticleAt(
                    ufo.x + Phaser.Math.Between(-20, 20),
                    ufo.y + Phaser.Math.Between(-10, 10)
                );
            });
        }
        
        this.cameras.main.shake(300, 0.01);
        
        // Mystery score
        const mysteryScore = Phaser.Math.Between(50, 300);
        this.score += mysteryScore;
        this.scoreText.setText('SCORE: ' + this.score);
        
        // Show bonus text
        const bonusText = this.add.text(ufo.x, ufo.y, mysteryScore, {
            font: '30px Courier New',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 3
        });
        
        this.tweens.add({
            targets: bonusText,
            y: bonusText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => bonusText.destroy()
        });
        
        ufo.setActive(false);
        ufo.setVisible(false);
        ufo.x = -100;
        
        // Grant power-up
        this.powerUpActive = true;
        this.powerUpTime = this.time.now;
        
        // Visual feedback for power-up
        this.player.setTint(0x00ffff);
        this.time.delayedCall(5000, () => {
            this.player.clearTint();
        });
    }

    hitPlayer(bullet, player) {
        // Check if player is already invincible
        if (player.getData('invincible')) {
            bullet.destroy();
            return;
        }
        
        bullet.destroy();
        
        this.explosionEmitter.emitParticleAt(player.x, player.y);
        this.cameras.main.shake(300, 0.01);
        this.cameras.main.flash(200, 255, 0, 0, false);
        
        this.lives--;
        this.livesText.setText('LIVES: ' + this.lives);
        
        if (this.lives <= 0) {
            this.gameOverSequence();
        } else {
            // Set invincibility
            player.setData('invincible', true);
            player.setAlpha(0.5);
            player.setTint(0xff0000);
            
            // Blinking effect during invincibility
            const blinkTween = this.tweens.add({
                targets: player,
                alpha: { from: 0.2, to: 0.8 },
                duration: 100,
                yoyo: true,
                repeat: 19 // Blink for 2 seconds
            });
            
            this.time.delayedCall(2000, () => {
                player.setData('invincible', false);
                player.setAlpha(1);
                player.clearTint();
                blinkTween.stop();
            });
        }
    }

    checkBulletShieldCollisions() {
        // Check player bullets
        this.playerBullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            for (let i = this.shields.length - 1; i >= 0; i--) {
                const shield = this.shields[i];
                const collision = shield.checkCollision(bullet.x, bullet.y, 5);
                
                if (collision.hit) {
                    bullet.destroy();
                    shield.damage(collision.row, collision.col, 2);
                    
                    // Remove destroyed shields
                    if (shield.isDestroyed()) {
                        shield.destroy();
                        this.shields.splice(i, 1);
                    }
                    break;
                }
            }
        });
        
        // Check alien bullets
        this.alienBullets.children.entries.forEach(bullet => {
            if (!bullet.active) return;
            
            for (let i = this.shields.length - 1; i >= 0; i--) {
                const shield = this.shields[i];
                const collision = shield.checkCollision(bullet.x, bullet.y, 5);
                
                if (collision.hit) {
                    bullet.destroy();
                    shield.damage(collision.row, collision.col, 3); // Alien bullets do more damage
                    
                    // Remove destroyed shields
                    if (shield.isDestroyed()) {
                        shield.destroy();
                        this.shields.splice(i, 1);
                    }
                    break;
                }
            }
        });
    }
    
    checkAlienShieldCollisions() {
        // Check each alien against shields
        this.aliens.children.entries.forEach(alien => {
            if (!alien.active) return;
            
            for (let i = this.shields.length - 1; i >= 0; i--) {
                const shield = this.shields[i];
                // Aliens are about 40x40, so use radius 20
                const collision = shield.checkCollision(alien.x, alien.y, 20);
                
                if (collision.hit) {
                    // Alien carves through shield like a knife
                    shield.damage(collision.row, collision.col, 4); // Large damage radius
                    
                    // Create carving effect - damage multiple times in a line
                    for (let j = 0; j < 3; j++) {
                        const extraRow = collision.row + j;
                        if (extraRow < shield.pixels.length) {
                            shield.damage(extraRow, collision.col, 3);
                        }
                    }
                    
                    // Remove destroyed shields
                    if (shield.isDestroyed()) {
                        shield.destroy();
                        this.shields.splice(i, 1);
                    }
                }
            }
        });
    }

    alienReachPlayer(alien, player) {
        this.gameOverSequence();
    }

    spawnUFO() {
        if (!this.ufo.active && !this.gameOver) {
            this.ufo.setActive(true);
            this.ufo.setVisible(true);
            this.ufo.x = -100;
            this.ufo.setVelocityX(150);
            
            // UFO sound effect visualization
            const ring = this.add.circle(this.ufo.x, this.ufo.y, 30, 0xff0000, 0);
            ring.setStrokeStyle(2, 0xff0000);
            
            this.tweens.add({
                targets: ring,
                scaleX: 3,
                scaleY: 3,
                alpha: 0,
                duration: 1000,
                repeat: -1,
                onUpdate: () => {
                    ring.x = this.ufo.x;
                    ring.y = this.ufo.y;
                },
                onComplete: () => ring.destroy()
            });
        }
    }

    nextLevel() {
        // Stop alien movement during transition
        if (this.alienMoveTimer) {
            this.alienMoveTimer.remove();
        }
        
        this.level++;
        this.levelText.setText('LEVEL: ' + this.level);
        
        // Level complete effect
        const levelText = this.add.text(400, 300, 'LEVEL ' + this.level, {
            font: '60px Courier New',
            fill: '#00ff00',
            stroke: '#ffffff',
            strokeThickness: 4
        });
        levelText.setOrigin(0.5);
        
        this.tweens.add({
            targets: levelText,
            scaleX: { from: 0, to: 1.5 },
            scaleY: { from: 0, to: 1.5 },
            alpha: { from: 1, to: 0 },
            duration: 2000,
            onComplete: () => levelText.destroy()
        });
        
        // Reset and upgrade
        this.baseAlienSpeed = Math.max(200, 800 - this.level * 100); // Faster base speed each level
        this.alienShotDelay = Math.max(500, 2000 - this.level * 200);
        
        this.time.delayedCall(2000, () => {
            // Clear any remaining aliens before creating new ones
            this.aliens.clear(true, true);
            
            if (this.level >= 2) {
                this.createAdvancedAlienGrid();
            } else {
                this.createAlienGrid();
            }
            
            // Destroy old shields
            this.shields.forEach(shield => shield.destroy());
            this.shields = [];
            this.createShields();
            
            // Restart alien movement
            this.startAlienMovement();
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.physics.pause();
            
            // Show pause text
            this.pauseText = this.add.text(400, 300, 'PAUSED', {
                font: '60px Courier New',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            });
            this.pauseText.setOrigin(0.5);
            
            const instructionText = this.add.text(400, 360, 'Press P to Resume', {
                font: '20px Courier New',
                fill: '#ffffff'
            });
            instructionText.setOrigin(0.5);
            
            this.pauseText.setData('instruction', instructionText);
        } else {
            this.physics.resume();
            
            // Remove pause text
            if (this.pauseText) {
                this.pauseText.destroy();
                this.pauseText.getData('instruction').destroy();
                this.pauseText = null;
            }
        }
    }
    
    createAdvancedAlienGrid() {
        // Mix of different alien types for higher levels
        const patterns = [
            ['alien3', 'alien2', 'alien3', 'alien2', 'alien3', 'alien2', 'alien3', 'alien2', 'alien3', 'alien2', 'alien3'],
            ['alien2', 'alien1', 'alien2', 'alien1', 'alien2', 'alien1', 'alien2', 'alien1', 'alien2', 'alien1', 'alien2'],
            ['alien1', 'alien3', 'alien1', 'alien3', 'alien1', 'alien3', 'alien1', 'alien3', 'alien1', 'alien3', 'alien1'],
            ['alien3', 'alien3', 'alien2', 'alien2', 'alien1', 'alien1', 'alien1', 'alien2', 'alien2', 'alien3', 'alien3'],
            ['alien2', 'alien2', 'alien1', 'alien1', 'alien3', 'alien3', 'alien3', 'alien1', 'alien1', 'alien2', 'alien2']
        ];
        
        const points = { 'alien1': 10, 'alien2': 20, 'alien3': 40 };
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const x = 80 + col * 60;
                const y = 100 + row * 45;
                const alienType = patterns[row][col];
                const alien = this.aliens.create(x, y, alienType);
                alien.points = points[alienType];
                alien.row = row;
                
                // Enhanced pulsing effect for level 2+
                this.tweens.add({
                    targets: alien,
                    scaleX: { from: 1, to: 1.2 },
                    scaleY: { from: 1, to: 1.2 },
                    duration: 600,
                    yoyo: true,
                    repeat: -1,
                    delay: row * 50 + col * 25
                });

                // Rotating tint animation
                this.tweens.add({
                    targets: alien,
                    tint: { from: 0xffffff, to: Phaser.Math.Between(0xff00ff, 0x00ffff) },
                    duration: 1500,
                    yoyo: true,
                    repeat: -1,
                    delay: row * 100 + col * 50
                });
            }
        }
    }
    
    gameOverSequence() {
        this.gameOver = true;
        
        // Stop alien movement
        if (this.alienMoveTimer) {
            this.alienMoveTimer.remove();
        }
        
        // Stop all movement
        this.physics.pause();
        
        // Game over text
        const gameOverText = this.add.text(400, 250, 'GAME OVER', {
            font: '80px Courier New',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 6
        });
        gameOverText.setOrigin(0.5);
        
        const finalScore = this.add.text(400, 350, 'FINAL SCORE: ' + this.score, {
            font: '40px Courier New',
            fill: '#00ff00',
            stroke: '#ffffff',
            strokeThickness: 3
        });
        finalScore.setOrigin(0.5);
        
        // Blinking effect
        this.tweens.add({
            targets: [gameOverText, finalScore],
            alpha: { from: 1, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Restart prompt
        const restartText = this.add.text(400, 450, 'PRESS SPACE TO RESTART', {
            font: '20px Courier New',
            fill: '#ffffff'
        });
        restartText.setOrigin(0.5);
        
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.restart();
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: SpaceInvaders
};

// Create game
const game = new Phaser.Game(config);