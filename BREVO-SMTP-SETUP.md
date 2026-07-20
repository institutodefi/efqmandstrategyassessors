# Brevo → SMTP de Supabase (emails de autenticación Orbital 360)

Objetivo: que los emails de **confirmación de cuenta, invitación y
restablecimiento de contraseña** salgan por Brevo con remitente
`hello@efqmassessors.ae`, sin los límites del email interno de Supabase
(~2-4 emails/hora) y sin caer en spam.

> La newsletter es otra pieza y ya está documentada en `BREVO-SETUP.md`.
> Ambas comparten la misma cuenta de Brevo.

---

## 1. Crear la clave SMTP en Brevo  (2 min)

1. Entra en Brevo → arriba a la derecha, tu nombre → **SMTP & API**.
2. Pestaña **SMTP** → botón **Generate a new SMTP key**.
3. Dale un nombre (`supabase-orbital360`) y **copia la clave**
   (empieza por `xsmtpsib-…`). Solo se muestra una vez.
4. En esa misma pantalla verás también:
   - **SMTP Server:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Login:** tu identificador SMTP (suele ser el email de la cuenta
     o un login tipo `9xxxxx001@smtp-brevo.com` — usa el que muestre Brevo).

## 2. Autenticar el dominio efqmassessors.ae  (10 min + propagación DNS)

Sin esto los emails salen "via brevo.com" y pueden caer en spam.

1. Brevo → **Settings → Senders, Domains & Dedicated IPs → Domains**
   → **Add a domain** → `efqmassessors.ae`.
2. Brevo te mostrará **los registros DNS exactos de tu cuenta**
   (código de verificación, DKIM y DMARC). Cópialos tal cual en tu
   proveedor de DNS (donde gestionéis efqmassessors.ae). Tendrán esta pinta:

   | Tipo | Nombre (host) | Valor |
   |---|---|---|
   | TXT | `@` | `brevo-code:xxxxxxxx…` (verificación) |
   | TXT/CNAME | `brevo1._domainkey` | valor DKIM que indique Brevo |
   | TXT/CNAME | `brevo2._domainkey` | valor DKIM que indique Brevo |
   | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:hello@efqmassessors.ae` |

   Y añade/ajusta el **SPF** si tenéis registro TXT de SPF en `@`:
   incluye `include:spf.brevo.com` (p. ej.
   `v=spf1 include:spf.brevo.com ~all`, fusionado con lo que ya exista
   para vuestro correo corporativo — **no** creéis dos TXT de SPF).
3. Vuelve a Brevo y pulsa **Verify / Authenticate**. Puede tardar de
   minutos a unas horas según el TTL del DNS.
4. En **Senders**, añade `hello@efqmassessors.ae` como remitente si no
   aparece ya.

## 3. Configurar el SMTP en Supabase  (3 min)

Dashboard de Supabase (proyecto `wiraonfdufycdcqgurpx`) →
**Authentication → Emails → SMTP Settings** → activa **Enable Custom SMTP**:

| Campo | Valor |
|---|---|
| Sender email | `hello@efqmassessors.ae` |
| Sender name | `EFQM & Strategy Assessors — Orbital 360` |
| Host | `smtp-relay.brevo.com` |
| Port | `587` |
| Username | el **Login** SMTP de Brevo (paso 1.4) |
| Password | la clave `xsmtpsib-…` |

Guarda. Supabase enviará todos los emails de auth por Brevo.

## 4. Subir los límites de envío de Supabase

Con SMTP propio, Supabase permite aumentar el rate limit:
**Authentication → Rate Limits → Email** → sube "Emails per hour"
(p. ej. 100). Con el email interno este ajuste está bloqueado.

## 5. URLs correctas en los enlaces de los emails  (importante)

**Authentication → URL Configuration**:

- **Site URL:** `https://efqmassessors.ae` (o el dominio de producción)
- **Redirect URLs:** añade
  `https://efqmassessors.ae/login`
  `https://efqmassessors.ae/portal`
  y si usáis previews de Netlify: `https://*.netlify.app/login`

Sin esto, los enlaces de confirmación/reset apuntan a `localhost:3000`.

## 6. Plantillas con marca Orbital 360 (EN + AR)

**Authentication → Emails → Templates**. Pega el HTML de la carpeta
`supabase/emails/` de este repo en cada plantilla:

| Plantilla de Supabase | Archivo |
|---|---|
| Confirm signup | `confirm-signup.html` |
| Invite user | `invite-user.html` |
| Reset password | `reset-password.html` |
| Magic link | `magic-link.html` |

Asuntos sugeridos (campo *Subject*):

- Confirm signup: `Confirm your Orbital 360 account · أكّدوا حسابكم`
- Invite user: `You are invited to Orbital 360 · دعوة إلى أوربيتال 360`
- Reset password: `Reset your password · إعادة تعيين كلمة المرور`
- Magic link: `Your sign-in link · رابط الدخول`

Las plantillas usan las variables de Supabase (`{{ .ConfirmationURL }}`,
`{{ .SiteURL }}`) — no las cambiéis.

## 7. Probar

1. Registra un usuario de prueba con un email real → debe llegar el
   email de confirmación con diseño Orbital 360 en <1 min.
2. Prueba "Forgot your password?" en `/login`.
3. En Brevo → **Statistics → Email** ves cada envío, apertura y rebote.

## Problemas típicos

- **"Error sending email" al registrar** → username/clave SMTP mal
  copiados, o el remitente no está verificado en Brevo (paso 2.4).
- **Llega a spam** → el dominio aún no está autenticado (paso 2) o el
  SPF quedó duplicado (dos registros TXT `v=spf1` = SPF inválido).
- **El enlace apunta a localhost** → paso 5.
- **No llega nada y Brevo no registra el envío** → el SMTP de Supabase
  no quedó activado (toggle Enable Custom SMTP) o el puerto es 465 en
  vez de 587.

---

## 8. Sincronización EN VIVO del CRM (Edge Function `brevo-sync`)

La app sincroniza contactos con Brevo en tiempo real (botones "Sync" y
"Sync all" en /portal/contacts, y borrado en Brevo al hacer GDPR erase).
La API key vive en el servidor, nunca en el navegador.

Despliegue (una vez, con la CLI de Supabase):

    supabase login
    supabase link --project-ref wiraonfdufycdcqgurpx
    supabase functions deploy brevo-sync
    supabase secrets set BREVO_API_KEY=xkeysib-XXXX     # Brevo → SMTP & API → API Keys
    supabase secrets set BREVO_LIST_ID=3                # opcional: lista "CRM contacts"

Atributos necesarios en Brevo (Contacts → Settings → Contact attributes):
FIRSTNAME y LASTNAME (de serie), COMPANY (crear, tipo texto). SMS es de
serie; la función solo lo envía si el número está en formato E.164 y, si
Brevo lo rechaza, reintenta sin él.

¿Make/Zapier? No hace falta: la Edge Function cubre el flujo con coste
cero. Make solo aportaría valor si más adelante quieres orquestar flujos
multi-app sin código (p. ej. Brevo → hoja de cálculo → Slack).
