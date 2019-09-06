import { interval} from 'rxjs';
import { scan } from 'rxjs/operators';

import { canvas, drawTriangle, isVisible } from './canvas';
import { ENEMY_FREQ, ENEMY_SHOOTING_FREQ, SHOOTING_SPEED } from './constants';
import { getRandomInt } from './utils';

const Enemies$ = interval(ENEMY_FREQ).pipe(
  scan(enemyArray => {
    const enemy = {
      x: parseInt(Math.random() * canvas.width, 10),
      y: -30,
      shots: []
    }
    
    interval(ENEMY_SHOOTING_FREQ).subscribe(() => {
      if (!enemy.isDead) {
        enemy.shots.push({x: enemy.x, y: enemy.y});
      }
      enemy.shots = enemy.shots.filter(isVisible);
    });

    enemyArray.push(enemy);
    return enemyArray
      .filter(isVisible)
      .filter(enemy => !(enemy.isDead && enemy.shots.length === 0));
  }, [])
);

function paintEnemies(enemies) {
  enemies.forEach(enemy => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    if (!enemy.isDead) {
      drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
    }

    enemy.shots.forEach(shot => {
      shot.y += SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, "#00ffff", 'down')
    });
  })
}

export { Enemies$, paintEnemies };