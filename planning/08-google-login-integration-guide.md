# Google Login Integration Guide

This project uses Supabase Auth for Google login. The app code calls `supabase.auth.signInWithOAuth({ provider: "google" })`, then Supabase redirects back to `/auth/callback` so the session can be saved into cookies.

Official references:
- Supabase Google login: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls

## What Was Added In The App

- Google login button in `components/auth/login-form.tsx`.
- OAuth callback route in `app/auth/callback/route.ts`.
- Successful Google login redirects users to `/venue`.

The callback route is important because this app uses Supabase SSR/cookie auth. Google sends the user back with an auth `code`, and `/auth/callback` exchanges that code for a Supabase session.

## Supabase Dashboard Setup

1. Open Supabase Dashboard.
2. Go to `Authentication` -> `Sign In / Providers`.
3. Enable `Google`.
4. Paste the Google OAuth `Client ID`.
5. Paste the Google OAuth `Client Secret`.
6. Copy the Supabase callback URL shown on that provider page.

The callback URL usually looks like:

```txt
https://<your-project-ref>.supabase.co/auth/v1/callback
```

Use the exact URL shown by Supabase when configuring Google Cloud.

## Google Cloud Setup

1. Open Google Cloud Console.
2. Create or select a project.
3. Configure OAuth consent screen / Google Auth Platform branding.
4. Create an OAuth Client ID.
5. Application type: `Web application`.
6. Add Authorized JavaScript origins:

```txt
http://localhost:3000
https://your-production-domain.com
```

7. Add Authorized redirect URI:

```txt
https://<your-project-ref>.supabase.co/auth/v1/callback
```

8. Save the generated Client ID and Client Secret.
9. Paste them into the Supabase Google provider settings.

## Supabase Redirect URL Setup

Go to `Authentication` -> `URL Configuration`.

Set Site URL for production:

```txt
https://your-production-domain.com
```

Add Redirect URLs:

```txt
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/venue
https://your-production-domain.com/auth/callback
https://your-production-domain.com/auth/callback?next=/venue
```

If Supabase rejects query-string URLs in your setup, keep the base callback URLs and test again:

```txt
http://localhost:3000/auth/callback
https://your-production-domain.com/auth/callback
```

## Local Testing Checklist

1. Restart the dev server after changing auth settings.
2. Open `/login`.
3. Press `Continue with Google`.
4. Choose a Google account.
5. Confirm the app redirects back to `/venue`.
6. Confirm the navbar shows the signed-in profile menu.

## Common Issues

### Google says redirect URI mismatch

The redirect URI in Google Cloud must be the Supabase callback URL, not the app route.

Use:

```txt
https://<your-project-ref>.supabase.co/auth/v1/callback
```

Do not use this in Google Cloud:

```txt
http://localhost:3000/auth/callback
```

### App returns to login but user is not signed in

Check Supabase redirect URLs. The app route `/auth/callback` must be allowed in Supabase URL Configuration.

### Works locally but fails in production

Add the production domain to:

- Google Authorized JavaScript origins.
- Supabase Site URL.
- Supabase Redirect URLs.

## Notes For This Project

- No service role key is needed for Google login.
- Do not expose Google Client Secret in frontend code.
- Supabase stores the session; the app only reads the current user through Supabase SSR helpers.
- Admin access is still controlled separately by the `kd_sutera_kasih_admin_users` table.
