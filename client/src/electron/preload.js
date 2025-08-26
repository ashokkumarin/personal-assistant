// Expose a safe minimal API if you need, left intentionally small since this app talks to remote API directly
import { contextBridge } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
// placeholder for future IPC if needed
});
