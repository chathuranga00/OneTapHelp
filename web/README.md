# One Tap Help — Web

Next.js 14 app for live SOS tracking (emergency contacts), phone OTP login, and owner dashboard.

## Setup

1. Copy env file and fill in values:

```bash
cp .env.example .env.local
```

2. Apply the Supabase migration (from repo root):

```bash
supabase db push
```

This adds `get_sos_event_for_tracking` so `/track/[eventId]` works without login.

3. Enable **Phone** auth in Supabase Dashboard → Authentication → Providers.

4. Create a [Google Maps API key](https://console.cloud.google.com/) with **Maps JavaScript API** enabled.

5. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/track/[eventId]` | Public live map for contacts (Realtime + polling) |
| `/login` | Phone OTP sign-in |
| `/dashboard` | SOS stats and recent events (auth required) |
| `/history/[eventId]` | Full event details (auth required) |

## Expo app

Set in the root `.env`:

```
EXPO_PUBLIC_TRACKING_URL=http://localhost:3000
```

SMS links will point to this host’s `/track/...` pages.
