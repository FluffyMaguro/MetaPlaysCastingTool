"""Provide settings for hwctool."""
import json
import logging
import os
import platform
import sys
import time
import requests
import traceback

import appdirs

from hwctool.settings.client_config import ClientConfig
from hwctool.settings.config import init as initConfig
from hwctool.settings.profileManager import ProfileManager
from hwctool.settings.safeGuard import SafeGuard

module_logger = logging.getLogger('hwctool.settings')

this = sys.modules[__name__]

if getattr(sys, 'frozen', False):
    basedir = os.path.dirname(sys.executable)
else:
    basedir = os.path.dirname(sys.modules['__main__'].__file__)

casting_data_dir = "casting_data"
casting_html_dir = "casting_html"


dataDir = "data"
logosDir = os.path.join(dataDir, "logos")
ttsDir = os.path.join(dataDir, "tts")

windows = (platform.system().lower() == "windows")
max_no_sets = 15

this.profileManager = ProfileManager()
this.maps = []
this.nightbot_commands = dict()
this.safe = SafeGuard()


def loadSettings():

    this.profileManager = ProfileManager()

    initConfig(configFile())

    # Creating directories if not exisiting
    if not os.path.exists(getAbsPath(dataDir)):
        os.makedirs(getAbsPath(dataDir))

    loadNightbotCommands()

    # Creating directories if not exisiting
    if not os.path.exists(getAbsPath(casting_data_dir)):
        os.makedirs(getAbsPath(casting_data_dir))

    if not os.path.exists(getAbsPath(ttsDir)):
        os.makedirs(getAbsPath(ttsDir))

    # Create a symnolic link to the profiles directory
    # Not working on Windows 10 - admin rights needed
    # link = os.path.normpath(os.path.join(basedir, 'profiles'))
    # profiles = this.profileManager.profilesdir()
    # if not os.path.exists(link):
    #     module_logger.info('Creating symbolic link.')
    #     os.symlink(link, profiles)
    # elif os.path.islink(link) and os.readlink(link) != profiles:
    #     module_logger.info('Updating symbolic link.')
    #     os.unlink(link)
    #     os.symlink(link, profiles)
    # elif not os.path.islink(link):
    #     module_logger.info('Deleting file and creating symbolic link.')
    #     os.remove(link)
    #     os.symlink(link, profiles)


def getResFile(file):
    if hasattr(sys, '_MEIPASS'):
        return os.path.normpath(os.path.join(sys._MEIPASS, 'src', file))
    else:
        return os.path.normpath(os.path.join(basedir, 'src', file))


def getLocalesDir():
    if hasattr(sys, '_MEIPASS'):
        return os.path.normpath(os.path.join(sys._MEIPASS, 'locales'))
    else:
        return os.path.normpath(os.path.join(basedir, 'locales'))


def getJsonFile(scope):
    return getAbsPath(dataDir + "/{}.json".format(scope))


def configFile():
    return getAbsPath("config.ini")


def getLogFile():
    logdir = getLogDir()
    if not os.path.exists(logdir):
        os.makedirs(logdir)
    else:
        # Delete old logfiles
        for f in os.listdir(logdir):
            full = os.path.join(logdir, f)
            if (os.path.isfile(full) and
                    os.stat(full).st_mtime < time.time() - 7 * 86400):
                os.remove(full)

    filename = 'scct-{}-{}.log'.format(time.strftime(
        "%Y%m%d-%H%M%S"), this.profileManager._current)
    return os.path.normpath(os.path.join(logdir, filename))


def getLogDir():
    return appdirs.user_log_dir(
        ClientConfig.APP_NAME, ClientConfig.COMPANY_NAME)


def getAbsPath(file):
    """Link to absolute path of a file."""

    return this.profileManager.getFile(file)


def loadNightbotCommands():
    """Read json data from file."""
    try:
        with open(getJsonFile('nightbot'), 'r',
                  encoding='utf-8-sig') as json_file:
            data = json.load(json_file)
    except Exception as e:
        data = dict()

    this.nightbot_commands = data
    return data


def saveNightbotCommands():
    """Write json data to file."""
    try:
        with open(getJsonFile('nightbot'), 'w',
                  encoding='utf-8-sig') as outfile:
            json.dump(this.nightbot_commands, outfile)
    except Exception as e:
        module_logger.exception("message")


def race2idx(str):
    """Convert race to idx."""
    for idx, race in enumerate(races):
        if(race.lower() == str.lower()):
            return idx
    return 0


def idx2race(idx):
    """Convert idx to race."""
    try:
        return races[idx]
    except Exception:
        return races[0]

# Default values

game_races = {"StarCraft II":("Random", "Zerg", "Terran", "Protoss"),
              "WarCraft III":("Random", "Human", "Orc", "Night Elf", "Undead"),
              "Age of Empires IV":("Random", "Abbasid Dynasty", "Chinese", "Delhi Sultanate", "English", "French", "Holy Roman Empire", "Mongols", "Rus"),
              "Age of Empires Online":("Random","Greeks", "Egyptians", "Celts", "Persians", "Babylonians", "Norse", "Romans"),
              "Age of Mythology":("Random","Zeus", "Poseidon", "Hades", "Isis", "Ra", "Set", "Odin", "Thor", "Loki", "Oranos", "Kronos", "Gaia", "Fu Xi", "Nu Wa", "Shennong"),
              "SpellForce 3" :("Random","Humans","Elves","Orcs","Dwarves","Dark Elves","Trolls"),
              "Halo Wars 2":("Random", "Anders", "Arbiter", "Atriox", "Colony", "Cutter","Decimus", "Forge", "Isabel", "Jerome", "Johnson", "Kinsano","Serina", "Shipmaster", "Pavium", "Voridus", "Yap Yap"),
<<<<<<< HEAD
=======
              "Company of Heroes 3": ("Random", "Afrikakorps", "US Forces", "Wehrmacht","British Forces")
>>>>>>> b5b775d (initial commit)
              }

# Check local file
file_path = os.path.join(getAbsPath('casting_html'), 'races.json')

try:
    with open(file_path,'r') as f:
        game_races = json.load(f)
except:
    print("Failed to load local races.json")
    print(traceback.format_exc())

# Set Current game and races
current_game = 'WarCraft III'
races = game_races[current_game]