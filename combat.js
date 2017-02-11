var regexEscape = require('./regexescaper');

var BLANK = ' ';
module.exports.BLANK = BLANK;

var DROP = '-';
module.exports.DROP = DROP;

var BOTCH = 'B';
module.exports.BOTCH = BOTCH;

var NEUTRAL_CRIT = 'N';
module.exports.NEUTRAL_CRIT = NEUTRAL_CRIT;

var BLOCK = 'd';
module.exports.BLOCK = BLOCK;

var DOUBLE_BLOCK = '%';
module.exports.DOUBLE_BLOCK = DOUBLE_BLOCK;

var BLOCK_CRIT = 'D';
module.exports.BLOCK_CRIT = BLOCK_CRIT;

var STRIKE = 's';
module.exports.STRIKE = STRIKE;

var DOUBLE_STRIKE = '+';
module.exports.DOUBLE_STRIKE = DOUBLE_STRIKE;

var STRIKE_CRIT = 'S';
module.exports.STRIKE_CRIT = STRIKE_CRIT;

var botchPercent = function(RESULTS) {
  var total = 0;
  var botch = 0;
  for (var r in RESULTS) {
    total+= RESULTS[r];
    if (r.indexOf(BOTCH) >= 0)
      botch += RESULTS[r];
  }
  return botch / total;
};
module.exports.botchPercent = botchPercent;

var critPercent = function(RESULTS) {
  var total = 0;
  var crit = 0;
  var crits = [NEUTRAL_CRIT, STRIKE_CRIT, BLOCK_CRIT];
  for (var r in RESULTS) {
    total+= RESULTS[r];
    for (var c in crits) {
      if (r.indexOf(crits[c]) >= 0) {
        crit += RESULTS[r];
        break;
      }
    }
  }
  return crit / total;
};
module.exports.critPercent = critPercent;

var addToSet = function(roll, set) {
  if (roll in set)
    set[roll] += 1;
  else
    set[roll] = 1;
};
module.exports.addToSet = addToSet;

var saveResult = function(roll, results, netResults) {
  roll = roll.split('').sort().join('');
  var nr = netResult(roll);
  addToSet(roll, results);
  addToSet(nr, netResults);
};
module.exports.saveResult = saveResult;

function determineResults(RESULT, INDEX, DICE, RESULTS, NET_RESULTS) {
  if (DICE.length == INDEX+1) {
    for (var i in DICE[INDEX]) {
      var r = RESULT + DICE[INDEX][i];
      saveResult(r, RESULTS, NET_RESULTS);
    }
  } else
    for (var i in DICE[INDEX])
      determineResults(RESULT + DICE[INDEX][i], INDEX+1, DICE, RESULTS, NET_RESULTS);
}

module.exports.determineResults = determineResults;

var totalPermutations = function(RESULTS) {
  var total = 0;
  for (var key in RESULTS)
    total += RESULTS[key];
  return total;
};
module.exports.totalPermutations = totalPermutations;

var faceMatches = function(roll, face) {
  return (roll.match(new RegExp(regexEscape(face),"g")) || []);
};
module.exports.faceMatches = faceMatches;

var removeMajority = function(set1, set2) {
  var removed = true;
  var l1 = set1.length;
  var l2 = set2.length;
  if (l1 > 0 && l2 > 0)
    if (l1 > l2)
      set1.pop();
    else
      set2.pop();
  else if (l1 > 0)
    set1.pop();
  else if (l2 > 0)
    set2.pop();
  else
    removed = false;

  return removed;
};
module.exports.removeMajority = removeMajority;

var netResult = function(roll) {
  var botch = faceMatches(roll, BOTCH);
  var neutralCrit = faceMatches(roll, NEUTRAL_CRIT);
  var strikeCrit = faceMatches(roll, STRIKE_CRIT);
  var blockCrit = faceMatches(roll, BLOCK_CRIT);

  var minusDice = faceMatches(roll, DROP);
  var strike = faceMatches(roll, STRIKE);
  var ds = faceMatches(roll, DOUBLE_STRIKE);
  var block = faceMatches(roll, BLOCK);
  var db = faceMatches(roll, DOUBLE_BLOCK);

  while (minusDice.length > 0) {
    if (!removeMajority(block, strike))
      if (!removeMajority(db, ds))
        if (neutralCrit.length > 0)
          neutralCrit.pop();
        else
          if (!removeMajority(blockCrit, strikeCrit))
            break;
    minusDice.pop();
  }

  while (botch.length > 0) {
    if (neutralCrit.length > 0)
      neutralCrit.pop();
    else
      if (!removeMajority(blockCrit, strikeCrit))
        if (!removeMajority(block, strike))
          if (!removeMajority(db, ds))
            break;
    botch.pop();
  }

  var s = 
    botch.join('') + 
    strikeCrit.join('') + 
    blockCrit.join('') +
    neutralCrit.join('') +
    ds.join('') +
    db.join('') +
    strike.join('') +
    block.join('');
    
  return s;
};

module.exports.netResult = netResult;

module.exports.determineResults = determineResults;
module.exports.critPercent = critPercent;
module.exports.botchPercent = botchPercent;
module.exports.totalPermutations = totalPermutations;
