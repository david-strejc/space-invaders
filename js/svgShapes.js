// Custom SVG shapes for Space Invaders
const SVGShapes = {
    // Player spaceship - futuristic design
    playerShip: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="shipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#0080ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#004080;stop-opacity:1" />
            </linearGradient>
            <filter id="shipGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g transform="translate(30,30)">
            <path d="M 0,-25 L -15,20 L -8,20 L -5,10 L 5,10 L 8,20 L 15,20 Z" 
                  fill="url(#shipGrad)" stroke="#00ffff" stroke-width="2" filter="url(#shipGlow)"/>
            <circle cx="0" cy="-10" r="3" fill="#ffffff" opacity="0.9"/>
            <path d="M -10,5 L -10,15 L -5,15 L -5,5 Z M 5,5 L 5,15 L 10,15 L 10,5 Z" 
                  fill="#ff3333" opacity="0.8"/>
        </g>
    </svg>`,

    // Alien Type 1 - Classic invader with modern twist
    alien1: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="alien1Grad">
                <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#800080;stop-opacity:1" />
            </radialGradient>
        </defs>
        <g transform="translate(20,20)">
            <path d="M -15,-10 L -15,0 L -10,0 L -10,5 L -5,5 L -5,10 L 5,10 L 5,5 L 10,5 L 10,0 L 15,0 L 15,-10 L 10,-10 L 10,-5 L 5,-5 L 5,-10 L -5,-10 L -5,-5 L -10,-5 L -10,-10 Z" 
                  fill="url(#alien1Grad)" stroke="#ff00ff" stroke-width="1"/>
            <rect x="-10" y="-7" width="4" height="4" fill="#000000"/>
            <rect x="6" y="-7" width="4" height="4" fill="#000000"/>
            <path d="M -5,5 L -2,8 L 2,8 L 5,5" stroke="#ff00ff" stroke-width="2" fill="none"/>
        </g>
    </svg>`,

    // Alien Type 2 - Squid-like alien
    alien2: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="alien2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00ff00;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#008000;stop-opacity:1" />
            </linearGradient>
        </defs>
        <g transform="translate(20,20)">
            <ellipse cx="0" cy="-5" rx="12" ry="10" fill="url(#alien2Grad)" stroke="#00ff00" stroke-width="1"/>
            <path d="M -12,5 Q -10,10 -8,5 Q -6,10 -4,5 Q -2,10 0,5 Q 2,10 4,5 Q 6,10 8,5 Q 10,10 12,5" 
                  stroke="#00ff00" stroke-width="2" fill="none"/>
            <circle cx="-5" cy="-5" r="3" fill="#000000"/>
            <circle cx="5" cy="-5" r="3" fill="#000000"/>
            <circle cx="-5" cy="-5" r="1" fill="#00ff00"/>
            <circle cx="5" cy="-5" r="1" fill="#00ff00"/>
        </g>
    </svg>`,

    // Alien Type 3 - Octopus-like alien
    alien3: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="alien3Grad">
                <stop offset="0%" style="stop-color:#ffff00;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff8800;stop-opacity:1" />
            </radialGradient>
        </defs>
        <g transform="translate(20,20)">
            <circle cx="0" cy="0" r="12" fill="url(#alien3Grad)" stroke="#ffaa00" stroke-width="1"/>
            <path d="M -8,-8 L -12,-12 M 8,-8 L 12,-12 M -10,8 L -14,12 M 10,8 L 14,12" 
                  stroke="#ffaa00" stroke-width="3" stroke-linecap="round"/>
            <ellipse cx="-5" cy="-2" rx="3" ry="5" fill="#000000"/>
            <ellipse cx="5" cy="-2" rx="3" ry="5" fill="#000000"/>
            <path d="M -8,5 Q 0,8 8,5" stroke="#000000" stroke-width="2" fill="none"/>
        </g>
    </svg>`,

    // UFO - Bonus ship
    ufo: `<svg width="60" height="30" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ufoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ff0000;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#660000;stop-opacity:1" />
            </linearGradient>
            <filter id="ufoGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g transform="translate(30,15)">
            <ellipse cx="0" cy="0" rx="25" ry="10" fill="url(#ufoGrad)" stroke="#ff0000" stroke-width="1" filter="url(#ufoGlow)"/>
            <ellipse cx="0" cy="-5" rx="15" ry="8" fill="#333333" opacity="0.8"/>
            <circle cx="-10" cy="0" r="2" fill="#ffff00" opacity="0.9"/>
            <circle cx="0" cy="0" r="2" fill="#ffff00" opacity="0.9"/>
            <circle cx="10" cy="0" r="2" fill="#ffff00" opacity="0.9"/>
        </g>
    </svg>`,

    // Player bullet
    playerBullet: `<svg width="10" height="20" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bulletGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.3" />
            </linearGradient>
        </defs>
        <rect x="3" y="0" width="4" height="18" fill="url(#bulletGrad)" rx="2"/>
        <circle cx="5" cy="2" r="3" fill="#00ffff" opacity="0.8"/>
    </svg>`,

    // Alien bullet
    alienBullet: `<svg width="10" height="20" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="alienBulletGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ff0000;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffff00;stop-opacity:0.3" />
            </linearGradient>
        </defs>
        <path d="M 5,0 L 2,10 L 5,20 L 8,10 Z" fill="url(#alienBulletGrad)" stroke="#ff6600" stroke-width="1"/>
    </svg>`,

    // Explosion particle
    explosion: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="explGrad">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="30%" style="stop-color:#ffff00;stop-opacity:0.8" />
                <stop offset="60%" style="stop-color:#ff6600;stop-opacity:0.5" />
                <stop offset="100%" style="stop-color:#ff0000;stop-opacity:0" />
            </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="25" fill="url(#explGrad)"/>
        <path d="M 30,10 L 35,25 L 50,20 L 40,30 L 50,40 L 35,35 L 30,50 L 25,35 L 10,40 L 20,30 L 10,20 L 25,25 Z" 
              fill="#ffffff" opacity="0.8"/>
    </svg>`,

    // Shield/Barrier
    shield: `<svg width="80" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#00ff00;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#004400;stop-opacity:1" />
            </linearGradient>
            <pattern id="shieldPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="2" height="2" fill="#00ff00"/>
                <rect x="2" y="2" width="2" height="2" fill="#00ff00"/>
            </pattern>
        </defs>
        <path d="M 10,50 L 10,20 Q 10,10 20,10 L 60,10 Q 70,10 70,20 L 70,50 L 50,50 L 50,40 Q 50,30 40,30 Q 30,30 30,40 L 30,50 Z" 
              fill="url(#shieldGrad)" stroke="#00ff00" stroke-width="2"/>
        <rect x="10" y="10" width="60" height="40" fill="url(#shieldPattern)" opacity="0.3"/>
    </svg>`
};