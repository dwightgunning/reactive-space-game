import { interval, range } from 'rxjs';
import { flatMap, map, toArray } from 'rxjs/operators';

import {SPEED, STAR_NUMBER } from './constants';
import { canvas, ctx } from './canvas';

function paintStars(stars) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

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

export { paintStars, StarStream$ };