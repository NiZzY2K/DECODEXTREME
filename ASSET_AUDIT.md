# DecodeXtreme — Rebuild v2 asset readiness audit

Date: 25 October 2026, Asia/Colombo.

Reference: C:/Users/lamid/Documents/MyFiles/projects/CODEEXTREME/NEW-VERSION/DecodeXtreme_Rebuild_Plan_v2.md

## Verdict

**Enough source material exists to begin the rebuild, but the repository does not yet have all production-ready assets required by the plan.**

The main missing delivery assets are the four frame sequences, mobile stills, rank emblems, social-share image, and Kasun's portrait. The character and foreground images exist, but do not have the transparency needed for the planned layered composition.

This was an audit only. The plan was used as a requirements reference. No generation commands were executed, dependencies installed, assets converted, or application files changed. This report is the only added file.

## Verification performed

- Compared the plan's master list, folder tree, mobile requirements, and proposed manifest with current repository files.
- Decoded all 20 supplied WebP images to check format, dimensions, image mode, transparency, and file size.
- Visually inspected the hero/leap posters, all four mission plates, far-city plate, female standing image, and foreground ledge.
- Inspected MP4 container track headers/sample tables for dimensions, duration, frame counts, codecs, and keyframe counts.
- Inspected MPEG audio frames for approximate MP3 durations.
- Checked active application asset references, fonts, route structure, metadata, and relevant package declarations.
- Did not perform full video playback/decoding, listen to audio, validate rights/provenance, or compare characters with absent reference sheets.

## Inventory summary

| Category | Actual files |
| --- | ---: |
| WebP images | 20 |
| MP4 videos | 2 |
| MP3 audio files | 4 |
| Total files under public/media, excluding sidecars/placeholders | 26 |
| Local Satoshi font files, under app/fonts | 2 |
| Generated sequence frames | 0 |
| Zone.Identifier sidecars | 26 |
| Empty-folder .gitkeep placeholders | 5 |

The repository is now a Next.js scaffold using app/, rather than the previous src/ React/Vite layout. Findings below are based on the current files.

## 1. Required preparation and missing assets

### 1.1 Frame sequences: all four are empty

The folders exist, but each contains only .gitkeep:

- public/media/sequences/hero/desktop/
- public/media/sequences/hero/mobile/
- public/media/sequences/leap/desktop/
- public/media/sequences/leap/mobile/

The plan's canvas playback requires actual f_0001.webp, f_0002.webp, etc. MP4 files alone do not supply these assets.

Both current video tracks contain 240 frames over 10 seconds at 24 fps. If their full lengths are retained, exporting at 24 fps would nominally produce 240 desktop frames per sequence; exporting at 20 fps would nominally produce 200 mobile frames. Record the actual exported counts in the future asset manifest.

The plan's example 144/120 counts must not be copied without checking the resulting files. Its own 8-second hero specification would imply approximately 192/160 frames at 24/20 fps, while its 6-second Leap would imply 144/120.

### 1.2 Transparent layers are not prepared

All six characters and the foreground ledge are genuine WebP files, but their decoded mode is RGB, with no alpha channel:

- public/media/images/characters/female/standing.webp
- public/media/images/characters/female/overshoulder.webp
- public/media/images/characters/female/crouch.webp
- public/media/images/characters/male/standing.webp
- public/media/images/characters/male/overshoulder.webp
- public/media/images/characters/male/crouch.webp
- public/media/images/scenes/creed/fg.webp

The inspected character and ledge show solid grey backgrounds. They are source artwork, not finished transparent cut-outs. Those backgrounds would cover the other layers during parallax.

Required preparation: remove the backgrounds, preserve fine edges, and export actual WebP alpha. Check edges against both Ice White and Deep Navy. The plan classifies standing/over-shoulder poses and the ledge as P0; crouches are P1.

### 1.3 Mobile still variants are missing

Explicitly referenced by the proposed manifest:

- public/media/images/scenes/hero/poster-m.webp
- public/media/images/scenes/mission/01-awareness-m.webp
- public/media/images/scenes/mission/02-fundamentals-m.webp
- public/media/images/scenes/mission/03-strategy-m.webp
- public/media/images/scenes/mission/04-prextreme-m.webp

Also absent:

- public/media/images/scenes/leap/poster-m.webp

The last file is implied by the plan's instruction to supply a portrait crop of every 16:9 asset, but its example manifest does not include a Leap mobile-poster field. Resolve that small spec inconsistency during implementation.

A blind center crop will cut off the left delegate in several mission scenes. Mobile variants need deliberate focal positioning; some scenes may need a different composition to retain both characters.

### 1.4 Other missing assets

| Expected file | Plan priority | Finding |
| --- | --- | --- |
| public/media/images/team/kasun-jayawardena.webp | P0, from plan roster | Missing. Lamidu is the only real portrait currently supplied. |
| public/media/images/ranks/champion.webp | P1 | Missing; ranks folder contains only .gitkeep. |
| public/media/images/ranks/runner-up-1.webp | P1 | Missing. |
| public/media/images/ranks/runner-up-2.webp | P1 | Missing. |
| public/media/images/brand/og-1200x630.jpg | P1 | Missing. |
| public/media/video/hero/hero-ambient-loop.mp4 | P2 | Missing, optional. |

