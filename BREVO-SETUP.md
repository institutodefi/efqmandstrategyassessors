# Brevo newsletter — setup & automation guide

The website already has a newsletter sign-up block (dark band above the contact
form, on the home page). It is built to work with **Brevo** (formerly
Sendinblue) using double opt-in. Until you connect Brevo it quietly falls back
to storing sign-ups in Supabase (the `subscribers` table) or opening the
visitor's email client — so nothing breaks in the meantime.

Follow these steps to switch it on.

## 1. Create a Brevo account & list

1. Sign up at https://www.brevo.com (free tier is enough to start).
2. Go to **Contacts → Lists → Add a list**. Name it e.g. `Newsletter`.

## 2. Create the sign-up form

1. Go to **Contacts → Forms → Create a form**.
2. Add the fields the site sends:
   - **EMAIL** (already present by default)
   - **OPT_IN** — add a checkbox/attribute if you want to store the consent flag
   - **LOCALE** *(optional)* — a text attribute if you want to record `en` / `ar`
3. Turn on **double opt-in** (recommended for GDPR): Brevo sends a confirmation
   email and only adds confirmed contacts. This matches the site copy
   ("check your inbox to confirm").
4. Assign the form to your `Newsletter` list.
5. **Publish / Share** the form and copy its **form action URL**. It looks like:
   `https://sibforms.com/serve/MUIF-xxxxxxxxxxxxxxxxxxxx`

## 3. Connect it to the website

Set the form action URL as an environment variable and redeploy:

- **Local:** add to `.env`
  ```
  VITE_BREVO_FORM_ACTION=https://sibforms.com/serve/MUIF-xxxxxxxxxxxx
  ```
- **Netlify:** Site settings → Environment variables → add
  `VITE_BREVO_FORM_ACTION` with the same value, then trigger a redeploy.

That's it — the newsletter form will now POST straight to Brevo (through a hidden
iframe, so the visitor stays on the page) and Brevo handles the confirmation
email and list management. The site's field names already match
(`EMAIL`, `OPT_IN`, `locale`, plus a hidden `email_address_check` honeypot).

## 4. Create the welcome automation

1. Go to **Automations → Create an automation → Welcome message** (or start
   from a blank workflow).
2. **Entry point:** "A contact is added to a list" → choose `Newsletter`.
   (With double opt-in, contacts enter only after they confirm.)
3. **Action:** Send an email. Design a short bilingual welcome — who you are,
   what they'll receive, and how to unsubscribe. Suggested subject:
   *"Welcome to EFQM & Strategy Assessors / أهلاً بكم"*.
4. *(Optional)* Add a delay + a second email pointing to your best blog posts
   (`/blog`) or the EFQM Model page (`/model`).
5. Activate the automation.

## 5. Keep it compliant

- Double opt-in gives you provable consent (a GDPR/PDPL best practice).
- Every Brevo email includes an unsubscribe link automatically — keep it.
- The website's Privacy and Cookie policies already describe the newsletter and
  name Brevo-style processing; no change needed there.

## Where things live in the code

- Component: `src/components/Newsletter.jsx` (reads `VITE_BREVO_FORM_ACTION`)
- Copy (EN/AR): the `newsletter` block in `src/i18n.jsx`
- Fallback table: `subscribers` in `supabase/schema.sql`
