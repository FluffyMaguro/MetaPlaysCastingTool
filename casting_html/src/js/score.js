var tweens = {};
var socket = null;
var isopen = false;
var myDefaultFont = null;
var reconnectIntervalMs = 5000;
var data = {};
var font = "DEFAULT";
var cssFile = "";
var initNeeded = true;
var tweenInitial = new TimelineMax();
var tweens = {};
var controller = new Controller(profile, 'score');
var currentGame = 'WarCraftIII';
var game_trans = {
  "StarCraft II": "SC2",
  "WarCraft III": "WC3",
  "Age of Empires IV": "AoE4",
  "Age of Empires Online": "AoEO",
  "Age of Mythology": "AoM",
  "SpellForce 3": "SF3",
<<<<<<< HEAD
  "Halo Wars 2": "HW2"
=======
  "Halo Wars 2": "HW2",
  "Company of Heroes 3": "CoH3"
>>>>>>> b5b775d (initial commit)
};

init();

function init() {
  myDefaultFont = getComputedStyle(document.body).getPropertyValue('--font');
  loadStoredData();
  initHide();
  connectWebsocket();
  setTimeout(function () {
    initAnimation(false);
  }, 1000);
}

function connectWebsocket() {
  console.time('connectWebsocket');
  path = "score"
  port = parseInt("0x".concat(profile), 16);
  socket = new WebSocket("ws://127.0.0.1:".concat(port, "/", path));

  socket.onopen = function () {
    console.log("Connected!");
    isopen = true;
  }

  socket.onmessage = function (message) {
    var jsonObject = JSON.parse(message.data);
    console.log("Message received");
    setCurrentGame(jsonObject.game);

    if (jsonObject.event == 'CHANGE_STYLE') {
      controller.setStyle(jsonObject.data.file);
    } else if (jsonObject.event == 'CHANGE_FONT') {
      setFont(jsonObject.data.font);
    } else if (jsonObject.event == 'ALL_DATA') {
      if (dataChanged(jsonObject.data)) {
        initAnimation();
      }
    } else if (jsonObject.event == 'CHANGE_TEXT') {
      changeText(jsonObject.data.id, jsonObject.data.text);
    } else if (jsonObject.event == 'CHANGE_IMAGE') {
      changeImage(jsonObject.data.id, jsonObject.data.img);
    } else if (jsonObject.event == 'CHANGE_SCORE') {
      changeScoreIcon(jsonObject.data.teamid, jsonObject.data.setid, jsonObject.data.color);
    } else if (jsonObject.event == 'SET_WINNER') {
      setWinner(jsonObject.data);
    }
  }

  socket.onclose = function (e) {
    console.timeEnd('connectWebsocket');
    console.log("Connection closed.");
    socket = null;
    isopen = false
    setTimeout(function () {
      connectWebsocket();
    }, reconnectIntervalMs);
  }
}

function setCurrentGame(data) {
  if (data == null) return;
  let newgame = data.toString();
  if (newgame == currentGame) return;
  currentGame = newgame;
  console.log('Setting current game to: ' + currentGame);
  udpateResultFormat();
  if (game_trans.hasOwnProperty(currentGame))
    controller.setStyle(`src/css/score/${game_trans[currentGame]}.css`);
}


