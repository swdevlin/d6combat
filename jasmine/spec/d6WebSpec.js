describe('botchesOk tests', function() {
  it('botches are ok if there are no botches', function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 2,
      crits: 0,
      botches: 0,
      disabledCrits: 0
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(true);
  });

  it('botches are ok if they are less than the number of disabled dice', function() {
    var player = {
      drops: 0,
      disabled: 1,
      dice: 2,
      crits: 0,
      botches: 1,
      disabledCrits: 0
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(true);
  });

  it('botches are ok if they are less than the number of disabled crits', function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 2,
      crits: 1,
      botches: 1,
      disabledCrits: 1
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(true);
  });

  it('botches are not ok if they are greater than the number of disabled dice', function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 2,
      crits: 0,
      botches: 1,
      disabledCrits: 0
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(false);
  });

  it('botches are not ok if they are greater than the number of disabled crits', function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 2,
      crits: 0,
      botches: 2,
      disabledCrits: 1
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(false);
  });

  it('botches are ok if they are greater than the number of disabled and no remaining dice', function() {
    var player = {
      drops: 0,
      disabled: 1,
      dice: 1,
      crits: 1,
      botches: 4,
      disabledCrits: 1
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(true);
  });

  it('botches are not ok if drops are not ok', function() {
    var player = {
      drops: 1,
      disabled: 0,
      dice: 1,
      crits: 1,
      botches: 0,
      disabledCrits: 0
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(false);
  });

  it('botch must cancel crits first', function() {
    var player = {
      drops: 0,
      disabled: 1,
      dice: 4,
      crits: 1,
      botches: 1,
      disabledCrits: 0
    };
    var isOk = botchesOk(player);
    expect(isOk).toEqual(false);
  });
});

describe("d6 Web UI", function() {
  it("NEUTRAL_DIE test", function() {
    var die = createDieRoll(NEUTRAL_DIE, 'neutral', 4);
    expect(die.type).toEqual('neutral');
    expect(die.roll).toEqual(4);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    die = createDieRoll(NEUTRAL_DIE, 'neutral', 1);
    expect(die.roll).toEqual(1);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(true);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    die = createDieRoll(NEUTRAL_DIE, 'neutral', 6);
    expect(die.roll).toEqual(6);
    expect(die.isCrit).toEqual(true);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

  });

  it("WOUND_DIE test", function() {
    var die = createDieRoll(WOUND_DIE, 'wound', 4);
    expect(die.type).toEqual('wound');
    expect(die.roll).toEqual(4);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    die = createDieRoll(WOUND_DIE, 'neutral', 1);
    expect(die.roll).toEqual(1);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(true);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    die = createDieRoll(WOUND_DIE, 'neutral', 2);
    expect(die.roll).toEqual(2);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(true);

    die = createDieRoll(WOUND_DIE, 'neutral', 6);
    expect(die.roll).toEqual(6);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

  });

  it("FATIGUE_DIE test", function() {
    var die = createDieRoll(FATIGUE_DIE, 'fatigue', 4);
    expect(die.type).toEqual('fatigue');
    expect(die.roll).toEqual(4);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    die = createDieRoll(FATIGUE_DIE, 'fatigue', 1);
    expect(die.roll).toEqual(1);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(true);

    die = createDieRoll(FATIGUE_DIE, 'fatigue', 2);
    expect(die.roll).toEqual(2);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(true);

    die = createDieRoll(FATIGUE_DIE, 'fatigue', 6);
    expect(die.roll).toEqual(6);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

  });

  it("OFFENSE_DIE test", function() {
    var dieToRoll = OFFENSE_DIE;
    var roll = 4;
    var type = 'offense';
    var die = createDieRoll(dieToRoll, type, roll);
    expect(die.type).toEqual(type);
    expect(die.result).toEqual(dieToRoll[roll-1]);
    expect(die.roll).toEqual(roll);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    roll = 1;
    die = createDieRoll(dieToRoll, type, roll);
    expect(die.roll).toEqual(roll);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(true);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    roll = 6;
    die = createDieRoll(dieToRoll, type, roll);
    expect(die.roll).toEqual(roll);
    expect(die.isCrit).toEqual(true);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);
  });

  it("DEFENSE_DIE test", function() {
    var dieToRoll = DEFENSE_DIE;
    var roll = 4;
    var type = 'defense';
    var die = createDieRoll(dieToRoll, type, roll);
    expect(die.type).toEqual(type);
    expect(die.result).toEqual(dieToRoll[roll-1]);
    expect(die.roll).toEqual(roll);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    roll = 1;
    die = createDieRoll(dieToRoll, type, roll);
    expect(die.roll).toEqual(roll);
    expect(die.isCrit).toEqual(false);
    expect(die.isBotch).toEqual(true);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);

    roll = 6;
    die = createDieRoll(dieToRoll, type, roll);
    expect(die.roll).toEqual(roll);
    expect(die.isCrit).toEqual(true);
    expect(die.isBotch).toEqual(false);
    expect(die.enabled).toEqual(true);
    expect(die.isDrop).toEqual(false);
  });

  it('drops are ok if there are no drops', function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 2,
      crits: 0,
      botches: 0,
      disabledCrits: 0
    };
    var isOk = dropsOk(player);
    expect(isOk).toEqual(true);
  });

  it('drops are ok if they are less than the number of disabled dice', function() {
    var player = {
      drops: 1,
      disabled: 1,
      dice: 2,
      crits: 0,
      botches: 0,
      disabledCrits: 0
    };
    var isOk = dropsOk(player);
    expect(isOk).toEqual(true);
  });

  it('drops are not ok if they are greater than the number of disabled dice and there are dice left', function() {
    var player = {
      drops: 3,
      disabled: 1,
      dice: 5,
      crits: 0,
      botches: 0,
      disabledCrits: 0
    };
    var isOk = dropsOk(player);
    expect(isOk).toEqual(false);
  });

  it('drops are ok if they are greater than the number of disabled dice and there are no dice left', function() {
    var player = {
      drops: 3,
      disabled: 1,
      dice: 1,
      crits: 0,
      botches: 0,
      disabledCrits: 0
    };
    var isOk = dropsOk(player);
    expect(isOk).toEqual(true);
  });

  it('Only non-crit, non-botch, non-drop dice count as dice', function() {
    var die = isDie('N');
    expect(die).toBe(0);
    die = isDie('B');
    expect(die).toBe(0);
    die = isDie('D');
    expect(die).toBe(0);
    die = isDie('S');
    expect(die).toBe(0);
    die = isDie('-');
    expect(die).toBe(0);
    die = isDie('');
    expect(die).toBe(0);
    die = isDie(' ');
    expect(die).toBe(0);
    die = isDie('d');
    expect(die).toBe(1);
    die = isDie('s');
    expect(die).toBe(1);
    die = isDie('4');
    expect(die).toBe(1);
  });
});

