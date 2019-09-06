import { BehaviorSubject } from 'rxjs';
import { scan } from 'rxjs/operators';

import { ctx } from './canvas';

function paintScore(score) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`Score: ${score}`, 40, 43);
}

const ScoreSubject$ = new BehaviorSubject(0);
const score = ScoreSubject$.pipe(scan((prev, cur) => prev + cur, 0));

export { paintScore, score, ScoreSubject$ };