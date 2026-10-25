# DecodeXtreme 2026

Next.js implementation of the **Awaken hero and navigation only**, using the supplied rebuild plan and video.

## Development

Use Node.js 20.9+ (the workspace has Node 24 through nvm).

~~~sh
npm install
npm run dev
~~~

Open http://localhost:3000. Production verification: npm run build.

## Hero behavior

The opening poster is the exact first frame of the supplied video. Scroll advances or reverses a pinned canvas sequence. The headline reconstructs in three stages, fades as the camera moves closer, and reveals the final calls to action after 80% progress.

Navigation reveals with the first scroll. Desktop navigation stays transparent. Mobile navigation uses white frosted glass, and its open menu covers the viewport, hides hero controls, and locks page scrolling until closed. The hero uses the original directional Ice White gradients, with dark navy text and teal accents. The closing invitation fades into a pale veil. Register opens a keyboard-accessible dialog. Links to unbuilt chapters show a coming-soon notice; no other sections or team page were built in this pass.

Reduced-motion and data-saver visitors get the poster and visible content without pinning or frame downloads. Mobile uses a shorter scroll and a portrait sequence. Decoded frames use a bounded moving cache; the remaining compressed files prefetch when the browser is idle.

## Configuration

app/config/index.ts owns copy, links, asset paths, frame counts, and scroll timings. Scroll animation is owned by GSAP/ScrollTrigger, smooth scrolling by Lenis, and the final invitation's state reveal by Motion.

Hero assets:

| Variant | Frames | Dimensions | Total |
| --- | ---: | --- | ---: |
| Desktop | 150 | 1152 x 648 | 4.40 MB |
| Mobile | 120 | 450 x 800 | 1.62 MB |

The source video and original artwork are preserved. To regenerate the delivery assets with Python 3 and FFmpeg:

~~~sh
python scripts/prepare-hero.py
~~~

Use --ffmpeg /path/to/ffmpeg if it is not on PATH. If export settings change, update the counts in app/config/index.ts.



