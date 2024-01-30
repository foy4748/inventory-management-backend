function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function returnRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

module.exports = { randomIntFromInterval, returnRandomItem };
