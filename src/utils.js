function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min - 1)) + min;
}

function isCollision(target1, target2) {
  return (
    target1.x > target2.x - 20 &&
    target1.x < target2.x + 20 &&
    (target1.y > target2.y - 20 && target1.y < target2.y + 20)
  );
}

export { getRandomInt, isCollision };