The existing team placeholder can cover a missing portrait temporarily. It does not establish that the plan's named member portrait has been supplied.

### 1.5 Favicon format and composition need correction

These three files are byte-for-byte identical:

- app/favicon.ico
- public/media/images/brand/favicon.webp
- public/media/images/brand/logo.webp

They contain the 3840 × 1188 wide DecodeXtreme wordmark. The app/favicon.ico file starts with RIFF/WEBP bytes; it is not an ICO image despite its extension.

A proper compact favicon is needed. Merely renaming a WebP file to .ico does not convert its format. The current wide wordmark is also poorly suited to a small square browser icon.

## 2. Video verification

| Field | Hero | Leap |
| --- | --- | --- |
| File | public/media/video/hero/hero-scrub.mp4 | public/media/video/leap/leap-scrub.mp4 |
| File size | 3,833,901 bytes | 6,512,100 bytes |
| Actual video dimensions | 1280 × 720 | 1280 × 720 |
| Actual video duration | 10.0 seconds | 10.0 seconds |
| Video sample count | 240 | 240 |
| Average frame rate | 24 fps | 24 fps |
| Codec identifier | avc1 / H.264 | avc1 / H.264 |
| Sync samples / keyframes listed | 1 | 1 |
| Audio track | mp4a / AAC, approximately 10.027 seconds | mp4a / AAC, approximately 10.027 seconds |
| Plan target | 8 seconds, 24 fps, 1080p | 6 seconds, 24 fps, 1080p |

Implications:

- The files are usable source candidates but do not match the planned duration or 1080p specification.
- Choose whether to retain 10-second scenes and adjust the timings, trim approved portions, or obtain the intended masters. This audit does not make that creative choice.
- Upscaling a 720p source does not recover native 1080p detail.
- Despite their names, these are not all-keyframe encodes. Each sample table lists only one keyframe. They therefore do not match the plan's proposed all-keyframe direct-video-scrubbing alternative.
- Canvas frame sequences can be derived independently of that alternative.
- The embedded audio should not accidentally play alongside the separate music track.
- The plan's 5 MB desktop / 2.5 MB mobile limits apply to delivered frame sequences. Those limits cannot be evaluated while all four sequences are empty.
- Poster-to-first-frame alignment, continuous-shot quality, the hero close-up, and the Leap ending in whiteout still need playback review. File metadata does not prove those narrative requirements.

## 3. Image inventory and technical results

Paths in this table are relative to public/media/images/. KB means decimal kilobytes.

| File | Dimensions | Size KB | Alpha transparency | Readiness note |
| --- | --- | ---: | --- | --- |
| brand/logo.webp | 3840 × 1188 | 47.7 | Yes | Event logo present. |
| brand/favicon.webp | 3840 × 1188 | 47.7 | Yes | Same wide wordmark as logo; needs favicon-specific replacement. |
| brand/ieee-cs-logo.webp | 822 × 332 | 14.2 | Yes | Organizer logo present. |
| brand/sltc-sb-logo.webp | 5050 × 979 | 65.3 | Yes | Organizer logo present. |
| characters/female/standing.webp | 1024 × 1536 | 72.8 | No | Background removal required. |
| characters/female/overshoulder.webp | 1024 × 1536 | 73.6 | No | Background removal required. |
| characters/female/crouch.webp | 1536 × 1024 | 100.0 | No | Background removal required. |
| characters/male/standing.webp | 1024 × 1536 | 93.7 | No | Background removal required. |
| characters/male/overshoulder.webp | 1024 × 1536 | 82.7 | No | Background removal required. |
| characters/male/crouch.webp | 1536 × 1024 | 116.0 | No | Background removal required. |
| scenes/creed/far.webp | 1586 × 992 | 279.6 | No, appropriate | City plate present; below target 2560 × 1600. |
| scenes/creed/fg.webp | 2172 × 724 | 102.2 | No | Background removal required; below target 3200 × 900. |
| scenes/hero/poster.webp | 1672 × 941 | 286.0 | No, appropriate | Present; below target 2560 × 1440. |
| scenes/leap/poster.webp | 1672 × 941 | 293.4 | No, appropriate | Present; below target 2560 × 1440. |
| scenes/mission/01-awareness.webp | 1672 × 941 | 262.6 | No, appropriate | Present; below target 2560 × 1440. |
| scenes/mission/02-fundamentals.webp | 1672 × 941 | 245.2 | No, appropriate | Present; below target 2560 × 1440. |
| scenes/mission/03-strategy.webp | 1672 × 941 | 252.1 | No, appropriate | Present; below target 2560 × 1440. |
| scenes/mission/04-prextreme.webp | 1672 × 941 | 243.9 | No, appropriate | Present; below target 2560 × 1440. |
| team/placeholder.webp | 1122 × 1402 | 202.8 | No, appropriate | Present, approximately 4:5 and above the 1000 × 1250 target. |
| team/lamidu-rathnayake.webp | 1638 × 2048 | 105.7 | No, appropriate | Present, approximately 4:5 and above the target. |

