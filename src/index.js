import { of } from "rxjs";
import { Observable, interval, range} from 'rxjs';
import { toArray, flatMap, map } from 'rxjs/operators';

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
).subscribe(paintStars);
