import urllib.request
import json
import asyncio
import websockets

req = urllib.request.Request('http://127.0.0.1:9222/json/list')
with urllib.request.urlopen(req) as response:
    pages = json.loads(response.read().decode())

canvas_ws = None
for p in pages:
    if 'canvas.sfu.ca' in p.get('url', ''):
        canvas_ws = p.get('webSocketDebuggerUrl')

async def check_btn():
    async with websockets.connect(canvas_ws) as ws:
        script = '''
        (() => {
          const btns = document.querySelectorAll('.button-sidebar-wide');
          if(!btns.length) return 'no buttons';
          return Array.from(btns).map(b => b.offsetWidth + 'px ' + window.getComputedStyle(b).width + ' ' + window.getComputedStyle(b).display);
        })()
        '''
        msg = {
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {
                "expression": script,
                "returnByValue": True
            }
        }
        await ws.send(json.dumps(msg))
        res = await ws.recv()
        print(res)

asyncio.run(check_btn())