describe('dieHTML Tests', function() {

  it("HTML for plain die is correct", function() {
    var dieToRoll = NEUTRAL_DIE;
    var roll = 4;
    var type = 'neutral';
    var die = createDieRoll(dieToRoll, type, roll);
    var html = dieHTML(die, 1, roll);

    expect(html).toEqual('<div data-roll="4" id="1" class="die neutral">'+ NEUTRAL_DIE[roll-1]+'</div>');
  });

  it("HTML for crit die has crit class", function() {
    var dieToRoll = NEUTRAL_DIE;
    var roll = 6;
    var type = 'neutral';
    var die = createDieRoll(dieToRoll, type, roll);
    var html = dieHTML(die, 1, roll);

    expect(html).toEqual('<div data-roll="6" id="1" class="die neutral crit">'+ NEUTRAL_DIE[roll-1]+'</div>');
  });

  it("HTML for botch die has crit class", function() {
    var dieToRoll = NEUTRAL_DIE;
    var roll = 1;
    var type = 'neutral';
    var die = createDieRoll(dieToRoll, type, roll);
    var html = dieHTML(die, 1, roll);

    expect(html).toEqual('<div data-roll="1" id="1" class="die neutral botch">'+ NEUTRAL_DIE[roll-1]+'</div>');
  });

  it("disabled die has disabled class", function() {
    var dieToRoll = OFFENSE_DIE;
    var roll = 3;
    var type = 'offensive';
    var die = createDieRoll(dieToRoll, type, roll);
    var html = dieHTML(die, 1, roll);

    expect(html).toEqual('<div data-roll="3" id="1" class="die offensive disabled">'+ OFFENSE_DIE[roll-1]+'</div>');
  });

});

