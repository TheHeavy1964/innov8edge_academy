# How-To Guide: Innov8Edge Academy

This guide provides common operational and development workflows for maintaining the Innov8Edge Academy platform.

## 1. How to Add a New Lesson

1. Create a new markdown/JSON file in the content directory (or add a row in your Supabase `lessons` table).
2. Ensure it has the required fields: `id`, `title`, `description`, `track`, and `content`.
3. The Learning Paths UI (`src/components/learning/`) will automatically render it based on its track tag.

## 2. How to Manage the Supabase Database

We use Supabase for persistent storage.
- **Profiles**: When a user signs up, a trigger creates a row in the `profiles` table.
- **Marketplace Listings**: Users can publish sandboxes to the `marketplace_listings` table.
- **Updating Schema**: Always use the SQL Editor in your Supabase Dashboard to run schema changes. We do not currently use local migrations in this repository.

## 3. How to Configure Stripe Products

To configure the pricing plans:
1. Log in to your Stripe Dashboard.
2. Go to **Products** -> **Add Product**.
3. Create products for "Pro" and "Team".
4. Copy the generated **Price IDs** (they start with `price_...`).
5. Update the `priceId` strings in `src/components/landing/Pricing.tsx` to match your actual Stripe Price IDs.

## 4. How to Test Webhooks Locally

To test Stripe Webhooks on your local machine:
1. Download the Stripe CLI.
2. Run `stripe login`.
3. Run `stripe listen --forward-to localhost:3030/api/webhooks/stripe`.
4. Copy the webhook secret provided in the terminal and place it in your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## 5. How to Gate Features (Pro Tier)

We use a High-Order Component (HOC) or middleware to check the user's `tier`. 
- Wrap restricted components with the `ProGate` wrapper.
- If the user's `tier` in their Supabase profile is `'free'`, they will see an upgrade prompt instead of the sandbox interface.

---

## 6. How to Manage Lesson Videos

Each lesson page fetches its video URL from the `lesson_videos` Supabase table. If no record exists for a lesson, it falls back to the default URL set in `src/lib/curriculum.ts`.

### As Admin — Updating a Lesson Video
1. Log in with your admin account (email contains `innov8edge`, `martin`, or `admin`)
2. Navigate to any lesson: `/learn/[track]/[lesson]`
3. Below the video player, click **✏ Edit Lesson Video URL** (amber link, visible to admins only)
4. Paste a YouTube, Vimeo, or direct `.mp4` URL into the input field
5. Press **Save** or hit **Enter**
6. The video updates immediately and the URL is saved to Supabase — all users will see the new video

### Supported URL Formats
| Format | Example |
|--------|---------|
| YouTube watch URL | `https://www.youtube.com/watch?v=VIDEO_ID` |
| YouTube short URL | `https://youtu.be/VIDEO_ID` |
| Vimeo | `https://vimeo.com/VIDEO_ID` |
| Direct MP4 | `https://example.com/video.mp4` |

The platform auto-detects the format and generates the correct embed URL.

### As Admin — Updating Library Briefing Videos
1. Go to `/library`
2. Click **Library Admin** (top bar)
3. Click **Edit Info** on any briefing card
4. In the modal, update the **Video URL** field with any YouTube / Vimeo / MP4 URL
5. Click **Save Changes**

> **Note:** Library video changes are session-local (not persisted to Supabase yet). Lesson video changes are fully persisted via the `lesson_videos` table.

---

## 7. Supabase: Getting Your Service Role Key

The `SUPABASE_SERVICE_ROLE_KEY` allows the API route to bypass Row Level Security for admin writes.

> **Note:** Supabase recently updated their API Keys UI. The steps below reflect the new interface.

1. Go to [supabase.com](https://supabase.com) and open your project
2. Click **Project Settings** (gear icon in the left sidebar)
3. Click **API** in the settings menu
4. You will see two tabs: **"Publishable and secret API keys"** and **"Legacy anon, service_role API keys"**
5. On the **"Publishable and secret API keys"** tab, scroll to the **"Secret keys"** section
6. Click the **👁 eye icon** next to the key starting with `sb_secret_...` to reveal it
7. Click the **copy icon** to copy it
8. Add it to your `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_your_key_here
   ```
9. Restart the dev server: `npm run dev`

**Alternatively**, click the **"Legacy anon, service_role API keys"** tab — it shows the older `service_role` key format. Both work.

> ⚠️ **Never commit this key to git.** It has full database access. `.env.local` is gitignored by default.

---

## 8. Video System — End-to-End Flow

```
User opens /learn/[track]/[lesson]
    │
    ├─ useEffect fires → GET /api/lesson-videos?lessonId=X
    │       │
    │       ├─ Row found in lesson_videos? → use that URL
    │       └─ No row found? → use curriculum.ts default URL
    │
    └─ iframe renders with toEmbedUrl(url)
            ├─ YouTube URL → youtube.com/embed/ID?autoplay=1
            ├─ Vimeo URL  → player.vimeo.com/video/ID?autoplay=1
            └─ MP4 URL   → rendered as <video> element

Admin saves a new URL:
    POST /api/lesson-videos { lessonId, videoUrl }
        └─ Supabase UPSERT → lesson_videos table
               └─ Next page load for any user → new URL served
```

