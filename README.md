# Website Rotary Club Hoogeveen - de Wolden

Statische website gebouwd met [Astro](https://astro.build), beheerd met [Decap CMS](https://decapcms.org) en gehost op Cloudflare Pages vanuit GitHub.

## Opbouw

| Map / bestand | Inhoud |
| --- | --- |
| `src/pages/` | Pagina's: Home, Nieuws (+ archief en losse berichten), Muziek achter de voordeur (+ per editie), Contact, 404 |
| `src/content/nieuws/` | Nieuwsberichten (Markdown), één bestand per bericht |
| `src/content/edities/` | Edities van Muziek achter de voordeur, één bestand per jaar |
| `src/data/instellingen.json` | Contactgegevens, Instagram/Facebook-links en introteksten |
| `src/components/SocialBlok.astro` | Het blok met links naar Instagram en Facebook |
| `src/styles/global.css` | Huisstijl: kleuren (goud), Lora, knoppen, kaarten |
| `public/admin/` | Het beheerscherm (Decap CMS) op `/admin` |
| `functions/api/` | Inloggen via GitHub voor het beheerscherm (Cloudflare Pages Functions) |
| `public/images/uploads/` | Afbeeldingen die via het beheerscherm worden geüpload |

## Lokaal werken

Vereist: [Node.js](https://nodejs.org) 20 of nieuwer.

```bash
npm install
npm run dev          # site op http://localhost:4321
npx decap-server     # (tweede terminal) beheerscherm lokaal op http://localhost:4321/admin
npm run build        # productieversie in dist/
```

## Online zetten (eenmalig)

### 1. GitHub
1. Maak een repository aan, bijvoorbeeld `rotary-hoogeveen-dewolden`.
2. Zet deze map erin:
   ```bash
   git init
   git add .
   git commit -m "Eerste versie website"
   git branch -M main
   git remote add origin https://github.com/rinkrotaryhdw-del/rotary-hoogeveen-dewolden.git
   git push -u origin main
   ```

### 2. Cloudflare Pages
1. Cloudflare-dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, kies de repository.
2. Build-instellingen:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. De site staat op https://rotarydewoldenhoogeveen.nl (en `rotary-hoogeveen-dewolden.pages.dev`). Het domein is geregistreerd bij mijn.host, met de nameservers van Cloudflare, en gekoppeld onder **Custom domains**.

### 3. Inloggen voor het beheerscherm (GitHub OAuth App)
1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
   - Homepage URL: `https://<jouw-domein>`
   - Authorization callback URL: `https://<jouw-domein>/api/callback`
2. Kopieer de **Client ID** en maak een **Client secret** aan.
3. Cloudflare Pages-project → **Settings** → **Variables and Secrets**, voeg toe (Production):
   - `GITHUB_CLIENT_ID` = de Client ID
   - `GITHUB_CLIENT_SECRET` = het secret (type *Secret*)
4. Pas in `public/admin/config.yml` aan:
   - `repo:` → `rinkrotaryhdw-del/rotary-hoogeveen-dewolden`
   - `base_url`, `site_url`, `display_url` → het echte domein
5. Pas in `astro.config.mjs` ook `site` aan naar het echte domein.
6. Commit en push. Cloudflare bouwt de site opnieuw.

### 4. Tweede beheerder toegang geven
1. Laat de tweede persoon een (gratis) GitHub-account aanmaken.
2. Repository → **Settings** → **Collaborators** → **Add people**, rol *Write*.
3. Na het accepteren van de uitnodiging kan die persoon inloggen op `https://<jouw-domein>/admin`.

Zie [BEHEER.md](BEHEER.md) voor de korte handleiding voor beheerders.

## Hoe publiceren werkt

Opslaan in het beheerscherm maakt direct een commit op `main`. Cloudflare Pages ziet die en bouwt de site opnieuw; na 1 à 2 minuten staat de wijziging online. Er is geen goedkeuringsstap. Wil je die wel, zet dan `publish_mode: editorial_workflow` in `public/admin/config.yml`.

## Nog te doen

- Echte Instagram- en Facebook-links, e-mailadres en bijeenkomsttekst invullen (via het beheerscherm onder *Algemene instellingen*).
- Het officiële clublogo maken in de Rotary Brand Center (inloggen met My Rotary, sjabloon "Club of Hoogeveen-de Wolden") en uploaden via het beheerscherm: *Algemene instellingen → Clublogo*. Het logo verschijnt dan vanzelf in de kop van elke pagina en groot op de homepage. Zonder logo toont de site de clubnaam als tekst.
- De voorbeeldteksten in het nieuwsbericht en de editie 2027 vervangen, en eerdere edities toevoegen.
- De echte Flextickets-link per editie invullen.
