import asyncio
import json
import urllib.request
import websockets

req = urllib.request.Request('http://127.0.0.1:9222/json/list')
with urllib.request.urlopen(req) as response:
    pages = json.loads(response.read().decode())

canvas_ws = None
for p in pages:
    if 'canvas.sfu.ca' in p.get('url', ''):
        canvas_ws = p.get('webSocketDebuggerUrl')
        break

async def inject():
    async with websockets.connect(canvas_ws) as ws:
        script = '''
        (() => {
            // Fake course names
            const fakeCourses = ['ASTRO 101', 'CS 50', 'LITERATURE 202', 'PHYSICS 300'];
            const cards = document.querySelectorAll('.ic-DashboardCard');
            cards.forEach((c, i) => {
                const title = c.querySelector('.ic-DashboardCard__header_title');
                if (title) title.innerText = fakeCourses[i % fakeCourses.length];
                
                const subtitle = c.querySelector('.ic-DashboardCard__header_subtitle');
                if (subtitle) subtitle.innerText = 'Introduction to ' + fakeCourses[i % fakeCourses.length];
            });

            // Minecraft photos
            const mcPhotos = [
                'https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/f6/Plains.png',
                'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/05/Forest.png',
                'https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fa/Desert.png',
                'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ab/Snowy_Tundra.png'
            ];
            
            // Set custom photos
            cards.forEach((c, i) => {
                const hero = c.querySelector('.ic-DashboardCard__header_hero');
                if (hero) {
                    hero.style.setProperty('background-image', "url('" + mcPhotos[i % mcPhotos.length] + "')", 'important');
                    hero.classList.add('vibe-has-custom-photo');
                }
            });

            // Fake tasks
            const taskTitles = document.querySelectorAll('.vibe-minimal-title');
            taskTitles.forEach((t, i) => {
                t.innerText = 'Project ' + (i+1) + ' Submission';
            });
            
            // Fake task courses
            const taskCourses = document.querySelectorAll('.vibe-minimal-course');
            taskCourses.forEach((c, i) => {
                c.innerText = fakeCourses[i % fakeCourses.length];
            });

            // Change background
            chrome.storage.local.set({
                'vibe_cached_wp_url': 'https://template.canva.com/EAFhwfMq3ds/1/0/1600w-KBBZLdpjLcM.jpg'
            }, () => {
                document.body.style.setProperty('--vibe-bg-image', "url('https://template.canva.com/EAFhwfMq3ds/1/0/1600w-KBBZLdpjLcM.jpg')");
            });

            return 'Injected';
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

asyncio.run(inject())