All 20 supplied image files decoded successfully as WebP. All stills are below 300 KB, and all six character images plus the foreground image are below 400 KB. File sizes meet the plan's budgets, but that does not resolve missing alpha or lower source resolution.

The standing and over-shoulder images are 1536 pixels high; crouches are 1024 pixels high. They are below the plan's approximate 2000-pixel character specification. Use higher-resolution source exports if available; assess required display size before deciding whether current resolution is sufficient.

Visual observations:

- The hero, Leap, far city, and mission plates share a consistent light coastal-city setting and cyan accents.
- The mission art depicts the intended overview, training, planning-table, and challenge-gate scenes.
- The far-city image provides a clear sky area.
- The desktop plates are not automatically suitable for the plan's prescribed portrait crops.
- The foreground is 3:1. The plan's prompt calls for 3:1, while its 3200 × 900 master specification is about 3.56:1. Choose a final intended aspect ratio before export.

## 4. Audio and fonts

### Audio

All four expected MP3 files are present. Approximate durations below are calculated from MPEG frames, rather than playback; encoder padding may affect exact audible duration.

| File under public/media/audio/ | Approximate duration | Finding |
| --- | ---: | --- |
| bgm/the-measured-thought.mp3 | 180.32 seconds | Existing music available. |
| sfx/sync-tick.mp3 | 2.38 seconds | Longer than plan's under-1-second target. |
| sfx/whoosh.mp3 | 2.38 seconds | Longer than plan's under-1-second target. |
| sfx/sync-complete.mp3 | 1.91 seconds | Longer than plan's under-1-second target. |

The three UI sounds are optional P2 polish. If used for quick interactions, they need selection/trimming to the intended duration and a listening review. Equal file sizes for tick and whoosh do not mean they are identical: their SHA-256 hashes differ.

### Fonts

- app/fonts/Satoshi-Variable.woff2 — present and referenced by app/layout.tsx.
- app/fonts/Satoshi-VariableItalic.woff2 — present and referenced by app/layout.tsx.

This is a valid location for the Next.js local-font setup. The absence of public/fonts/ is not an asset gap.

## 5. Source material and housekeeping

Not found in this repository:

- art-source/
- Female and male character reference sheets.
- Raw image generations and PNG/PSD cut-out masters.
- Separate hero_raw.mp4 / leap_raw.mp4 masters.
- Optional I1b hero close-up end-frame source.

These are production/revision inputs, not deployment blockers if the existing final art is approved. Their absence prevents checking character fidelity against the intended reference sheets.

There are 26 files whose names end in Zone.Identifier, corresponding to the 26 media files. These are download metadata sidecars, not usable website assets. They can be excluded from deployment during cleanup; nothing was deleted in this audit.

The preloader helix, haze, rings, eye-glint mask, chapter rail, route line, and other SVG/CSS/canvas effects are intended to be generated by code. No separate raster files need to be supplied for those elements.

## 6. Implementation gaps, separate from missing assets

These do not change the asset count, but will need work during the rebuild:

- No central assets.js/assets.ts manifest or equivalent config folder exists yet.
- No frame counts or current roster-to-portrait mapping exist in application configuration.
- Current home and teams pages are scaffold placeholders; supplied scene/media assets are not yet integrated.
- Current route is /teams; the plan expects /team. No alias/redirect is configured.
- GSAP, @gsap/react, and Motion are available. Motion includes the intended Framer Motion foundation.
- Lenis is not installed.
- Metadata still says Create Next App / Generated by create next app.
- The body font is overridden to Arial despite loading Satoshi.
- CSS currently includes an automatic dark-mode switch.
- Navbar is placed directly inside html before body in app/layout.tsx.

Only the two font references are currently active media references in source, and both resolve with exact filename casing. Since scene assets have not yet been wired up, a clean reference check is not evidence that the complete rebuild is ready.

## 7. Recommended preparation order

1. Decide the final approved video durations/resolution and confirm shot continuity, first-frame poster matches, and Leap whiteout.
2. Prepare alpha cut-outs for the characters and foreground.
3. Export the four actual desktop/mobile sequences; measure their delivery size and record real frame counts.
4. Create the mobile poster and mission crops using deliberate focal placement.
5. Supply Kasun's portrait or explicitly approve the existing placeholder for that profile.
6. Add the three rank emblems, proper favicon, and OG image.
7. Add the asset manifest and integrate the current files into the new sections.
8. Finish optional sound trims, ambient loop, reference archive, and sidecar cleanup.

Development can start now with the supplied sources and temporary fallbacks. Completing the exact planned visual experience requires the missing exports and corrections above.
