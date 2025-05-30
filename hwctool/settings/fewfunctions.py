import os, sys, shutil, requests, json, zipfile, logging

module_logger = logging.getLogger('hwctool.fewfunctions')
# logging.basicConfig(level=logging.INFO)

if getattr(sys, 'frozen', False):
    basedir = os.path.dirname(sys.executable)
else:
    basedir = os.path.dirname(sys.modules['__main__'].__file__)


def getResFile(file):
    if hasattr(sys, '_MEIPASS'):
        return os.path.normpath(os.path.join(sys._MEIPASS, 'src', file))
    else:
        return os.path.normpath(os.path.join(basedir, 'src', file))


# def copytree(src, dst, symlinks=False, ignore=None):
#     for item in os.listdir(src):
#         s = os.path.join(src, item)
#         d = os.path.join(dst, item)
#         if os.path.isdir(s):
#             shutil.copytree(s, d, symlinks, ignore)
#         else:
#             shutil.copy2(s, d)


def update_casting_data(saveloc,targetloc):
    """ Updates  data, current version e.g. '0.2.8' """

    #check if folder exists
    if not os.path.isdir(saveloc):
        os.makedirs(saveloc)
        
    #check if folder exists
    if not os.path.isdir(targetloc):
        os.makedirs(targetloc)

    #get current version of the update file 
    current_version = '0.0.0'
    entries = os.listdir(saveloc)
    for entry in entries:
        if entry.endswith('.zip') and entry.startswith('casting_html_'):
            current_version = entry.replace('casting_html_', '').replace('.zip', '')
            break
    module_logger.info('Current version: '+ current_version)



    #get new version number
    try:
        urlv = 'https://raw.githubusercontent.com/FluffyMaguro/CastingTool-Archive/master/versions.txt'
        response = requests.get(urlv)
        new_version = json.loads(response.text)['data_version']      
        module_logger.info('New version: '+ new_version)

        #compare version current and available
        if int(new_version.replace('.', '')) > int(current_version.replace('.', '')):
            module_logger.info('Downloading new data')
            current_version = new_version

            #download that version
            file_name = 'casting_html_'+new_version+'.zip'
            url = 'https://github.com/FluffyMaguro/CastingTool-Archive/blob/master/'+file_name+'?raw=true'
            r = requests.get(url)

            #save the file
            file_path = saveloc + '\\' + file_name
            with open(file_path, 'wb') as f:
                f.write(r.content)
        else:
            module_logger.info('Casting data up-to-date')

    except Exception as e:
        module_logger.exception('Unable to check for a new version of casting data. \n'+e)


    #remove old zips
    entries = os.listdir(saveloc)
    for entry in entries:
        if entry.endswith('.zip') and entry.startswith('casting_html') and entry != ('casting_html_'+current_version+'.zip'):
            os.remove(saveloc+'\\'+entry)
            module_logger.info(f'Removing {entry}')


    #extract the one zip file in saveloc
    file = saveloc + '\\' + 'casting_html_'+ current_version + '.zip'
    module_logger.info(f'Extracting {file}')
    with zipfile.ZipFile(file, 'r') as zip_ref:
        zip_ref.extractall(targetloc)


# update_casting_data('C:\\test\\update', 'C:\\test\\profile')