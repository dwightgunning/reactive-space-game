import { of } from "rxjs";
import { combineLatest, Observable, fromEvent, interval, range} from 'rxjs';
import { toArray, flatMap, map, scan, sampleTime, startWith } from 'rxjs/operators';

// import './hero_1';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function paintStars(stars) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

const SPEED = 40;
const STAR_NUMBER = 250;

const StarStream$ = range(1, STAR_NUMBER).pipe(
  map(() => ({
    x: parseInt(Math.random() * canvas.width, 10),
    y: parseInt(Math.random() * canvas.height, 10),
    size: Math.random() * 3 + 1
  })),
  toArray(),
  flatMap(starArray => interval(SPEED).pipe(
    map(() => {
      starArray.forEach(star => {
        if (star.y >= canvas.height) {
          star.y = 0; // Reset star to top of screen
        }
        star.y += star.size // Move the star
      });

      return starArray;
    })
  ))
);

// hero_1.js
const HERO_Y = canvas.height - 30;

function drawTriangle(x, y, width, color, direction) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width, y);
  ctx.lineTo(x, direction === 'up' ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width, y);
  ctx.fill();
}

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, '#ff0000', 'up');
}

const SpaceShip$ = fromEvent(canvas, 'mousemove').pipe(
  map(event => ({
    x: event.clientX,
    y: HERO_Y
  })),
  startWith({
      x: canvas.width / 2,
      y: HERO_Y
    })
  );

//enemy_1.js

const ENEMY_FREQ = 1500;
const Enemies$ = interval(ENEMY_FREQ).pipe(
  scan(enemyArray => {
    const enemy = {
      x: parseInt(Math.random() * canvas.width, 10),
      y: -30
    }

    enemyArray.push(enemy);
    return enemyArray;
  }, [])
);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min - 1)) + min;
}

function paintEnemies(enemies) {
  enemies.forEach(enemy => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    drawTriangle(enemy.x, enemy.y, 20, "#00ff00", "down");
  })
}
const Game = combineLatest(
  StarStream$,
  SpaceShip$,
  Enemies$,
  (stars, spaceship, enemies) => ({stars, spaceship, enemies})
);

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintEnemies(actors.enemies);
}

Game.pipe(sampleTime(SPEED)).subscribe(renderScene);

// hero_shots.js
// TOOD