describe('rollStatus indicates what the player must do', function() {
  it("No drops or botches results in no message", function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 0,
      botches: 0,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('');
  });

  it("Max botch are reported", function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 2,
      crits: 2,
      botches: 1,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('1 crit needs to be dropped');
  });

  it("Regular dice are dropped if there are botches and no crits", function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 5,
      crits: 0,
      botches: 1,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('1 die needs to be dropped');
  });

  it("Botches with no dice to drop is no message", function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 0,
      crits: 0,
      botches: 4,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('');
  });

  it("More botches than disabled crits means a botch message", function() {
    var player = {
      drops: 0,
      disabled: 0,
      dice: 0,
      crits: 2,
      botches: 4,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('2 crits need to be dropped');
  });

  it("More botches than disabled crits is no message", function() {
    var player = {
      dice: 0,
      crits: 2,
      drops: 0,
      botches: 4,
      disabled: 0,
      disabledCrits: 2
    };
    var message = rollStatus(player);
    expect(message).toEqual('');
  });

  it("Two botches, a drop, and a regular die", function() {
    var player = {
      dice: 1,
      crits: 0,
      drops: 1,
      botches: 2,
      disabled: 0,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('1 die needs to be dropped');
  });

  it("2 botches, 2 drops, 1 regular, 2 disabled regular", function() {
    var player = {
      dice: 3,
      crits: 0,
      drops: 2,
      botches: 2,
      disabled: 2,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('1 die needs to be dropped');
  });

  it("More botches than disabled dice is no message", function() {
    var player = {
      dice: 0,
      crits: 0,
      drops: 0,
      botches: 4,
      disabled: 2,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('');
  });

  it("More botches than disabled dice and disbled crits is no message", function() {
    var player = {
      dice: 1,
      crits: 1,
      drops: 0,
      botches: 4,
      disabled: 1,
      disabledCrits: 1
    };
    var message = rollStatus(player);
    expect(message).toEqual('');
  });

  it("Disabled dice don't count against botches if all crits are not disabled", function() {
    var player = {
      dice: 3,
      crits: 1,
      drops: 0,
      botches: 2,
      disabled: 2,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('1 crit needs to be dropped');
  });

  it("Drop before botch", function() {
    var player = {
      drops: 2,
      disabled: 0,
      dice: 2,
      crits: 1,
      botches: 4,
      disabledCrits: 0
    };
    var message = rollStatus(player);
    expect(message).toEqual('2 dice need to be dropped');
  });

  it("Once drops are accounted for, botches are reported", function() {
    var player = {
      drops: 2,
      disabled: 1,
      dice: 2,
      crits: 1,
      botches: 4,
      disabledCrits: 1
    };
    var message = rollStatus(player);
    expect(message).toEqual('1 die needs to be dropped');

    player = {
      drops: 2,
      disabled: 1,
      dice: 2,
      crits: 2,
      botches: 4,
      disabledCrits: 1
    };
    message = rollStatus(player);
    expect(message).toEqual('1 crit needs to be dropped');

    player = {
      drops: 0,
      disabled: 1,
      dice: 4,
      crits: 1,
      botches: 1,
      disabledCrits: 0
    };
    message = rollStatus(player);
    expect(message).toEqual('1 crit needs to be dropped');

    player = {
      drops: 0,
      disabled: 0,
      dice: 3,
      crits: 2,
      botches: 1,
      disabledCrits: 1
    };
    message = rollStatus(player);
    expect(message).toEqual('');

  });

});

describe('rules for which dice can be displayed', function() {
  it('botch dice are not displayed', function() {
    var roll = createDieRoll(NEUTRAL_DIE, 'neutral', 1);
    var display = rollCanBeDisplayed(roll);
    expect(display).toBe(false);
  });

  it('enabled dice are displayed', function() {
    var roll = createDieRoll(NEUTRAL_DIE, 'neutral', 2);
    var display = rollCanBeDisplayed(roll);
    expect(display).toBe(true);
  });

  it('disabled dice are not displayed', function() {
    var roll = createDieRoll(NEUTRAL_DIE, 'neutral', 2);
    roll.enabled = false;
    var display = rollCanBeDisplayed(roll);
    expect(display).toBe(false);
  });

  it('drop dice are not displayed', function() {
    var roll = createDieRoll(WOUND_DIE, 'wound', 2);
    var display = rollCanBeDisplayed(roll);
    expect(display).toBe(false);
  });

  it('blank dice are not displayed', function() {
    var roll = createDieRoll(WOUND_DIE, 'wound', 4);
    var display = rollCanBeDisplayed(roll);
    expect(display).toBe(false);
  });

});

describe('html markup for remaining dice', function() {
  it('No dice is a blank string', function() {
    var player = {
      drops: 0,
      disabled: 1,
      dice: 1,
      crits: 1,
      botches: 2,
      disabledCrits: 1,
      rolls: [
        {enabled: false, isBotch: false, isCrit: true, isDrop: false, result: 'S', roll: 6, type: 'offensive'},
        {enabled: true, isBotch: true, isCrit: false, isDrop: false, result: 'S', roll: 1, type: 'offensive'},
        {enabled: true, isBotch: true, isCrit: false, isDrop: false, result: 'B', roll: 1, type: 'offensive'},
        {enabled: false, isBotch: false, isCrit: false, isDrop: false, result: '4', roll: 4, type: 'offensive'}
      ]
    };
    var html = netResultMarkup(player);
    expect(html).toBe('');
  });

  it('Remaining botch dice are displayed', function() {
    var player = {
      drops: 0,
      disabled: 1,
      dice: 1,
      crits: 1,
      botches: 3,
      disabledCrits: 1,
      rolls: [
        {enabled: false, isBotch: false, isCrit: true, isDrop: false, result: 'S', roll: 6, type: 'offensive'},
        {enabled: true, isBotch: true, isCrit: false, isDrop: false, result: 'S', roll: 1, type: 'offensive'},
        {enabled: true, isBotch: true, isCrit: false, isDrop: false, result: 'B', roll: 1, type: 'offensive'},
        {enabled: false, isBotch: false, isCrit: false, isDrop: false, result: '4', roll: 4, type: 'offensive'},
        {enabled: true, isBotch: true, isCrit: false, isDrop: false, result: 'B', roll: 1, type: 'offensive'}
      ]
    };
    var expected = dieHTML(player.rolls[1], '', 1);
    var html = netResultMarkup(player);
    expect(html).toBe(expected);
  });

});