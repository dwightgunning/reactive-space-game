import { combineLatest, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, scan, sampleTime, startWith, timestamp,  } from 'rxjs/operators';

import { canvas, drawTriangle } from './canvas'
import { HERO_Y, SCORE_INCREASE, SHOOTING_SPEED } from './constants';
import { isCollision } from './utils';
import { ScoreSubject$ } from './scores';

const playerFiring$ = merge(
    fromEvent(canvas, 'click'),
    fromEvent(document, 'keydown').pipe(filter(evt => evt.keyCode === 32))
  )
  .pipe(
    startWith({}),
    sampleTime(200),
    timestamp()
  );

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

const HeroShots$ = combineLatest(
  playerFiring$,
  SpaceShip$, 
  (shotEvents, spaceShip) => ({
    timestamp: shotEvents.timestamp,
    x: spaceShip.x
  }))
  .pipe(
    distinctUntilChanged((prevShot, currShot) => prevShot.timestamp === currShot.timestamp),
    scan(
      (shotArray, shot) => {
        shotArray.push({
          x: shot.x,
          y: HERO_Y
        });
        return shotArray;
      },
      []
    )
  );

function paintHeroShots(heroShots, enemies) {
  heroShots.forEach((shot, i) => {
    for (let l = 0; l < enemies.length; l++) {
      const enemy = enemies[l];
      if (!enemy.isDead && isCollision(shot, enemy)) {
        ScoreSubject$.next(SCORE_INCREASE);
        enemy.isDead = true;
        shot.x = shot.y = -100;
        break;
      }
    }
    shot.y -= SHOOTING_SPEED;
    drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
  });
}

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, '#ff0000', 'up');
}


export { paintHeroShots, playerFiring$, HeroShots$, paintSpaceShip, SpaceShip$ }

