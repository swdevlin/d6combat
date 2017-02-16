var combat = require('./combat.js');
var fs = require('fs');

var neutralDie =  [combat.BOTCH, combat.BLOCK, combat.BLOCK, combat.STRIKE, combat.STRIKE, combat.NEUTRAL_CRIT];
var offenseDie =  [combat.BOTCH, combat.BLANK, combat.BLANK, combat.STRIKE, combat.STRIKE, combat.STRIKE_CRIT];
var defenseDie =  [combat.BOTCH, combat.BLOCK, combat.BLOCK, combat.BLANK,  combat.BLANK,  combat.BLOCK_CRIT];
var woundDie =    [combat.BOTCH, combat.DROP,  combat.BLANK, combat.BLANK,  combat.BLANK,  combat.BLANK];
var fatigueDie =  [combat.DROP,  combat.DROP,  combat.BLANK, combat.BLANK,  combat.BLANK,  combat.BLANK];

var dice = [];
var diceId = '';
var dump = false;
process.argv.forEach(function (val, index, array) {
  if (index > 1 && val != 'dump')
    diceId += val;
  switch (val) {
    case 'o': dice.push(offenseDie); break;
    case 'd': dice.push(defenseDie); break;
    case 'n': dice.push(neutralDie); break;
    case 'w': dice.push(woundDie); break;
    case 'f': dice.push(fatigueDie); break;
    case 'dump': dump = true; break;
  }
});

var results = {};
var netResults = {};
combat.determineResults('', 0, dice, results, netResults);
console.log("d6 Dice,", diceId);
console.log("Botch %," + combat.botchPercent(netResults));
console.log("Crit %," + combat.critPercent(netResults));
console.log("Total permutations," + combat.totalPermutations(netResults));
var s = '';
if (dump)
  Object.keys(netResults).sort().forEach(function(v, i) {
    console.log("'" + v + "'," + netResults[v]);
  });
