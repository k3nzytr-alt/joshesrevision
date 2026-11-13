# Revise

A GCSE revision site with accounts, so your progress (XP, streak, weekly minutes, exam marks, calendar events and so on) syncs between your phone and laptop.

- `server.js` is a tiny Node server with no dependencies. It serves the site and stores accounts and progress.
- `public/` holds the site itself.

You need **Node 18 or newer**.

## Run it on your own computer

```
node server.js
```

Then open http://localhost:3000, create an account, and sign in with the same details on your phone. To use it from your phone this way, your phone must be on the same Wi-Fi and you open `http://YOUR-PC-IP:3000`.

## Put it online

Pick one of these.

### Option A: Render + Upstash (free, recommended)

Render's free plan has no permanent disk, so progress is stored in a free Upstash Redis database instead.

1. Go to **https://upstash.com**, sign up, and click **Create database** (Redis, any region near the UK).
2. On the database page, open the **REST API** section. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. Put this folder in a GitHub repo.
4. Go to **https://render.com**, then **New → Web Service**, and connect the repo.
   - Runtime: **Node**
   - Build command: *(leave blank)*
   - Start command: `node server.js`
   - Instance type: **Free**
5. Under **Environment**, add the two variables from step 2. Then click **Deploy**.

On the free plan the site sleeps after about 15 minutes with nobody using it. The first visit after that takes around 30 seconds to wake it up. Your data is safe in Upstash either way.

### Option B: Railway (simple, uses a volume)

1. Go to **https://railway.app**, then **New Project → Deploy from GitHub repo**.
2. Add a **Volume** to the service, mounted at `/data`.
3. Add the variable `DATA_DIR=/data`.
4. Railway sets `PORT` for you, and the start command is `node server.js` (from `package.json`).

### Option C: Any VPS, Raspberry Pi or Docker host

```
docker build -t revision-hq .
docker run -d -p 3000:3000 -v revision-data:/data revision-hq
```

Or run `node server.js` with `pm2` or `systemd`. Back up the `data/` folder now and then.

## Settings (environment variables)

| Variable | What it does |
|---|---|
| `PORT` | Port to listen on (default 3000). |
| `DATA_DIR` | Where accounts and progress are saved when Upstash isn't used (default `./data`). |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Store data in Upstash instead of files. |
| `ALLOW_SIGNUPS` | Set to `false` once you've made your account, so nobody else can sign up. |

## How syncing works

- The first time you open the site, it asks you to sign in or create an account.
  - **Creating an account** uploads whatever progress is already on that device.
  - **Signing in** on another device loads your saved progress.
- After that, every change saves to the server a couple of seconds later.
- When you switch back to the tab, it pulls in anything newer from your other devices. If two devices save at the same time, the newest save wins.
- Passwords are hashed with scrypt, and you're locked out for 15 minutes after 10 wrong attempts.
- "Use on this device only" skips accounts. You can sign in later from your profile (tap your name, top left).

**What doesn't sync:** PDFs you're annotating stay on the device you opened them on. They're too big to sync. Everything else syncs.

## Updating the site

Replace the files in `public/`, then redeploy. Your saved accounts and progress aren't touched.

## Sync not working? (phone and computer show different progress)

Check the bottom-left of the sidebar on **both** devices:

- **"Synced as yourname"** on both: it's working. Make sure it's the same username on each.
- **"Not synced · tap to sign in"**: tap it and sign in with the same account you made on the other device. Don't make a second account.
- **"This device only · why?"**: the host is serving the files without running `server.js`. On Render this means it was made as a **Static Site**. Delete it and make a **Web Service** with start command `node server.js`.
- **It keeps signing you out, or your login stops working**: the server is saving to temporary files that get wiped when the host restarts. Add the two Upstash variables (Option A). The profile page shows a warning when this is the case.
