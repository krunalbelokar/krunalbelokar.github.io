# Krunal Belokar — AI Engineer Portfolio Website

A modern, high-performance, and shareable personal portfolio website built for **Krunal Belokar**, positioned as an **AI Engineer / Generative AI Developer**.

---

## 🌐 Quick Deployment & Sharing Guide

### Option 1: Deploy to GitHub Pages (Recommended — 100% Free & Permanent)

1. Create a new repository on your GitHub account named:
   `krunalbelokar.github.io`
2. Run the following commands in this directory:
   ```bash
   git remote add origin https://github.com/krunalbelokar/krunalbelokar.github.io.git
   git push -u origin main
   ```
3. In GitHub, go to **Settings → Pages**, and ensure the source is set to `main` branch `/ (root)`.
4. Your live website will be accessible globally at:
   **`https://krunalbelokar.github.io/`**

---

### Option 2: Deploy with Vercel (Instant 30-Second Live URL)

1. Install and run Vercel CLI:
   ```bash
   npx vercel
   ```
2. Follow the 2 prompts (accept defaults).
3. Your portfolio will immediately receive a live HTTPS URL (e.g. `https://krunal-portfolio.vercel.app`).

---

### Option 3: Deploy with Netlify

```bash
npx netlify deploy --prod --dir=.
```

---

## 🚀 Built-In Share Features

1. **One-Click Native Sharing**:
   - On iOS Safari / Android Chrome, clicking **"Share"** automatically launches the native mobile share sheet (AirDrop, WhatsApp, LinkedIn, Messages, etc.).
2. **Interactive Share Modal**:
   - Clickable direct link copy field with toast feedback.
   - 1-click sharing buttons for **LinkedIn**, **WhatsApp**, **X / Twitter**, and **Email**.
   - Built-in dynamic SVG **QR Code** that recruiters and interviewers can scan directly from your screen with their phone cameras.
3. **Rich Open Graph & Social Cards**:
   - Pre-configured `og:image`, `og:title`, and `og:description` tags so sharing your link on LinkedIn, WhatsApp, X, and iMessage displays your portrait, title, and preview cards.

---

## 💻 Local Development

```bash
# Run local dev server on port 4173
python3 -m http.server 4173
```
Visit `http://localhost:4173` in your browser.
