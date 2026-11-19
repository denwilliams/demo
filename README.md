# Orbit — a React demo playground

A small, deliberately fictional UI for trying out buttons, styles, and interactions.
Built with React and Vite; no backend, accounts, credentials, API calls, remote fonts,
or real customer data. All state lives in memory and disappears on reload.

## Local setup

Use **Node.js 24 LTS (24.15 or later)** with npm. `.nvmrc` selects Node 24 if you use nvm.
Clean installation, tests, and the production build have been verified on Linux x64
with Node **24.22.0** and npm **10.9.4** and **11.6.2**.

```sh
nvm use                 # optional, with nvm installed
npm ci
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

```sh
npm test                # interaction tests, once
npm run test:watch      # interaction tests while editing
npm run build           # production static files in dist/
npm run preview         # serve dist/ locally, normally http://localhost:4173
npm run check           # tests and production build
```

This is plain JavaScript/JSX; there is no separate TypeScript compilation step.
`npm run preview` is a local smoke-test server, not a production hosting service.

## Try the demo

- **Launch demo** shows a local status message using your pretend callsign.
- **Next idea** cycles through three fictional postcards and clears the saved toggle.
- **Save idea / Saved** toggles a local selection, with `aria-pressed` feedback.
- **Clap** increments a counter; buttons also work with keyboard activation.
- **Coming soon** is an intentionally disabled button style.
- **Reset playground** restores the starting idea, callsign, counter, and saved state.

Feedback uses a live status region. There are visible focus styles, a skip link, and
a single-column mobile layout. Nothing is submitted, persisted, or sent to a service.

## Make it your own

- `src/App.jsx`: fictional `ideas`, page sections, `IdeaCard`, and interaction state.
- `src/styles.css`: colors, button variants, artwork, spacing, and mobile breakpoint.
- `src/App.test.jsx`: interaction checks using Vitest and Testing Library.
- `index.html`: title, description, and HTML shell.
- `vite.config.js`: React tooling and DOM test setup.

Keep experiments local or add tests when changing behavior. The abstract postcard
artwork is CSS and text, so there are no image downloads or asset services to configure.

## Cloudflare Pages hosting (instructions only)

The production result is a static site; Cloudflare Pages can host `dist/` without a
Worker, database, secrets, or environment bindings. No Cloudflare resources have
been provisioned or deployed by this project. Deployment needs separate approval.

After review, merge approval, and separate deployment authorization:

1. In Cloudflare Pages, create a project and connect `denwilliams/demo`.
2. Select the approved production branch (`main` once the PR is merged).
3. Set the root directory to the repository root, the build command to
   `npm run build`, and the build output directory to `dist`.
4. Set the build environment's `NODE_VERSION` to `24.22.0` (or another supported
   Node 24 version at least 24.15). For an explicitly versioned, locally verified
   toolchain, also set `NPM_VERSION` to `10.9.4`; npm `11.6.2` was verified as well.
   The lockfile supports both tested npm versions; no special npm install flags
   are required. Install with `npm ci` if configuring dependency installation explicitly.
5. No application environment variables or secrets are required. Deploy only after
   authorization, then verify the root page, buttons, and mobile layout on the Pages URL.

Alternatively, once authorized, upload the contents of a locally generated `dist/`
using a Pages Direct Upload project. Upload the build, not `src/` or `node_modules/`.
There is no client-side router or custom server configuration to deploy.
Never put secrets in `VITE_*` variables: those values become public browser assets.

### Clean-install verification and lockfile maintenance

From a fresh checkout with the toolchain above, run:

```sh
node --version
npm --version
npm ci
npm run check
git diff --exit-code -- package.json package-lock.json
```

Do not run `npm install` before this verification: `npm ci` must succeed using the
committed lockfile without updating it. `npm run check` runs all interaction tests
and the production build. No separate typecheck is configured for this JavaScript app.

The original lockfile installed with npm 11.6.2 but failed npm 10.9.4 validation:
`@emnapi/core` and `@emnapi/runtime` were missing from the optional Rolldown WASM
dependency tree, even though the root manifest and lockfile entries matched. The
lockfile now includes those dependencies; application and existing tooling versions
are unchanged. This reproduced the reported error locally, but the failing
Cloudflare environment's exact Node/npm versions and install flags were not supplied.

When intentionally updating dependencies, regenerate the lockfile in a checkout
without `node_modules` using `npm install --package-lock-only` with a tested npm
version, then repeat the clean-install checks with both npm versions. Commit the
lockfile with any manifest changes; do not bypass validation with `--force` or
`--legacy-peer-deps`, or omit build-time dependencies to hide install errors.

### Rollback

In a future Pages deployment, select the previous successful production deployment
in Cloudflare Pages and use **Rollback to this deployment**. For source changes,
revert the relevant commit via a reviewed PR and rebuild. This change itself does
not deploy anything or add automatic deployment workflows.
