var combat = require('../combat.js');

describe("d6 spec suite", function() {

  it('rollCountTest', function() {
    var r = '  --BB+d+dD%Ss%%%SdsN';
    var matches = combat.faceMatches(r, 'N');
    expect(matches.length).toBe(1);
    matches = combat.faceMatches(r, 'd');
    expect(matches.length).toBe(3);
    matches = combat.faceMatches(r, '-');
    expect(matches.length).toBe(2);
    matches = combat.faceMatches(r, combat.DOUBLE_STRIKE);
    expect(matches.length).toBe(2);
    matches = combat.faceMatches(r, combat.DOUBLE_BLOCK);
    expect(matches.length).toBe(4);
  });

  it('addToSet test', function() {
    var roll = combat.BOTCH+combat.BLOCK+combat.BLOCK;
    var set = {};
    combat.addToSet(roll, set);
    expect(Object.keys(set).length).toBe(1);
    expect(set[roll]).toBe(1);

    combat.addToSet(roll, set);
    expect(Object.keys(set).length).toBe(1);
    expect(set[roll]).toBe(2);

    roll = combat.BOTCH;
    combat.addToSet(roll, set);
    expect(Object.keys(set).length).toBe(2);
    expect(set[roll]).toBe(1);
  });

  it('saveResults test', function() {
    var roll = combat.BOTCH+combat.BLOCK+combat.BLOCK;
    // die roll is resolved sorted
    var resolvedRoll = combat.BOTCH+combat.BLOCK+combat.BLOCK;

    var results = {};
    var netResults = {};

    combat.saveResult(roll, results, netResults);
    expect(Object.keys(results).length).toBe(1);
    expect(results[resolvedRoll]).toBe(1);
    expect(Object.keys(netResults).length).toBe(1);
    expect(netResults[combat.BLOCK]).toBe(1);

    // Add another same roll
    combat.saveResult(roll, results, netResults);
    expect(Object.keys(results).length).toBe(1);
    expect(results[resolvedRoll]).toBe(2);
    expect(Object.keys(netResults).length).toBe(1);
    expect(netResults[combat.BLOCK]).toBe(2);

    // Add another similar roll
    roll = combat.BLOCK+combat.BOTCH+combat.BLOCK;
    combat.saveResult(roll, results, netResults);
    expect(Object.keys(results).length).toBe(1);
    expect(results[resolvedRoll]).toBe(3);
    expect(Object.keys(netResults).length).toBe(1);
    expect(netResults[combat.BLOCK]).toBe(3);

    // Add a different roll
    roll = combat.BLOCK+combat.BOTCH+combat.STRIKE;
    resolvedRoll = combat.BOTCH+combat.BLOCK+combat.STRIKE;
    combat.saveResult(roll, results, netResults);
    expect(Object.keys(results).length).toBe(2);
    expect(results[resolvedRoll]).toBe(1);
  });

  it('Single Die Test', function() {
    var results = {};
    var netResults = {};
    var die = [combat.BOTCH, combat.BLOCK, combat.BLOCK, combat.STRIKE, combat.STRIKE, combat.NEUTRAL_CRIT];
    var result = '';
    combat.determineResults(result, 0, [die], results, netResults);
    expect(Object.keys(results).length).toBe(4);
    expect(results[combat.BOTCH]).toBe(1);
    expect(results[combat.BLOCK]).toBe(2);
    expect(results[combat.STRIKE]).toBe(2);
    expect(results[combat.NEUTRAL_CRIT]).toBe(1);
  });

  it('Multi Die Test', function() {
    var results = {};
    var netResults = {};
    var die = [combat.BOTCH, combat.BLOCK];
    var result = '';
    combat.determineResults(result, 0, [die, die], results, netResults);
    expect(Object.keys(results).length).toBe(3);
    expect(results[combat.BOTCH + combat.BOTCH]).toBe(1);
    expect(results[combat.BLOCK + combat.BLOCK]).toBe(1);
    expect(results[combat.BOTCH + combat.BLOCK]).toBe(2);
  });

  it('faceMatches test', function() {
    var roll = combat.NEUTRAL_CRIT + combat.DOUBLE_STRIKE + combat.NEUTRAL_CRIT + combat.STRIKE + combat.STRIKE + combat.STRIKE;

    var matches = combat.faceMatches(roll, combat.NEUTRAL_CRIT);
    expect(matches.length).toBe(2);
    for (var m in matches)
      expect(matches[m]).toBe(combat.NEUTRAL_CRIT);

    matches = combat.faceMatches(roll, combat.DOUBLE_STRIKE);
    expect(matches.length).toBe(1);
    for (m in matches)
      expect(matches[m]).toBe(combat.DOUBLE_STRIKE);

    matches = combat.faceMatches(roll, combat.STRIKE);
    expect(matches.length).toBe(3);
    for (m in matches)
      expect(matches[m]).toBe(combat.STRIKE);

    matches = combat.faceMatches(roll, combat.BOTCH);
    expect(matches.length).toBe(0);
  });

  it('netResult sort test', function() {
    var roll = combat.NEUTRAL_CRIT
      + combat.DOUBLE_STRIKE
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_BLOCK
      + combat.STRIKE
      + combat.BLOCK_CRIT
      + combat.BLANK
      + combat.STRIKE
      + combat.BLOCK
      + combat.BLANK
      + combat.STRIKE_CRIT
      + combat.DOUBLE_STRIKE
      + combat.STRIKE;

    var expected = combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.STRIKE
      + combat.STRIKE
      + combat.STRIKE
      + combat.BLOCK;

    var result = combat.netResult(roll);
    expect(result).toBe(expected);

  });

  it('removeMajority test', function() {
    var set1 = ['a', 'a', 'a'];
    var set2 = ['a', 'a', 'a'];
    var removed = combat.removeMajority(set1, set2);
    expect(set1.length).toBe(3);
    expect(set2.length).toBe(2);
    expect(removed).toBe(true);

    removed = combat.removeMajority(set1, set2);
    expect(set1.length).toBe(2);
    expect(set2.length).toBe(2);
    expect(removed).toBe(true);

    set2.push('a');
    removed = combat.removeMajority(set1, set2);
    expect(set1.length).toBe(2);
    expect(set2.length).toBe(2);
    expect(removed).toBe(true);

    set1 = [];
    set2 = [];
    removed = combat.removeMajority(set1, set2);
    expect(removed).toBe(false);
  });

  it('netResult botch test', function() {
    /*
     Botch dice remove crits and then standard result dice
       remove neutral crits
       remove from strike crit or block crit, whatever has the most; if tied, remove strike
       remove from strike or block, whatever has the most; if tied, remove strike
       remove from double strike or double block, whatever has the most; if tied, remove double strike
     Remaining botch dice stay in the pool
    */
    var roll = combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK
      + combat.DOUBLE_STRIKE
      + combat.BLOCK
      + combat.STRIKE
      + combat.BLOCK_CRIT
      + combat.STRIKE_CRIT
      + combat.NEUTRAL_CRIT;

    var expected = combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.STRIKE
      + combat.BLOCK;

    var result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK
      + combat.DOUBLE_STRIKE
      + combat.BLOCK
      + combat.STRIKE
      + combat.BLOCK_CRIT
      + combat.STRIKE_CRIT;

    expected = combat.BLOCK_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.STRIKE
      + combat.BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK
      + combat.DOUBLE_STRIKE
      + combat.BLOCK
      + combat.STRIKE
      + combat.BLOCK_CRIT;

    expected = combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.STRIKE
      + combat.BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK
      + combat.DOUBLE_STRIKE
      + combat.BLOCK
      + combat.STRIKE;

    expected = combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK
      + combat.DOUBLE_STRIKE
      + combat.BLOCK;

    expected = combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK
      + combat.DOUBLE_STRIKE;

    expected = combat.DOUBLE_BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK;

    expected = '';

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK;

    expected = combat.BOTCH;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.BOTCH
      + combat.BOTCH
      + combat.BLANK
      + combat.DOUBLE_BLOCK;

    expected = combat.BOTCH;

    result = combat.netResult(roll);
    expect(result).toBe(expected);
  });

  it('netResult drop test', function() {
    /*
     Drop dice remove a non-empty, non-botch die
       remove from strikes or blocks, whatever has the most; if tied, remove strikes before blocks
       remove from double strikes or double blocks, whatever has the most; if tied, remove double strikes before double blocks
       remove neutral crits
       remove from strike or block crits, whatever has the most; if tied, remove strike before block
     drop dice do not remove botch dice
     when all eligible dice have been dropped, remove remaining drop dice from the pool
     */
    var roll = combat.DROP
      + combat.BLANK
      + combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.STRIKE
      + combat.BLOCK;

    var expected = combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.BLOCK;

    var result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.BLANK
      + combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK
      + combat.BLOCK;

    expected = combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.BLANK
      + combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_STRIKE
      + combat.DOUBLE_BLOCK;

    expected = combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.BLANK
      + combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT
      + combat.DOUBLE_BLOCK;

    expected = combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.BLANK
      + combat.STRIKE_CRIT
      + combat.BLOCK_CRIT
      + combat.NEUTRAL_CRIT;

    expected = combat.STRIKE_CRIT
      + combat.BLOCK_CRIT;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.BLANK
      + combat.STRIKE_CRIT
      + combat.BLOCK_CRIT;

    expected = combat.BLOCK_CRIT;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.BLANK
      + combat.BLOCK_CRIT;

    expected = '';

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.DROP
      + combat.BLANK;

    expected = '';

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.STRIKE
      + combat.BLOCK
      + combat.BLOCK
      + combat.BLANK;

    expected = combat.STRIKE + combat.BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.STRIKE
      + combat.BLOCK
      + combat.STRIKE
      + combat.BLANK;

    expected = combat.STRIKE + combat.BLOCK;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

    roll = combat.DROP
      + combat.BOTCH
      + combat.BOTCH
      + combat.BOTCH
      + combat.STRIKE
      + combat.BLANK;

    expected = combat.BOTCH + combat.BOTCH + combat.BOTCH;

    result = combat.netResult(roll);
    expect(result).toBe(expected);

  });

  it('totalPermutations test', function() {
    var results = {abd: 3, def: 5, efg: 5};
    var t = combat.totalPermutations(results);
    expect(t).toBe(13);

    t = combat.totalPermutations({});
    expect(t).toBe(0);
  });

  it('critPercent test', function() {
    var die = [combat.BOTCH, combat.BLOCK];
    var results = {};
    var netResults = {};
    var roll = '';
    combat.determineResults(roll, 0, [die, die], results, netResults);
    var p = combat.critPercent(netResults);
    expect(p).toBe(0);

    die = [combat.BOTCH, combat.NEUTRAL_CRIT];
    results = {};
    netResults = {};
    roll = '';
    combat.determineResults(roll, 0, [die, die], results, netResults);
    p = combat.critPercent(netResults);
    expect(p).toBe(0.25);
  });

  it('botchPercent test', function() {
    var die = [combat.NEUTRAL_CRIT, combat.BLOCK];
    var results = {};
    var netResults = {};
    var roll = '';
    combat.determineResults(roll, 0, [die, die], results, netResults);
    var p = combat.botchPercent(netResults);
    expect(p).toBe(0);

    die = [combat.BOTCH, combat.NEUTRAL_CRIT];
    results = {};
    netResults = {};
    roll = '';
    combat.determineResults(roll, 0, [die, die], results, netResults);
    p = combat.botchPercent(netResults);
    expect(p).toBe(0.25);
  });
});