function udpateResultFormat() {
  var current_text = $('#score').text();
  console.log('Current text: ' + current_text)
<<<<<<< HEAD
  if (currentGame == 'Age of Mythology' || currentGame == 'Age of Empires Online' || currentGame == 'WarCraft III' || currentGame == 'Age of Empires IV') {
=======
  if (currentGame == 'Age of Mythology' || currentGame == 'Age of Empires Online' || currentGame == 'WarCraft III' || currentGame == 'Age of Empires IV' || currentGame == 'Company of Heroes 3') {
>>>>>>> b5b775d (initial commit)
    $('#score').text(current_text.replace('Bo ', 'Best of '));
  } else {
    $('#score').text(current_text.replace('Best of ', 'Bo '));
  }
}

function dataChanged(newData) {
  if (JSON.stringify(data) === JSON.stringify(newData)) {
    return false;
  } else {
    data = newData;
    return true;
  }
}

function storeData(scope = null) {
  if (scope == null || scope == "data") controller.storeData('data', data, true);
  if (scope == null || scope == "font") controller.storeData('font', font);
}

function loadStoredData() {
  try {
    var storage = window.localStorage;
    data = controller.loadData('data', true);
    font = controller.loadData('font');
    try {
      setFont(font);
    } catch (e) { }
  } catch (e) { }
}

function insertData() {
  storeData('data');
  console.log(data);
  $('#team1').text(data['team1']);
  $('#team2').text(data['team2']);
  $('#score1').text(data['score1']);
  $('#score2').text(data['score2']);
  $('#score').text('Bo ' + data['sets'].length);
  udpateResultFormat();

  // AoE4 change score 
  if (currentGame == "Age of Empires IV") {
    $(".score_left").css("color", data.player_colors[0]);
    $(".score_right").css("color", data.player_colors[1]);
  } else {
    $(".score_left").css("color", "white");
    $(".score_right").css("color", "white");
  }

<<<<<<< HEAD
  let games_with_colors = { "WarCraft III": "WC3", "Halo Wars 2": "HW2", "Age of Mythology": "AoM", "StarCraft II": "SC2", "SpellForce 3": "SF3" };
=======
  let games_with_colors = { "WarCraft III": "WC3", "Halo Wars 2": "HW2", "Age of Mythology": "AoM", "StarCraft II": "SC2", "SpellForce 3": "SF3", "Company of Heroes 3": "CoH3" };
>>>>>>> b5b775d (initial commit)
  if (games_with_colors.hasOwnProperty(currentGame)) {
    $("div.box_left").css("background-image", `url(src/img/textures/${games_with_colors[currentGame]}/${data['player_colors'][0]}_Left.png)`);
    $("div.box_right").css("background-image", `url(src/img/textures/${games_with_colors[currentGame]}/${data['player_colors'][1]}_Right.png)`);
  } else {
    $("div.box_left").css("background-image", `none`);
    $("div.box_right").css("background-image", `none`);
  };

  var hw_spacer = ''
  if ((data['logo1'].includes('HaloWars2_') && !(data['logo1'].includes('_Scoreboard'))) || (data['logo2'].includes('HaloWars2_') && !(data['logo2'].includes('_Scoreboard')))) {
    hw_spacer = '_Scoreboard';
  };
<<<<<<< HEAD

=======
 
>>>>>>> b5b775d (initial commit)
  if ((currentGame == 'SpellForce 3') && (data['logo1'].includes('Random'))) {
    data['logo1'] = 'src/img/races/SpellForce3_Random.png'
  };

  if ((currentGame == 'SpellForce 3') && (data['logo2'].includes('Random'))) {
    data['logo2'] = 'src/img/races/SpellForce3_Random.png'
  };

  $('#logo1').css("background-image", "url('" + data['logo1'].replace('.png', '') + hw_spacer + ".png')");
  $('#logo2').css("background-image", "url('" + data['logo2'].replace('.png', '') + hw_spacer + ".png')");

  if (data['winner'][0]) {
    $('#team1').removeClass('loser');
    $('#team1').addClass('winner');
    $('#team2').removeClass('winner');
    $('#team2').addClass('loser');
  } else if (data['winner'][1]) {
    $('#team2').removeClass('loser');
    $('#team2').addClass('winner');
    $('#team1').removeClass('winner');
    $('#team1').addClass('loser');
  } else {
    $('#team1').removeClass('winner');
    $('#team1').removeClass('loser');
    $('#team2').removeClass('winner');
    $('#team2').removeClass('loser');
  }
  insertIcons();
  $(document).ready(function () {
    $('#content').find(".text-fill").textfill();
  });
}

function setWinner(winner) {
  if (winner == 0) {
    $('#team1').removeClass('winner');
    $('#team2').removeClass('winner');
    $('#team1').removeClass('loser');
    $('#team2').removeClass('loser');
    data['winner'][0] = false;
    data['winner'][1] = false;
  } else if (winner == 1) {
    $('#team2').removeClass('loser');
    $('#team2').addClass('winner');
    $('#team1').removeClass('winner');
    $('#team1').addClass('loser');
    data['winner'][0] = false;
    data['winner'][1] = true;
  } else if (winner == -1) {
    $('#team1').removeClass('loser');
    $('#team1').addClass('winner');
    $('#team2').removeClass('winner');
    $('#team2').addClass('loser');
    data['winner'][0] = true;
    data['winner'][1] = false;
  }
  storeData('data');
}
<<<<<<< HEAD
=======
function Coh3changescoreboxsize() {
  for (let i = 6; i <= 16; i++) {
  const element = document.getElementById(`circle-2-${i}`);
   
  if (!element) {
    const circle = document.getElementsByClassName('circle')[0];
    if (circle) {
    // Get current width and reduce it by i
    const currentWidth = parseInt(getComputedStyle(circle).width);
    let a=0;
    if(i>=11){
      a=5;
    }
    const newWidth = currentWidth - i+a;
   
    // Set the new width
    const circles = document.getElementsByClassName('circle');

    for (let f = 0; f < circles.length; f++) {
        const objcircle = circles[f];
      objcircle.style.width = newWidth + 'px';
    } 
    
  console.log("applied");
    break; // Exit loop on first missing element
     }
  }
}
}
>>>>>>> b5b775d (initial commit)

function insertIcons() {
  for (var j = 0; j < 2; j++) {
    $('#score' + (j + 1).toString() + '-box').empty();
  }
  try {

    // Change their width if there are too many of them
    let n_icons = Object.keys(data['sets']).length;
    let width_style = "";
    if (n_icons > 9)
      width_style = `; width: ${220 / n_icons}px`

    // Insert icons
    for (var i = 0; i < Object.keys(data['sets']).length; i++) {
      for (var j = 0; j < 2; j++) {
        var color = data['sets'][i][j];
        console.log("setting icon color to: " + color);
        $('#score' + (j + 1).toString() + '-box').append('<div class="circle" id="circle-' + (j + 1).toString() + '-' + (i + 1).toString() + '" style="background-color: ' + color + width_style + '"></div>');
      }
    }
<<<<<<< HEAD
=======
     console.log(currentGame);
  if ((currentGame == 'Company of Heroes 3') ) {
    Coh3changescoreboxsize();
     console.log("Changed box size");
  }
>>>>>>> b5b775d (initial commit)
  } catch (e) { }
}

function initHide() {
  var content = document.getElementById("content");
  content.style.setProperty('visibility', 'visible');
  tweenInitial.staggerTo([content], 0, {
    opacity: "0"
  }, 0);
}

function initAnimation(force = true) {
  if (!tweenInitial.isActive() && initNeeded) {
    insertData();
    tweenInitial = new TimelineMax();
    tweenInitial.delay(0.5)
      .fromTo([$('#content')], 0, {
        opacity: "0"
      }, {
        opacity: "1"
      }, 0)
      .fromTo($('#box'), 0.35, {
        scaleY: 0.0,
        force3D: true
      }, {
        scaleY: 1.0,
        force3D: true
      })
      .staggerFromTo([$('#logo1'), $('#logo2')], 0.35, {
        scale: 0.0,
        force3D: true
      }, {
        scale: 1.0,
        force3D: true
      }, 0, '-=0.1')
      .staggerFromTo([
        [$('#team1'), $('#team2')], $('#score'), [$('#score1'), $('#score2')]
      ], 0.35, {
        opacity: '0'
      }, {
        opacity: '1'
      }, 0.10, '-=0.35')
      .staggerFromTo([$('#score1-box > div.circle'), $('#score2-box > div.circle')], 0.25, {
        scale: 0.0,
        opacity: '0',
        force3D: true
      }, {
        scale: 1.0,
        opacity: '1',
        force3D: true
      }, 0.0, '-=0.50');
    initNeeded = false;
  } else if (force && !tweenInitial.isActive()) {
    outroAnimation();
  } else if (force) {
    setTimeout(function () {
      initAnimation();
    }, 1000);
  }
}

function outroAnimation() {
  if (!tweenInitial.isActive() && tweenInitial.progress() == 1) {
    tweenInitial.eventCallback("onReverseComplete", initAnimation);
    tweenInitial.delay(0);
    tweenInitial.reverse(0);
    initNeeded = true;
  }
}

function changeText(id, new_value) {
  var object = $('#' + id);
  if (id == 'score1' || id == 'score2') {
    new_data_value = parseInt(new_value);
  } else {
    new_data_value = new_value;
  }
  if (data[id] == new_value) {
    return;
  } else {
    data[id] = new_data_value;
    storeData('data');
  }

  if (tweens[id] && tweens[id].isActive()) {
    tweens[id].kill();
  }
  tweens[id] = new TimelineMax();
  tweens[id].to(object, 0.25, {
    opacity: 0
  })
    .call(_changeText, [object, new_value])
    .to(object, 0.25, {
      opacity: 1
    }, "+=0.15");

  function _changeText(object, new_value) {
    object.text(new_value)
    $(document).ready(function () {
      $('#content').find(".text-fill").textfill();
    });
  }
}

function changeImage(id, new_value) {
  var object = $('#' + id);
  if (data[id] == new_value) {
    return;
  } else {
    data[id] = new_value;
    storeData('data');
  }
  if (tweens[id] && tweens[id].isActive()) {
    tweens[id].kill();
  }
  tweens[id] = new TimelineMax();
  tweens[id].to(object, 0.35, {
    scale: 0,
    force3D: true
  })
    .call(_changeImage, [object, new_value])
    .to(object, 0.35, {
      scale: 1,
      force3D: true
    }, "+=0.25");

  function _changeImage(object, new_value) {
    if ((currentGame == 'SpellForce 3') && (new_value.includes('Random'))) {
      new_value = 'src/img/races/SpellForce3_Random.png'
    };
    object.css("background-image", "url('" + new_value + "')");
  }
}


function changeScoreIcon(team, set, color) {
  var id = '#circle-' + team.toString() + '-' + set.toString();
  var object = $(id);
  if (data['sets'][set - 1][team - 1] == color) {
    return;
  } else {
    data['sets'][set - 1][team - 1] = color;
    storeData('data');
  }
  if (tweens[id] && tweens[id].isActive()) {
    tweens[id].kill();
  }
  tweens[id] = new TimelineMax();
  tweens[id].to(object, 0.15, {
    scale: 0,
    opacity: '0',
    force3D: true
  })
    .call(_changeIcon, [object, color])
    .to(object, 0.15, {
      scale: 1,
      opacity: '1',
      force3D: true
    }, "+=0.05");

  function _changeIcon(object, new_value) {
    object.css("background-color", new_value);
  }
}

function setFont(newFont) {
  if (newFont == 'DEFAULT') {
    newFont = myDefaultFont;
  }
  font = newFont.trim();
  document.documentElement.style.setProperty('--font', font);
  storeData("font");
}
