import urllib.request
import json
import asyncio
import websockets

req = urllib.request.Request('http://127.0.0.1:9222/json/list')
with urllib.request.urlopen(req) as response:
    pages = json.loads(response.read().decode())

extensions_ws = None
canvas_ws = None

for p in pages:
    if 'extensions' in p.get('url', ''):
        extensions_ws = p.get('webSocketDebuggerUrl')
    if 'canvas.sfu.ca' in p.get('url', ''):
        canvas_ws = p.get('webSocketDebuggerUrl')

async def reload_ext():
    async with websockets.connect(extensions_ws) as ws:
        script = '''
        (() => {
          const m = document.querySelector('extensions-manager');
          if(!m) return 'no manager';
          const list = m.shadowRoot.querySelector('extensions-item-list');
          const items = list.shadowRoot.querySelectorAll('extensions-item');
          let found = false;
          items.forEach(i => {
            const n = i.shadowRoot.querySelector('#name').innerText;
            if (n.includes('Canvas')) {
              i.shadowRoot.querySelector('#dev-reload-button').click();
              found = true;
            }
          });
          return found ? 'reloaded' : 'not found';
        })()
        '''
        msg = {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": script
            }
        }
        await ws.send(json.dumps(msg))
        res = await ws.recv()
        print('Ext reload result:', res)

    async with websockets.connect(canvas_ws) as ws:
        msg = {
            "id": 2,
            "method": "Page.reload"
        }
        await ws.send(json.dumps(msg))
        res = await ws.recv()
        print('Canvas reload result:', res)

asyncio.run(reload_ext())
