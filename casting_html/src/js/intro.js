var socket = null;
var isopen = false;
var reconnectIntervalMs = 5000;
var volume = 1.0;
<<<<<<< HEAD
=======

>>>>>>> b5b775d (initial commit)
var debug = false;
var displayTime = 3.0;
var cssFile = "";
var tween = new TimelineMax()
var myAudio1 = new Audio("src/sound/flyin.wav");
myAudio1.volume = volume;
var myAudio2 = new Audio("src/sound/bass.wav");
myAudio2.volume = volume;
var myAudio3 = new Audio("src/sound/fanfare.wav");
myAudio3.volume = volume;
var controller = new Controller(profile, 'intro');
var currentGame_intro = "";
var game_trans_intro = {
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
  "Company of Heroes": "CoH3"
>>>>>>> b5b775d (initial commit)
};


init();

// Update current game and change css
function update_current_game(game) {
  if (currentGame_intro == game) return;
  console.log(`Updating current game: ${currentGame_intro} → ${game}`);
  currentGame_intro = game;
  if (game_trans_intro.hasOwnProperty(currentGame_intro))
    controller.setStyle(`src/css/intro/${game_trans_intro[currentGame_intro]}.css`);
}

function playSound(audio) {
  try {
    if (audio.duration > 0 && !audio.paused) {
      //already playing
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    } else {
      //not playing
      audio.play();
    }
  } catch (e) { }
}

