# Lorena Marcos · Immersive Data Science Portfolio

**[lorenamarcos.dev](https://lorenamarcos.dev)** · A rainy, neon-lit street at night where every shop is one of my projects, and every project opens working.

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![R](https://img.shields.io/badge/R-276DC3?logo=r&logoColor=white)
![Tests](https://img.shields.io/badge/tests-120%2B-2ea44f)

---

## What you can do in it

| Shop on the street | Project | Inside |
|---|---|---|
| 🏁 Main building | **RaceTrack**, my full-stack race platform | A working replica with fictitious data: search races on a map, register, get a bib with a QR code |
| 🏫 School | **Child poverty in Spain** (INE ECV 2024) | Build a household and see its weighted AROPE rate |
| 🚕 Taxi stand | **Ride-sharing data quality** (150k bookings) | Switch on each cleaning step; a 3D cloud of LOF outliers |
| 🏠 Estate agency | **Rental market & inequality** | Tenants vs landlords: income classes, percentiles and P90/P10 |
| 🧾 Accountant's office | **Fiscalis data model** | Issue a test invoice and watch it flow through the tables |
| 🛠️ Workshop | **How this site was built** | The process, my decisions and the image prompts |

In a hurry? **Recruiter Mode** shows everything on one fast page, and it is also what you get on devices without WebGL or with reduced motion.

## How it works

- **Photorealistic street with real 3D motion.** Each street image was generated with ChatGPT from my prompts ([`docs/prompts-imagenes.md`](docs/prompts-imagenes.md)). A depth map from *Depth Anything V2* displaces a dense mesh, so the camera moves inside the photo with real parallax.
- **Neon signs drawn by code**, with bloom and flicker, so they can be translated and animated. Rain is computed in a shader.
- **No backend.** R scripts in [`analysis/`](analysis/) recompute every figure from the official microdata and must reproduce my published reports before writing the JSON the site reads.
- **Tested.** 120+ Vitest tests cover navigation, routing, i18n, overlay accessibility (focus trap, Escape), every project's logic, and that the RaceTrack demo never makes a network request.
- **Fast first load.** The 3D code is a separate chunk (~280 kB gzip); the initial bundle is ~60 kB (both languages included).

The full explanation, in Spanish, is in [`docs/como-funciona.md`](docs/como-funciona.md).

## How it was built

I designed it and built it with AI: I set the concept, the references, the look, which projects appear and the honesty rules (no invented projects or figures). Claude Code proposed options, wrote the code and tests, and drafted the image prompts that I generated in ChatGPT. The process is documented in [`docs/`](docs/).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run build
```

Regenerate the data (requires the ECV microdata and the Kaggle dataset, see [`analysis/README.md`](analysis/README.md)):

```bash
Rscript analysis/export_arope.R path/ECVpersona.RData public/data
```

Regenerate a scene's depth map:

```bash
node tools/depth/make_depth.mjs path/original.png public/scenes/<scene>
```

---

**Lorena Marcos** · Applied Data Science, Universidad Complutense de Madrid · [LinkedIn](https://www.linkedin.com/in/lorena-marcos-6516272b5/) · [GitHub](https://github.com/Lorenadata)
