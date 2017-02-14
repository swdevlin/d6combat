
var NEUTRAL_DIE =  ['B', 'd', 'd', 's', 's', 'N'];
var OFFENSE_DIE =  ['B', '',  '',  '4', '4', 'S'];
var DEFENSE_DIE =  ['B', '',  '',  '4', '4', 'D'];
var WOUND_DIE =    ['B', '-', '',  '',  '',  ''];
var FATIGUE_DIE =  ['-', '-', '',  '',  '',  ''];
var dieSize = NEUTRAL_DIE.length;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function htmlForDie(name, die, id) {
  var html = '';
  html += '<label for="p' + id + name + '" class="col-sm-2 control-label">' + name + '</label>';
  html += '<div class="col-sm-2">';
  html += '<input type="number" min="0" class="form-control" id="p' + id + name + '" value="0">';
  html += '</div>';
  html += '<div class="col-sm-8">';
  for (var i in die) {
    html += '<div class="die ';
    if (i == 0 && die[i] != '')
      html += 'botch ';
    if (i == die.length - 1 && die[i] != '')
      html += 'crit ';
    html += name.toLowerCase() + '">' + die[i] + '</div>';
  }
  html += '</div>';
  return html;
}

var players = new Array(
  {
    disabledCrits: 0,
    crits: 0,
    botches: 0,
    drops: 0,
    disabled: 0,
    rolls: [],
    dice: 0
  }
);

function createDieRoll(die, type, roll) {
  return {
    'type': type,
    'roll': roll,
    'result': die[roll-1],
    'isCrit': die[roll-1] == 'N' || die[roll-1] == 'S' || die[roll-1] == 'D',
    'isBotch': die[roll-1] == 'B',
    'enabled': true,
    'isDrop': die[roll-1] == '-'
  };
}

function plural(number, single, multiple) {
  return (number == 1) ? single : multiple;
}

function rollStatus(player) {
  var totalDisabled = player.disabledCrits + player.disabled;
  var totalValid = player.dice + player.crits;
  var activeDrops = player.drops > 0 ? player.drops - player.disabled - player.disabledCrits: 0;
  var activeCrits = player.crits - player.disabledCrits;
  var activeDice = player.dice - player.disabled;
  var remaining = activeDice + activeCrits;

  if (activeDrops > 0) {
    if (totalValid <= totalDisabled)
      return "";
    else if (activeDrops > 1)
      return activeDrops + ' dice need to be dropped';
    else if (activeDrops == 1)
      return activeDrops + ' die needs to be dropped';
  }

  var netBotches = player.botches > 0 ? player.botches - (player.disabled + player.disabledCrits - player.drops) : 0;
  if (netBotches < 0)
    netBotches = 0;
  if (netBotches > remaining)
    netBotches = remaining;

  var status = '';
  if (netBotches > 0) {
    if (activeCrits > 0) {
      if (netBotches > activeCrits)
        status = activeCrits + ' ' + plural(activeCrits, 'crit needs', 'crits need') + ' to be dropped';
      else
        status = netBotches + ' ' + plural(netBotches, 'crit needs', 'crits need') + ' to be dropped';
    } else {
      if (activeDice > 0) {
        status = netBotches +  ' ' + plural(netBotches, 'die needs', 'dice needs') + ' to be dropped';
      }
    }
  } else {
    if (player.disabledCrits < player.botches && activeCrits > 0) {
      netBotches = activeCrits > player.botches ? player.botches : activeCrits;
      status = netBotches + ' ' + plural(netBotches, 'crit needs', 'crits need') + ' to be dropped';
    }
  }

  return status;
 }

function netResultMarkup(player) {
  var html = '';
  var botchesToDisplay = player.botches - (player.disabled + player.disabledCrits - player.drops);
  if (botchesToDisplay > 0)
    for (var i in player.rolls)
      if (player.rolls[i].isBotch && botchesToDisplay > 0) {
        botchesToDisplay--;
        html += dieHTML(player.rolls[i], '', i)
      }
  for (var i in player.rolls)
    if (rollCanBeDisplayed(player.rolls[i]))
      html += dieHTML(player.rolls[i], '', i);
  return html;
}

function rollCanBeDisplayed(roll) {
  if (!roll.enabled)
    return false;
  else if (roll.result == '•')
    return false;
  else if (roll.result == '')
    return false;
  else if (roll.result == ' ')
    return false;
  else if (roll.isBotch)
    return false;
  else if (roll.isDrop)
    return false;
  return true;
}

function dieHTML(die, id, i) {
  var html = '<div data-roll="' + i + '"';
  if (id != '')
    html += ' id="'+ id + '"';
  html += ' class="die ' + die.type;
  if (die.isBotch)
    html += ' botch';
  if (die.isCrit)
    html += ' crit';
  if (die.result == '')
    html += ' disabled';
  if (die.result == ' ')
    html += ' disabled';
  html += '">' + die.result + '</div>';
  return html;
}

function botchesOk(player) {
  if (!dropsOk(player))
    return false;

  var totalDisabled = player.disabled + player.disabledCrits;
  var totalDice = player.dice + player.crits;
  var needToBeDisabled = player.drops + player.botches;

  if (player.botches == 0)
    return true;
  else if (player.disabledCrits < player.botches && player.crits > player.disabledCrits)
    return false;
  else if (player.disabledCrits >= player.crits && player.disabled >= player.dice)
    return true;
  else if (totalDisabled < totalDice && needToBeDisabled > totalDisabled)
    return false;
  else if (player.crits > player.disabledCrits && player.botches > player.disabledCrits)
    return false;
  else if (player.disabledCrits + player.disabled >= player.botches)
    return true;
  else
    return false;
}

function dropsOk(player) {
  if (player.drops == 0)
    return true;
  if (player.drops <= player.disabled)
    return true;
  if (player.dice > player.disabled)
    return false;
  return true;
}

function isDie(face) {
  if (face == '')
    return 0;
  else if (face == 4)
    return 1;
  else if (face == face.toUpperCase())
    return 0;
  else if (face == '-')
    return 0;
  else if (face == ' ')
    return 0;
  else
    return 1;
}
