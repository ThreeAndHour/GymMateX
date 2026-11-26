# ThB.Ho Creators web (repo ThreeAndHour/GymMateX)

Owner: Thor (THOR). Address him as ธอร์ (THOR; changed from ทรี on 18 Nov 2026, "Three" is only his persona), use ผม/คุณ, reply in Thai unless he writes English.
Live site: https://creators.thbho.com (GitHub Pages, custom domain since 10 Nov 2026).
Old links `threeandhour.github.io/GymMateX/...` redirect here. Never delete the `CNAME` file.
The real-estate site is a different repo (ThBHo/thbho.github.io, https://thbho.com) with its own chats; do not edit it from here.

## Pages in this chat's scope
| Page | What it is |
|---|---|
| `ThBHoCreators.html` | Main creator page (goal: get visitors to the `#apply` form, mobile first). Hero H1 "Anyone can become a creator", primary button → `#apply`. On ≤760px: Apply pill + ☰ menu in the header, floating "Start your first collab" button (hidden while hero buttons or `#apply` are on screen), CTA bands `.mcta`, and sections re-ordered with CSS `order` (hero > creators > strengths > background > portfolio > levels > rules > match > roadmap > apply). Sections: hero video, `#strengths` (6 USP cards with background clips + popup), `#levels`, `#creators`, `#match` (iframe of the quiz), `#portfolio` (YouTube playlist), `#roadmap` (folded), `#rules`, background, `#apply` (Google Form), `#home` (house infographic), contact. Nav has a "For venues →" link (shown in the ☰ menu on phones). |
| `ThBHoPortfolio.html` | Every X / YouTube clip. Data is the `var FILMS=[ … ]` list inside the page. |
| `ThBHoCreatorMatch.html` | Matching quiz. Also embedded in Creators as `ThBHoCreatorMatch.html?embed=1&v=YYYYMMDD`; bump `v=` after editing the quiz or browsers keep the old one. |
| `ThBHoVenues.html` | Home page of the brand **Hybrid AI Venue Network** (renamed 20 Nov 2026, same URL; title/H1 say "Hybrid AI Venue Network", eyebrow "by ThB.Ho"). Venue partners page. Open for partners since 17 Nov 2026: `#apply` embeds the venue partner form (same guest registry Sheet), `#home` house infographic. |
| `ThBHoDigitalHome.html` | "A website is a home" concept, Creators & Venues edition (7 languages). Concept source: thbho.com/DigitalHome.html (Agent Network core chat owns the concept; only the examples are ours). Linked from `#home` on Creators and Venues. |
| `HybridAIPersonaNetwork.html` | Hybrid AI Persona Network (preview since 26 Nov 2026, `noindex`; linked since 27 Nov 2026 from the nav + footer of Creators, Venues, Portfolio, the CreatorMatch footer, the DigitalHome footer row, and a "Build your own persona" button in the Creators playlist section). Wine-black palette `#0E0A0C #181115 #231920 #3A2A31`, gold / `#C8466F` / cream `#EBDCC0` (Dec chart: no blue/aqua backgrounds). Sections hero clip > #idea > #personas > #work > #creators (7 seats) > #lab (7 steps) > #rules (7) > #hire (collab form) > contact. No Krubb name ("Bangkok hub") until NoNy agrees. Never put prices on the page (Thor, 26 Nov 2026): price sheets (THB + USD) live in Drive "ThB.Ho (Main) › Hybrid AI Persona Network · ใบราคากลาง" (https://drive.google.com/drive/folders/1GUSstMhFFfClgLYr2PsnNcK5lvUF4CGB) and are sent only to interested people. |
| `ThBHoStudio.html`, `ThBHoMatchDemo.html` | Backups of older versions. Do not link them. |
| `O2OEventsVR.html` | GymMateX O2O · VR plan. |
| `FitFantasy.html` | GymMateX Fit & Fantasy (was `index.html` until 10 Nov 2026). Own 4-language i18n (th/en/ru/zh) inside the page. Persona chat is `fitfantasy-chat.js` (scripted replies; real AI once `FF_CHAT_API` is set to the Worker in `tools/chat-worker/`). Bump its `?v=` after edits. |
| `index.html` | Only a redirect to `ThBHoCreators.html` (keeps ?query and #hash, carries the Creators share tags). Do not put content here. |

Other old HTML files in the repo are legacy pages; leave them alone unless Thor asks.

## Krubb (owned by another chat: do not edit from here)
Since 19 Nov 2026 the Krubb collab page lives in this repo and is built by the chat "KRUBB Bangkok online plan".
- `krubb/index.html` (https://creators.thbho.com/krubb/, noindex), `krubb/media/` (its clips), `krubb/v/<slug>/index.html` (one share page per card), `creator-img/og-krubb*.jpg` (its share images), `KrubbBangkok.html` (old address, redirect only).
- The page is self-contained: it loads none of the shared .js files, so version bumps here never need to touch it.
- Since 21 Nov 2026 Krubb is an installable app (PWA): `krubb/manifest.webmanifest`, `krubb/sw.js`, `krubb/pwa.js`, and a site-wide service worker `/sw.js` (VERSION krubb-v1, scope = whole creators site, skips mp4/Range). They belong to the KRUBB chat. Never delete or rename `/sw.js`.
- This chat does not edit any of those files. If a Creators change needs something on the Krubb page, tell Thor so the KRUBB chat does it.
- The KRUBB chat pushes to `main` often: always merge `origin/main` right before pushing (see Git workflow) and never resolve a conflict in its files by taking this branch's side.

## Shared skills and the Update Log (from 19 Nov 2026)
- Every AI image or video for Thor's work goes through the `thbho-visual-qa` skill (score ≥ 85, no auto-fail; content level is only noted, Thor decides per channel). Doc: https://claude.ai/artifact/GWN3GmBbyNMnVdhJg8N7EJ
- Link-preview images (og:image 1200×630) use the `thbho-share-card` skill (Krubb layout).
- Partner proposal PDFs use the `thbho-proposal-pdf` skill.
- Cross-chat changes are logged in the Claude Doc "ThB.Ho · Update Log" (https://claude.ai/artifact/V4ZkqJETs7jttXdSWSRrt7, PDF copy in Drive › Update Log). When Thor says "อ่าน Update Log", read the newest rows; when he says "สรุปอัปเดตลง Update Log", add this chat's rows at the top of its table.

## Brands, logos and footer links (Thor, 20 Nov 2026)
Full table: Claude Sheet "ThB.Ho Brand Map" (https://claude.ai/artifact/QSoTdNDo8woNKZZqLvfBmJ); copy + logos in Drive "ThB.Ho (Main) › Group & Brand Profile (ThB.Ho)" (logos in its "Logos" folder).
- Hybrid AI by ThB.Ho (https://thbho.com/AIGymmateXFactory.html): the core of every Hybrid AI job; logo = th.ho aperture "CREATING DREAMS". Goes on every page and document.
- WIDEROOMS (https://thbho.com/EngWiderooms.html, house logo): personalized interior design + smart home + real estate only. Never on pages in this repo.
- WIDEROOMS X ThB.Ho = Thor's X account @widerooms (muscle / BL / gay content). Always the full name, never just "WIDEROOMS"; text link to https://x.com/widerooms, never with the house logo. This is the gay-side link used here.
- Hybrid Creator Labs = the brand of this site (content + web/back-office systems for gay creators and gay businesses). The site name stays "ThB.Ho Creators" for now: do not rename pages.
- Hybrid AI Venue Network (brand #6, ThBHoVenues.html): network of gay venues (Krubb = founding hub), 3 rings membership, venue staff/therapists, catalog of lifestyle products (underwear, grooming, sponsor items) sold through venues.
- GYMMATEX (O2OEventsVR.html, FitFantasy.html): fitness · wellness · longevity + O2O / VR for the muscle community: PT and massage courses, Hunk/Fit Academy, wellness trips and retreats, LEV / BODY EVOLT, FitFantasy.
- Hybrid AI Persona Network (decided 26 Nov 2026, page not built yet): network under Hybrid Creator Labs at `HybridAIPersonaNetwork.html`. Public profiles of Hybrid AI personas and opt-in real-face creators (one owner can have a real face + several personas); first round Three, B., Hour; Persona Lab (persona-making service) sold from round 1, no prices until Thor confirms. Real owners stay private (People Hub). Krubb = centre for all collab and O2O events (name it on pages only after NoNy agrees). Staff / therapists get no public real-person profiles. Plan doc: https://claude.ai/artifact/7anWKpAV1Udnu2EdTzFLBF
- Hybrid Creator Labs also owns photo books / prints and the Creator Residency / exchange; the 3SOME universe / novel is persona IP under Hybrid AI by ThB.Ho.
- Socials: X @widerooms ("WIDEROOMS X ThB.Ho") is the main channel for ThB.Ho and all gay-side creator work; IG th_b_ho is supplementary. YouTube channels: @threeandhour (still live; older uploads such as the O2O overview nUAdZZLAhkQ) and @ThreeBestHours (playlists); Thor has several channels and only the one on his main email is closed.
- "Th.Ho" = the original short name / logo wordmark of ThB.Ho (still used).
- Hybrid AI Agent Network (thbho.com/HybridAIAgentNetwork.html): real-estate agent network; not linked from creator pages.

## Sales docs, ads and proposals (Thor, 20 Nov 2026)
Every ad, poster, quotation, proposal or sales document that earns Thor money goes through the `thbho-fortune-check` skill: colours / layout / wording checked against his chart for that month (readings in Drive "ThB.Ho (Main) › AI Personalized Matching › 03", made automatically on the 25th), and, when the recipient is known, matched to their MBTI and chart (Sheet "Match Profiles", tab Profiles only; never use its hidden Private tab). Workflow doc in the same Drive folder. Important documents are saved in subfolders of Drive "ThB.Ho (Main)".

## Colours (chosen by Thor 11 Nov 2026: deep "Water element" darks + gold, no neon pink / neon cyan)
All four pages use the same `:root` variable names, by role: `--bg --s1 --s2 --line` (surfaces), `--accent` (buttons, links),
`--rose`, `--accent2` (small labels). Each page has its own palette on purpose:
| Page | Surfaces | accent / rose / accent2 |
|---|---|---|
| Creators (main) | navy-black `#0A0D16 #111626 #1A2136 #283250` | gold `#E0B96B` / `#C8466F` / aqua `#7FD6D0` |
| Portfolio | cinema black `#0A0A0C #141416 #1D1D21 #2F2F36` | soft yellow `#EBD488` / `#C8466F` / silver-blue `#A9C4DA` |
| CreatorMatch (quiz) | burgundy `#100A0D #1B1116 #281820 #3D2530` | gold `#E8C77A` / `#D0607E` / rose gold `#E3B7A0` |
| Venues | deep-sea teal `#081211 #0F1D1C #172A29 #24403E` | gold `#E0B96B` / `#C8466F` / `#8FD9C8` |
FitFantasy and O2OEventsVR keep their own orange theme.

## Shared files (edit with care: every page uses them)
- `thbho-i18n.js` + `i18n/{zh,ru,ko,ja,es}.js`: 7 languages. In HTML, Thai and English are written inline as
  `<span lang="th">…</span><span lang="en">…</span>`. The other 5 come from the i18n files, keyed by the exact English text:
  add a new key right after the opening `{` of each file. After changing i18n files bump `?v=N` in `thbho-i18n.js` (currently 70).
- `x-media.js`: `window.THBHO_X = {id: {mp4 (~720p), poster, w, h, hd (1080p)}}` for X videos.
- `thbho-player.js`: poster + play button → `<video referrerpolicy="no-referrer">`, swaps to `hd` in full screen.
- `thbho-ytlist.js`: YouTube playlist player that skips videos YouTube refuses to embed.
- `thbho-ref.js` (guest registry, site side): remembers in localStorage where a visitor first came from (`?src=` / utm, referrer), clips opened (`data-x`) and the quiz result, and pre-fills each form's "รหัสอ้างอิง · Reference" question (`FORMS` = collab + venue, published /d/e/ addresses and entry ids; from `tools/setup-guest-registry.gs` and `tools/setup-venue-registry.gs`, which build the "Guests" and "Venue Guests" tabs). Form iframes are `<iframe data-form="collab|venue">` with no `src`; new-tab links are `<a data-form-link="collab|venue">`: thbho-ref.js loads it when the visitor gets near it. Tracked links for posts: `https://creators.thbho.com/ThBHoCreators.html?src=x&clip=<x id>` (src: x, ig, tiktok, youtube, line, facebook; optional `&c=<campaign>`).
- `thbho-home.js`: the half-cut house infographic (`<div class="thome" data-home></div>`), 7 languages inside the file, colours from the page's `:root`. Room states (lit = in daily use, dashed = waiting) are in `ROOMS` and the garden/pavilion lines: update them when a room opens, and bump `?v=` on Creators, Venues and DigitalHome.
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
8. Personas: Three (INFP · Storyteller), B. (INFJ · Strategist), Hour (ESTP · The go-getter, Thai "สายลุย"). Content levels 1 Art / 2 Partial / 3 Private 20+.

## Portfolio data (`FILMS` in ThBHoPortfolio.html)
One object per card, newest first:
`{id:'<x id>',cat:'mv'|'film'|'bts'|'photo',t:'Title',p:["three","b","hour"],y:2026,d:'8 Mar 2026',v:'6.7K',vn:6721,ln:26,ts:<unix>,dur:'6:09'}`
- `u:'threeandhour'`: the post is on @threeandhour (default account is @widerooms).
- YouTube card: `{id:'yt-<ytid>',yt:'<ytid>',…,v:'',vn:0,…}` with poster `creator-img/yt-<ytid>.jpg`. Unlisted YouTube videos show no views/likes.
- Photo card: `cat:'photo'` with `img:[…]`.
- Clips over 30 days old with under 6K views show no view/like numbers (worked out in the page from `ts` and `vn`, so it updates itself).
- Theme filter: every row ends with `th:'…'`, one or more of `beach fantasy scifi city studio love` (space separated). The add scripts do not set it; add it by hand or the clip shows under no theme.

Add X posts with the scripts (run from the repo root, they read api.fxtwitter.com):
- `python3 -I tools/add_x_post.py --dry <id|url> …` then without `--dry` (add `--account threeandhour` for @threeandhour posts).
- `python3 -I tools/add_x_photo.py --dry <id|url> …` for photo posts.
The scripts guess category and personas; fix them by the rules above before committing.

Daily view/like refresh: `.github/workflows/refresh-views.yml` runs `tools/refresh_views.py` once a day at 22:17 UTC (05:17 Bangkok; GitHub often starts it 1–3 h late, so expect it in the morning) and commits to `main` as thbho-bot. It only updates numeric X ids (YouTube rows are skipped).
Weekly report: `node tools/weekly_stats.js` (after `git fetch --depth 400 origin +main:refs/remotes/origin/main`) prints the week's numbers as JSON from the bot commits. A scheduled task adds them every Monday as a new section at the top of the Claude Doc "ThB.Ho Creators · รายงานยอดวิว X รายสัปดาห์" (https://claude.ai/artifact/RnkemFbp6jKzxmgr2a5SqA). "Gain" for the whole week = clips listed all week; day-over-day bars = all clips listed on both days (new clips count from the day they were added).

## Git workflow
- Work on branch `matching-demo`, publish by pushing it to `main`. Always merge `origin/main` first, because the daily bot commits there:
  ```
  git fetch -q origin +main:refs/remotes/origin/main && git merge -q --no-edit origin/main
  git push origin matching-demo && git push origin matching-demo:main
  ```
- No force push, no rebase of published history.
- After pushing, watch `gh run list -R ThreeAndHour/GymMateX --workflow pages-build-deployment -L 1`. If a Pages build hangs, `gh run rerun <id>` or push an empty commit.
- Check the live page at https://creators.thbho.com/<page> (curl works) and look at it on phone and desktop widths before telling Thor it is done.

## Other references
- Collab form: https://docs.google.com/forms/d/1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y/edit (edit in place with `tools/update-collab-form.gs`; the older `rebuild-collab-form.gs` wipes the form and must not be run). Embedded in `#apply` with `?embedded=true`. Public address (use this for links and prefill; the /d/1H0q… address redirects and drops prefill): https://docs.google.com/forms/d/e/1FAIpQLSeMq_JTFGpiQJKP_9g-QZOdutqorRxWlo_YVePwwGsQq9kePQ/viewform
- Guest registry (ran 17 Nov 2026 with project "ThB.Ho Creators form setup" on script.google.com): responses Sheet https://docs.google.com/spreadsheets/d/1OPFoIURCKrcfU1Ulph0tXWtX7HM0KgtukgH14wQkux0/edit (tab "Guests"), reference question prefill `entry.363909456`. Venue partner form (created 17 Nov 2026 by setup-venue-registry.gs, same Sheet, tab "Venue Guests"): https://docs.google.com/forms/d/e/1FAIpQLSeudlIR0rNawtQ8d0plhZ_3cuBJ194bHNKQ8i6p6M38k7ipqQ/viewform, prefill `entry.1547059447`. The Apps Script project holds update-collab-form + setup-guest-registry + setup-venue-registry; its form id is in Script Properties (VENUE_FORM_ID). Guests tabs use INDIRECT ranges because each new response inserts a row.
- YouTube playlist on Creators: `PLLS5V99ZfVi-FKQv0txA63aTHqNIZVLPl`.
- Domain, Google Analytics and cross-site plans live in the Claude Docs doc "ThB.Ho · Domain & Analytics Roadmap" and are handled in a separate core chat.
