// Pixel-based destructible shields system
class Shield {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.pixelSize = 4;
        this.width = 80;
        this.height = 60;
        this.pixels = [];
        this.graphics = scene.add.graphics();
        
        // Create shield pattern (pixel map)
        this.pattern = [
            "00000111111111111111100000",
            "00011111111111111111111000",
            "00111111111111111111111100",
            "01111111111111111111111110",
            "11111111111111111111111111",
            "11111111111111111111111111",
            "11111111111111111111111111",
            "11111111111111111111111111",
            "11111111111111111111111111",
            "11111111111111111111111111",
            "11111111100000000111111111",
            "11111111000000000011111111",
            "11111110000000000001111111",
            "11111110000000000001111111",
            "11111110000000000001111111"
        ];
        
        this.createPixels();
        this.draw();
    }
    
    createPixels() {
        // Initialize pixel array based on pattern
        for (let row = 0; row < this.pattern.length; row++) {
            this.pixels[row] = [];
            for (let col = 0; col < this.pattern[row].length; col++) {
                if (this.pattern[row][col] === '1') {
                    this.pixels[row][col] = {
                        exists: true,
                        health: 3, // Each pixel can take 3 hits
                        color: 0x00ff00
                    };
                } else {
                    this.pixels[row][col] = { exists: false };
                }
            }
        }
    }
    
    draw() {
        this.graphics.clear();
        
        for (let row = 0; row < this.pixels.length; row++) {
            for (let col = 0; col < this.pixels[row].length; col++) {
                const pixel = this.pixels[row][col];
                if (pixel.exists) {
                    // Color based on health
                    let color;
                    if (pixel.health === 3) color = 0x00ff00;
                    else if (pixel.health === 2) color = 0xffff00;
                    else color = 0xff6600;
                    
                    const pixelX = this.x + col * this.pixelSize - (this.pixels[0].length * this.pixelSize) / 2;
                    const pixelY = this.y + row * this.pixelSize - (this.pixels.length * this.pixelSize) / 2;
                    
                    this.graphics.fillStyle(color, 1);
                    this.graphics.fillRect(pixelX, pixelY, this.pixelSize, this.pixelSize);
                }
            }
        }
    }
    
    checkCollision(x, y, radius = 10) {
        // Convert world coordinates to pixel coordinates
        const startCol = Math.floor((x - radius - (this.x - (this.pixels[0].length * this.pixelSize) / 2)) / this.pixelSize);
        const endCol = Math.ceil((x + radius - (this.x - (this.pixels[0].length * this.pixelSize) / 2)) / this.pixelSize);
        const startRow = Math.floor((y - radius - (this.y - (this.pixels.length * this.pixelSize) / 2)) / this.pixelSize);
        const endRow = Math.ceil((y + radius - (this.y - (this.pixels.length * this.pixelSize) / 2)) / this.pixelSize);
        
        // Check bounds
        const minCol = Math.max(0, startCol);
        const maxCol = Math.min(this.pixels[0].length - 1, endCol);
        const minRow = Math.max(0, startRow);
        const maxRow = Math.min(this.pixels.length - 1, endRow);
        
        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                if (this.pixels[row] && this.pixels[row][col] && this.pixels[row][col].exists) {
                    const pixelX = this.x + col * this.pixelSize - (this.pixels[0].length * this.pixelSize) / 2 + this.pixelSize/2;
                    const pixelY = this.y + row * this.pixelSize - (this.pixels.length * this.pixelSize) / 2 + this.pixelSize/2;
                    
                    const dist = Math.sqrt((x - pixelX) ** 2 + (y - pixelY) ** 2);
                    if (dist < radius + this.pixelSize/2) {
                        return { hit: true, row, col };
                    }
                }
            }
        }
        
        return { hit: false };
    }
    
    damage(row, col, damageRadius = 2) {
        // Damage pixel and surrounding area
        const startRow = Math.max(0, row - damageRadius);
        const endRow = Math.min(this.pixels.length - 1, row + damageRadius);
        const startCol = Math.max(0, col - damageRadius);
        const endCol = Math.min(this.pixels[0].length - 1, col + damageRadius);
        
        let damaged = false;
        
        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                const distance = Math.sqrt((r - row) ** 2 + (c - col) ** 2);
                if (distance <= damageRadius && this.pixels[r][c].exists) {
                    // Damage falls off with distance
                    const damage = Math.ceil((damageRadius - distance + 1));
                    this.pixels[r][c].health -= damage;
                    
                    if (this.pixels[r][c].health <= 0) {
                        this.pixels[r][c].exists = false;
                        this.createDebris(r, c);
                    }
                    damaged = true;
                }
            }
        }
        
        if (damaged) {
            this.draw();
        }
        
        return damaged;
    }
    
    createDebris(row, col) {
        // Create falling pixel debris
        const pixelX = this.x + col * this.pixelSize - (this.pixels[0].length * this.pixelSize) / 2;
        const pixelY = this.y + row * this.pixelSize - (this.pixels.length * this.pixelSize) / 2;
        
        const debris = this.scene.add.rectangle(pixelX, pixelY, this.pixelSize, this.pixelSize, 0x00ff00);
        
        this.scene.tweens.add({
            targets: debris,
            y: debris.y + 50,
            x: debris.x + Phaser.Math.Between(-20, 20),
            alpha: 0,
            rotation: Phaser.Math.Between(0, 6),
            duration: 500,
            onComplete: () => debris.destroy()
        });
    }
    
    isDestroyed() {
        // Check if shield is completely destroyed
        for (let row = 0; row < this.pixels.length; row++) {
            for (let col = 0; col < this.pixels[row].length; col++) {
                if (this.pixels[row][col].exists) {
                    return false;
                }
            }
        }
        return true;
    }
    
    destroy() {
        this.graphics.destroy();
    }
}