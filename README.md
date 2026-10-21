<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=venom&color=0:0b0f21,50:120a2e,100:0b0f21&height=280&section=header&text=ABYSS%20%2F%2F%20SURVIVORS&fontSize=56&fontColor=eaf2ff&animation=fadeIn&fontAlignY=54&desc=Something%20lives%20at%2018%2C000%20meters.%20It%20has%20noticed%20your%20light.&descAlignY=74&descSize=15&descColor=6cffb0"/>

<br/>

![Live](https://img.shields.io/badge/LIVE_IN_THE_DEEP-6cffb0?style=for-the-badge&labelColor=0b0f21)
![Players](https://img.shields.io/badge/27K_DAILY_DIVERS-3cc8ff?style=for-the-badge&labelColor=0b0f21)
![Platform](https://img.shields.io/badge/TELEGRAM_%2F_WEB-b06bff?style=for-the-badge&labelColor=0b0f21)
![Studio](https://img.shields.io/badge/VEIL_%26_WIRE-ff9b3c?style=for-the-badge&labelColor=0b0f21)

<br/>

**A neon deep-sea survivor roguelite. Drag to move, your guns fire on their own, tap to dodge.**

### [Play on Telegram](https://t.me/AbyssSurvivorsbot) · [Play on the web](https://abyss-survivors-v21-telegram-sdk.vercel.app)

</div>

---

## The game

You dive through 100 levels of a trench that gets stranger the deeper you go. Pick a diver, stack weapons and passives, and hit one enemy with two elements to trigger a reaction. Every fifth level a Warden descends. Kill it and you claim a Boon, a permanent upgrade for the run. The Reflection waits at level 100. Past that point the Corruption keeps scaling until it kills you.

- Divers include Salvager, Angler, Strongarm, Lamprey and Remora, each with an innate ability
- Six languages: English, Farsi, Chinese, Hindi, Spanish and Russian
- Friends list, online presence and run stats tied to your Telegram account
- Five graphics presets, from Potato to Ultra, for older phones

## How it's built

The game ships as one HTML file with no framework. The deployed build is `index.html` in this repo.

- `src/` holds the source in 50+ numbered parts. The number sets the load order.
- `node build.js --check` joins the parts into `dist/index.html` and syntax-checks the script.
- `node smoke-test.js dist/index.html` runs the whole game in Node with a stubbed browser and steps through frames. It catches load-order crashes that a syntax check misses.
- `node sim-endgame-v10.js dist/index.html` pulls the difficulty formulas out of the build and simulates levels 100 to 200. A release has to pass this: a maximum-sustain build must still die by level 200.
- `api/social.js` and `api/webhook.js` run as Vercel functions. They verify Telegram login data on the server with HMAC-SHA256, rate-limit each action through Upstash Redis, and read every secret from environment variables.
- `node test-social-v8.js` tests the backend against a mocked Redis with signed test Telegram data.

Saves go to localStorage and sync to Telegram CloudStorage, so a player's progress follows them across devices.

## Credits

Design and development by Ramtin Mohammadi at Veil & Wire Studio.

© 2026 Veil & Wire Studio. All rights reserved. You can play the game and share the links. Please don't copy or reuse the code or art without permission.
