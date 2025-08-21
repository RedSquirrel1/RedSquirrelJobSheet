const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('rs', { runtime: 'electron' });
