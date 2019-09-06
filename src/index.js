import { combineLatest } from 'rxjs';
import { sampleTime, takeWhile } from 'rxjs/operators';

import { SPEED } from './constants';
import { getRandomInt, isCollision } from './utils';
import { paintStars, StarStream$ } from './scene';
import { paintHeroShots, paintSpaceShip, SpaceShip$, HeroShots$ } from './hero';
import { paintScore, score, ScoreSubject$ } from './scores';
import { Enemies$, paintEnemies } from './enemies';

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintEnemies(actors.enemies);
  paintHeroShots(actors.heroShots, actors.enemies);
  paintScore(actors.score);
}

function gameOver(ship, enemies) {
  return enemies.some(enemy => {
    if (!enemy.isDead && isCollision(ship, enemy)) {
      return true;
    }
    return enemy.shots.some(shot => isCollision(ship, shot));
  })
}

const Game = combineLatest(
  StarStream$,
  SpaceShip$,
  Enemies$,
  HeroShots$,
  score,
  (stars, spaceship, enemies, heroShots, score) => ({
    stars, spaceship, enemies, heroShots, score
  }))
    .pipe(
      sampleTime(SPEED),
      takeWhile(actors => gameOver(actors.spaceship, actors.enemies) === false)
    ).subscribe(renderScene);
