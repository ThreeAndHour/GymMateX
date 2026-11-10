# ThB.Ho Creators web (repo ThreeAndHour/GymMateX)

Owner: Thor (THOR). Address him as ทรี, use ผม/คุณ, reply in Thai unless he writes English.
Live site: https://creators.thbho.com (GitHub Pages, custom domain since 10 Nov 2026).
Old links `threeandhour.github.io/GymMateX/...` redirect here. Never delete the `CNAME` file.
The real-estate site is a different repo (ThBHo/thbho.github.io, https://thbho.com) with its own chats; do not edit it from here.

## Pages in this chat's scope
| Page | What it is |
|---|---|
| `ThBHoCreators.html` | Main creator page. Sections: hero video, `#strengths` (6 USP cards with background clips + popup), `#levels`, `#creators`, `#match` (iframe of the quiz), `#portfolio` (YouTube playlist), `#roadmap` (folded), `#rules`, background, `#apply` (Google Form), contact. Venues link in nav is commented out on purpose. |
| `ThBHoPortfolio.html` | Every X / YouTube clip. Data is the `var FILMS=[ … ]` list inside the page. |
| `ThBHoCreatorMatch.html` | Matching quiz. Also embedded in Creators as `ThBHoCreatorMatch.html?embed=1&v=YYYYMMDD`; bump `v=` after editing the quiz or browsers keep the old one. |
| `ThBHoVenues.html` | Venue partners page. |
| `ThBHoStudio.html`, `ThBHoMatchDemo.html` | Backups of older versions. Do not link them. |
| `O2OEventsVR.html` | GymMateX O2O · VR plan. |
| `FitFantasy.html` | GymMateX Fit & Fantasy (was `index.html` until 10 Nov 2026). Own 4-language i18n (th/en/ru/zh) inside the page. Persona chat is `fitfantasy-chat.js` (scripted replies; real AI once `FF_CHAT_API` is set to the Worker in `tools/chat-worker/`). Bump its `?v=` after edits. |
| `index.html` | Only a redirect to `ThBHoCreators.html` (keeps ?query and #hash, carries the Creators share tags). Do not put content here. |

Other old HTML files in the repo are legacy pages; leave them alone unless Thor asks.

## Shared files (edit with care: every page uses them)
- `thbho-i18n.js` + `i18n/{zh,ru,ko,ja,es}.js`: 7 languages. In HTML, Thai and English are written inline as
  `<span lang="th">…</span><span lang="en">…</span>`. The other 5 come from the i18n files, keyed by the exact English text:
  add a new key right after the opening `{` of each file. After changing i18n files bump `?v=N` in `thbho-i18n.js` (currently 35).
- `x-media.js`: `window.THBHO_X = {id: {mp4 (~720p), poster, w, h, hd (1080p)}}` for X videos.
- `thbho-player.js`: poster + play button → `<video referrerpolicy="no-referrer">`, swaps to `hd` in full screen.
- `thbho-ytlist.js`: YouTube playlist player that skips videos YouTube refuses to embed.
- `thbho-analytics.js`: Google Analytics 4 (G-9Y2YDL6KT9) with a 7-language cookie consent bar. Not run in `?embed=1`.
  Events: video_play, persona_open, apply_click, language. Also loaded by thbho.com/AIGymmateXFactory.html by absolute URL.
- When you change a shared .js file, bump its `?v=` in every page that loads it (`grep -l "file.js?v=" *.html`).
- Images: `creator-img/`, videos: `creator-vid/`. Share images: `creator-img/og-*.jpg`.

## House rules for content (from Thor)
1. Never add a clip that is already listed (check the id / link first). Tell Thor it is already there instead.
2. A clip longer than 2:30 is an MV (`cat:'mv'`).
3. "Portfolio Vol." clips are behind the scenes (`cat:'bts'`).
4. Clips with all 3 main actors get all three personas `["three","b","hour"]`, except the pendant set (the "3" / "H" necklaces), which is Three + Hour only. Check personas by face, not only by the post text.
5. No explicit sex words. Use soft euphemisms everyone understands.
6. No LGBTQ+ labels on the pages.
7. Every new text in all 7 languages (th, en, zh, ru, ko, ja, es).
8. Personas: Three (INFP · Storyteller), B. (INFJ · Strategist), Hour (ESTP · Entrepreneur). Content levels 1 Art / 2 Partial / 3 Private 20+.

## Portfolio data (`FILMS` in ThBHoPortfolio.html)
One object per card, newest first:
`{id:'<x id>',cat:'mv'|'film'|'bts'|'photo',t:'Title',p:["three","b","hour"],y:2026,d:'8 Mar 2026',v:'6.7K',vn:6721,ln:26,ts:<unix>,dur:'6:09'}`
- `u:'threeandhour'`: the post is on @threeandhour (default account is @widerooms).
- YouTube card: `{id:'yt-<ytid>',yt:'<ytid>',…,v:'',vn:0,…}` with poster `creator-img/yt-<ytid>.jpg`. Unlisted YouTube videos show no views/likes.
- Photo card: `cat:'photo'` with `img:[…]`.

Add X posts with the scripts (run from the repo root, they read api.fxtwitter.com):
- `python3 -I tools/add_x_post.py --dry <id|url> …` then without `--dry` (add `--account threeandhour` for @threeandhour posts).
- `python3 -I tools/add_x_photo.py --dry <id|url> …` for photo posts.
The scripts guess category and personas; fix them by the rules above before committing.

Daily view/like refresh: `.github/workflows/refresh-views.yml` runs `tools/refresh_views.py` at 20:00 UTC (03:00 Bangkok) and commits to `main` as thbho-bot. It only updates numeric X ids (YouTube rows are skipped).

## Git workflow
- Work on branch `matching-demo`, publish by pushing it to `main`. Always merge `origin/main` first, because the daily bot commits there:
  ```
  git fetch -q origin main && git merge -q --no-edit origin/main
  git push origin matching-demo && git push origin matching-demo:main
  ```
- No force push, no rebase of published history.
- After pushing, watch `gh run list -R ThreeAndHour/GymMateX --workflow pages-build-deployment -L 1`. If a Pages build hangs, `gh run rerun <id>` or push an empty commit.
- Check the live page at https://creators.thbho.com/<page> (curl works) and look at it on phone and desktop widths before telling Thor it is done.

## Other references
- Collab form: https://docs.google.com/forms/d/1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y/edit (rebuilt by `tools/rebuild-collab-form.gs`). Embedded in `#apply` with `?embedded=true`.
- YouTube playlist on Creators: `PLLS5V99ZfVi-FKQv0txA63aTHqNIZVLPl`.
- Domain, Google Analytics and cross-site plans live in the Claude Docs doc "ThB.Ho · Domain & Analytics Roadmap" and are handled in a separate core chat.
