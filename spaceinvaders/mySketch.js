

// Global variables
let spaceshipImg, invaderImg, bulletImg;
let spaceship, bullets, invaders;
let invaderSpeed = 3, bulletSpeed = 7;
let score = 0, lives = 3;

function preload() {
  // Load images
  spaceshipImg = loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user375318/visual1885786/h82e2af80b142bba21d0f9c973efe9843/spaceship.png');
  invaderImg = loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user375318/visual1885786/h82e2af80b142bba21d0f9c973efe9843/invader.png');
  bulletImg = loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user375318/visual1885786/h82e2af80b142bba21d0f9c973efe9843/bulletlaser.png');
	bgImg = loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user375318/visual1885786/h82e2af80b142bba21d0f9c973efe9843/backgroundp.png'); 
}
// Import collide2d library
scriptsrc="https://cdn.jsdelivr.net/gh/bmoren/p5.collide2D/p5.collide2d.min.js";

function setup() {
  createCanvas(600, 400);
  // Create spaceship
  spaceship = new Spaceship(spaceshipImg);
  // Create bullets array
  bullets = [];
  // Create invaders array
  invaders = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      invaders.push(new Invader(i * 80 + 80, j * 50 + 50, invaderImg));
    }
  }
}

function draw() {
  background(bgImg); // Use background image
  // Draw score and lives
  textSize(20);
  fill(255);
  text('Score: ' + score, 10, 30);
  text('Lives: ' + lives, width - 80, 30);
  // Move spaceship with mouse
  spaceship.move(mouseX);
  // Draw spaceship
  spaceship.show();
  // Draw bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].show();
    bullets[i].move();
    // Remove bullet if off screen
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    } else {
      // Check for bullet-invader collision
      for (let j = invaders.length - 1; j >= 0; j--) {
        if (bullets[i].hits(invaders[j])) {
          bullets.splice(i, 1);
          invaders.splice(j, 1);
          score += 10;
          break;
        }
      }
    }
  }
  // Draw invaders
  for (let i = 0; i < invaders.length; i++) {
    invaders[i].show();
    invaders[i].move(invaderSpeed);
    // Check for invader-spaceship collision
    if (invaders[i].hits(spaceship)) {
      lives--;
      invaders.splice(i, 1);
      if (lives === 0) {
        gameOver('You Lose!');
      }
    }
  }
  // Check for game win
  if (invaders.length === 0) {
    gameOver('You Win!');
  }
}

function mousePressed() {
  // Shoot bullet when mouse is pressed
  bullets.push(new Bullet(spaceship.x + spaceship.w / 2, spaceship.y, bulletImg, bulletSpeed));
}

function mouseReleased() {
  // Stop shooting on left click release
  if (mouseButton === LEFT) {
    // Do nothing
  }
}

function gameOver(msg) {
  textSize(50);
  fill(255);
  textAlign(CENTER, CENTER);
  text(msg, width / 2, height / 2);
  noLoop();
}

class Spaceship {
  constructor(img) {
    this.img = img;
    this.w = 50;
    this.h = 50;
    this.x = width / 2 - this.w / 2;
    this.y = height - this.h;
  }

  move(x) {
    this.x = constrain(x - this.w / 2, 0, width - this.w);
  }

   show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}

class Invader {
  constructor(x, y, img) {
    this.img = img;
    this.w = 30;
    this.h = 30;
    this.x = x;
    this.y = y;
    this.direction = 1;
  }

  move(speed) {
    this.x += this.direction * speed;
    if (this.x + this.w > width || this.x < 0) {
      this.direction *= -1;
      this.y += this.h;
    }
  }

  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }

  hits(other) {
    return collideRectRect(this.x, this.y, this.w, this.h, other.x, other.y, other.w, other.h);
  }
}

class Bullet {
  constructor(x, y, img, speed) {
    this.img = img;
    this.w = 10;
    this.h = 20;
    this.x = x - this.w / 2;
    this.y = y - this.h;
    this.speed = speed;
  }

  move() {
    this.y -= this.speed;
  }

  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }

  hits(other) {
    return collideRectRect(this.x, this.y, this.w, this.h, other.x, other.y, other.w, other.h);
  }
}
