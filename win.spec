# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(['D:\\Dokumenty\\Git Hub\\MetaPlaysCastingTool\\GCT.py'],
             pathex=['D:\\Dokumenty\\Git Hub\\MetaPlaysCastingTool'],
             binaries=[],
             datas=[('src/*', 'src'), ('locales', 'locales')],
             hiddenimports=[],
             hookspath=['D:\\Dokumenty\\Git Hub\\MetaPlaysCastingTool\\venv\\lib\\site-packages\\pyupdater\\hooks'],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='win',
          icon='src\\hwct.ico',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=False )

