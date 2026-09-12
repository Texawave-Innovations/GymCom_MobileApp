# Legend image replacement spec

Goal: replace every photo/GIF of a real, identifiable bodybuilder with
**photorealistic AI images of anonymous athletes** — no recognizable person,
no logos, no text.

## Rules for every image

- **Anonymous**: face turned away, shadowed, cropped above the mouth, or
  back-to-camera. The image must not resemble any real person.
- **No text / no logos / no watermarks / no brand names.**
- sRGB. Export **WebP or JPG**, quality ~80, aim < 300 KB each.
- Color grade: warm gold highlights on near-black background (matches the
  app's gold `#E9C176` on charcoal `#131313`).
- The bottom ~35% of every image gets covered by a dark gradient in the app —
  keep faces/critical detail in the **upper half**.
- Deliver with the **exact filenames below**, into `assets/` (note the space
  in `mike mentzer.webp`).

## Shared style suffix (append to each prompt)

> photorealistic, shot on 85mm, natural window light in an old-school gym,
> subtle film grain, muted contrast, tanned skin, low camera angle,
> dark background, warm gold-and-black color grade, face obscured / turned
> away / cropped, anonymous, no visible identifiable face, no text, no logos,
> no watermark, not a celebrity, anatomically correct, single subject

Negative: `text, watermark, logo, brand, celebrity likeness, extra limbs, deformed hands, cartoon, cgi`

---

## Group A — Legend portrait (1200 × 1600, 3:4 portrait)

Used as the grid card on the Legends screen **and** the 380px hero on the
Legend Profile screen (`contentPosition: top center` — keep head in the top third).

| Filename | Prompt (+ shared suffix) |
|---|---|
| `new-img.webp` | Tall, broad-shouldered male bodybuilder, classic 1970s Gold's Gym physique, relaxed front stance, arms slightly flared, golden-era aesthetic |
| `zane-img.webp` | Lean male classic-physique athlete, small waist, vacuum / side-abdominal pose, highly defined, aesthetic proportions |
| `olivia-img.webp` | Extremely muscular male bodybuilder, tiny waist, overhead victory pose seen from behind, 1960s vibe |
| `franco-img.webp` | Short, stocky, powerlifter-built male bodybuilder, chalked hands, standing beside a loaded barbell |
| `yates-img.webp` | Massive male bodybuilder in a dark, gritty dungeon-style basement gym, rear/side view, dramatic low-key lighting, 1990s mass-era |

## Group B — Home carousel card (1080 × 1350, 4:5 portrait)

Horizontal "Train Like a Legend" cards on Home (220×280, cover-cropped).

| Filename | Prompt (+ shared suffix) |
|---|---|
| `arnold.webp` | Broad muscular male bodybuilder, side-chest pose, classic golden-era build, gym in soft focus behind |
| `mike mentzer.webp` | Thick, dense muscular male in his mid-30s, mid-set intensity, gripping a heavy dumbbell, sweat, HIT / heavy-duty mood |
| `tom-platz.webp` | Male athlete with extreme quadriceps development, deep barbell squat mid-rep, chalk dust in the air |
| `kevin-levroni.webp` | Muscular 1990s-era male bodybuilder, rear lat spread, wide back, stage-tan, dark backdrop |

## Group C — Home hero background (1440 × 2160, 2:3 portrait)

Full-bleed background behind the "TRAIN HARD. BUILD LEGACY." title. Must read
well very dark; leave the **top third mostly empty / low-detail** for the headline.

| Filename | Prompt (+ shared suffix) |
|---|---|
| `hero-page.jpg` | Moody wide shot of an old-school iron gym at dawn, rack of worn dumbbells, chalk haze, a lone anonymous lifter in silhouette, heavy shadows, cinematic |

## Group D — Split banner (1600 × 1000, landscape)

Hero banner on each split screen (full width × 260) and the workout card image
on the Workouts screen (× 210). Landscape, action-oriented, subject roughly centered.

| Filename | Prompt (+ shared suffix) |
|---|---|
| `splitarnold.jpg` | Anonymous muscular male doing a barbell back squat in a gritty gym, wide landscape framing, motion energy |
| `splitmike.jpg` | Anonymous muscular male doing a heavy one-arm dumbbell row to failure, dramatic side light, landscape |
| `tom-platz-workout.png` | Anonymous male athlete deep in a barbell squat, chalk on the bar, plates loaded, landscape (export as PNG or swap to .webp — see code notes) |
| `splitkevinlev.webp` | Anonymous muscular male seen from behind on a seated cable row, wide back flexed, landscape |

---

## Code changes (I'll apply once the files are in `assets/`)

1. `screens/HomeScreen.tsx` — `tom-platz.gif` → `tom-platz.webp`,
   `kevin-levroni.gif` → `kevin-levroni.webp`.
2. `screens/LegendProfileScreen.tsx` — `DEFAULT_PROFILE.image` currently loads a
   remote `lh3.googleusercontent.com/aida-public/...` URL; point it at
   `require('../assets/yates-img.webp')`.
3. If `tom-platz-workout.png` is delivered as `.webp` instead, update the
   `require` in `screens/PlatzSplitScreen.tsx` and `screens/WorkoutsScreen.tsx`.

## Delete (unused, still copyrighted — safe to remove now)

`assets/img-arnold`, `assets/img-arnold-sch.webp`, `assets/splitkevin.webp`,
`assets/gymcom.gif`, and the two old GIFs (`tom-platz.gif`, `kevin-levroni.gif`)
after the swap.

## Not covered here (already fine)

The exercise / circuit photos are Pexels-licensed stock
(`images.pexels.com/...` in `data/exerciseImages.ts`, `WorkoutsScreen.tsx`,
`CircuitSplitScreen.tsx`, `WorkoutSplitScreen.tsx`). Free for commercial use —
though you should download and self-host them rather than hotlink.