function Connect() {
  path = "intro"
  port = parseInt("0x".concat(profile), 16);
  socket = new WebSocket("ws://127.0.0.1:".concat(port, "/", path));

  socket.onopen = function () {
    console.log("Connected!");
    isopen = true;
  }

  socket.onmessage = function (message) {
    var jsonObject = JSON.parse(message.data);
    var intro = document.getElementById("intro");
    if (jsonObject.data.hasOwnProperty('font')) {
      intro.style.fontFamily = jsonObject.data.font;
    }
    console.log("Message received");
    if (jsonObject.event == 'SHOW_INTRO') {
      if (!tween.isActive()) {
        try {
          var tts = new Audio(jsonObject.data.tts);
          tts.volume = jsonObject.data.tts_volume / 20.0;
        } catch (e) { }
        socket.send(jsonObject.state);
        tween.clear();
        $(".race").prop('id', jsonObject.data.race);

        // Update current game
        update_current_game(jsonObject.game);

        // Custom colors
<<<<<<< HEAD
        $(".box").css("background-image", `url(src/img/textures/${game_trans_intro[jsonObject.game]}/${jsonObject.data.intro_color}.png)`);
        $(".name, .name>span").css("color", jsonObject.data.intro_color);
=======
         console.log(game_trans_intro[jsonObject.game]);
        $(".box").css("background-image", `url(src/img/textures/${game_trans_intro[jsonObject.game]}/${jsonObject.data.intro_color}.png)`);
        if ((jsonObject.game == 'Company of Heroes 3') ) {
          let originalString = jsonObject.data.race;
          let modifiedString = originalString.replace(/ /g, "_");
          $(".box").css("background-image", `url(src/img/textures/CoH3/${modifiedString}${jsonObject.data.intro_color}.png)`);
        
        }
         // changed color to white
         // $(".name, .name>span").css("color", jsonObject.data.intro_color);
          $(".name, .name>span").css("color", 'White');
       
        
>>>>>>> b5b775d (initial commit)

        $(".logo").css("display", jsonObject.data.display)
        if ((jsonObject.game == 'SpellForce 3') && jsonObject.data.logo.includes('Random')) {
          jsonObject.data.logo = 'src/img/races/SpellForce3_Random.png';
          console.log('SF3');
        }
<<<<<<< HEAD
=======
       
>>>>>>> b5b775d (initial commit)
        console.log('LOGO: ' + jsonObject.data.logo);
        console.log('GAME: ' + jsonObject.game);

        $(".logo").css("background-image", "url(" + jsonObject.data.logo + ")");
        $('.name span').html(jsonObject.data.name);
        $('.team span').html(jsonObject.data.team);
<<<<<<< HEAD
        fillText();
=======
        fillText(jsonObject.game);
>>>>>>> b5b775d (initial commit)
        var racelogo = document.getElementsByClassName("race")[0];
        var offset = (window.innerWidth - intro.offsetWidth) / 2;
        myAudio1.volume = jsonObject.data.volume / 40.0;
        myAudio2.volume = jsonObject.data.volume / 40.0;
        myAudio3.volume = jsonObject.data.volume / 40.0;
        var animation = "default";
        if (jsonObject.data.hasOwnProperty('animation')) {
          animation = jsonObject.data.animation;
        } else {
          animation = "default";
        }
        if (animation == "fanfare") {
          tween.call(playSound, [myAudio3])
            .to(intro, 0, {
              opacity: 0,
              clearProps: 'left',
              transformOrigin: "right top",
              scaleY: 0
            })
            .to(intro, 0.1, {
              opacity: 1,
            })
            .to(intro, 0.35, {
              ease: Power2.easeOut,
              scaleY: 1
            })
            .call(playSound, [tts])
            .to(intro, jsonObject.data.display_time, {
              scaleY: 1
            })
            .to(intro, 0.35, {
              scaleY: 0,
              ease: Power1.easeOut
            })
            .to(intro, 0, {
              left: "105%",
              clearProps: "transform, transformOrigin",
              opacity: 0
            });
        } else if (animation == "slide") {
          tween.to(intro, 0, {
            opacity: 0,
            left: offset + "px",
            scaleX: 0
          })
            .to(intro, 0.1, {
              opacity: 1
            })
            .call(playSound, [myAudio2])
            .to(intro, 0.35, {
              ease: Power2.easeOut,
              scaleX: 1,
              force3D: true
            })
            .call(playSound, [tts])
            .to(intro, jsonObject.data.display_time, {
              scaleX: 1
            })
            .call(playSound, [myAudio2])
            .to(intro, 0.35, {
              scaleX: 0,
              force3D: true,
              ease: Power2.easeIn
            })
            .to(intro, 0, {
              left: "105%",
              opacity: 0,
              clearProps: "transform"
            });
        } else {
          tween.call(playSound, [myAudio1])
            .to(intro, 0, {
              opacity: 1,
              left: "105%"
            })
            .to(intro, 1.12, {
              ease: Power2.easeIn,
              left: offset + "px"
            })
            .call(playSound, [tts])
            .to(intro, jsonObject.data.display_time, {
              left: offset + "px"
            })
            .to(intro, 0.5, {
              opacity: 0,
              ease: Power1.easeInOut
            })
            .to(intro, 0, {
              left: "105%",
              opacity: 0
            });
        }
      }

    } else if (jsonObject.event == 'CHANGE_STYLE') {
      controller.setStyle(jsonObject.data.file);
    } else if (jsonObject.event == 'DEBUG_MODE') {
      if (!debug) {
        tween.kill()
        var offset = (window.innerWidth - intro.offsetWidth) / 2;
        $('#intro').css('opacity', '1');
        $('#intro').css('left', offset.toString() + "px");
        debug = true;
      } else {
        tween.kill()
        $('#intro').css('opacity', '0');
        $('#intro').css('left', '105%');
        debug = false;
      }

    }
  }

  socket.onclose = function (e) {
    console.log("Connection closed.");
    socket = null;
    isopen = false
    setTimeout(function () {
      Connect();
    }, reconnectIntervalMs);
  }
};

<<<<<<< HEAD
function fillText() {
  $("div.box").find(".text-fill").textfill({
    maxFontPixels: 60
=======
function fillText(gamename) {
   if(gamename=='Company of Heroes 3'){
    fontpx=45;
    }
    else{
    fontpx=60;
    }
  $("div.box").find(".text-fill").textfill({
   
    maxFontPixels: fontpx
>>>>>>> b5b775d (initial commit)
  });
}

function init() {
  var intro = document.getElementById("intro");
  $('#intro').css('visibility', 'visible');
  $('#intro').css('left', '105%');
  Connect();
}
