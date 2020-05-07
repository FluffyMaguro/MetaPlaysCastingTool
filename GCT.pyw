"""Halo Wars Casting Tool."""
import logging

import hwctool

# create logger with 'spam_application'
logger = logging.getLogger('hwctool')
logger.setLevel(logging.DEBUG)
# create file handler which logs even debug messages
fh = logging.FileHandler(hwctool.settings.getLogFile(), 'w')
# create console handler with a higher log level
# create formatter and add it to the handlers
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
# add the handlers to the logger
logger.addHandler(fh)

if __name__ == '__main__':
    try:
        hwctool.main()
    finally:
        fh.close()
        logger.removeHandler(fh)
