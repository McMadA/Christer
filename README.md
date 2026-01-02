````md
# 🎶 Christelijke Hitster

Een digitale versie van een Hitster-achtig spel, gebaseerd op **christelijke muziek**:
psalmen, gezangen, Opwekking, Sela en moderne worship.

Spelers luisteren naar een lied (via Spotify preview) en plaatsen het in de juiste
chronologische volgorde op hun tijdlijn — met extra kaarten voor herkenning,
inhoud en wildcards.

---

## ✨ Features

- 🎧 Spotify **30 seconden preview** (geen login nodig)
- 🃏 Digitale kaarten met:
  - Titel & artiest
  - Categorie (Basis / Periode / Herkenning / Inhoud / Wildcard)
  - Moeilijkheid (kleur)
- ⏳ Tijdlijn bouwen (drag & drop of knoppen)
- 🎨 Kleuren & iconen voor snelle herkenning
- 📖 Inhoudelijke vragen gebaseerd op Bijbel en thema’s
- 🤝 Geschikt voor jeugdgroepen, gezinnen en kerkavonden

---

## 🕹️ Spelconcept

### Doel
Leg christelijke liederen in de **juiste chronologische volgorde**.

### Categorieën kaarten
- **Basiskaarten** – Lied + artiest
- **Periodekaarten** – Tijdvakken
- **Herkenningkaarten** – Luisteren / zingen / raden
- **Inhoudkaarten** – Thema, Bijbeltekst, betekenis
- **Wildcards** – Speciale acties

### Moeilijkheid
- 🟢 Groen – Makkelijk
- 🟡 Geel – Gemiddeld
- 🔴 Rood – Moeilijk

---

## 🎲 Spelverloop (kort)

1. Speler trekt een kaart
2. Lied wordt afgespeeld via Spotify preview
3. Speler plaatst de kaart in zijn tijdlijn
4. App controleert:
   - ✔️ correct → kaart blijft
   - ❌ fout → kaart verdwijnt
5. Wildcards & speciale kaarten kunnen het spel beïnvloeden

Win door als eerste **X correcte kaarten** in je tijdlijn te hebben.

---

## 🧩 Tech Stack

### Frontend
- **Next.js / React**
- **Tailwind CSS**
- Drag & drop: `dnd-kit` of `react-beautiful-dnd`

### Backend (lichtgewicht)
- **Supabase** of **Firebase**
- Opslag voor:
  - Kaarten
  - Spelstatus
  - Scores

### Audio
- **Spotify Preview API**
  - 30 seconden preview
  - Geen Premium vereist
  - Geen mp3-opslag

### Hosting
- **Vercel** of **Netlify**

---

## 📦 Kaartmodel (voorbeeld)

```json
{
  "id": 12,
  "titel": "Ik zal er zijn",
  "artiest": "Sela",
  "jaar": 2013,
  "categorie": "Basis",
  "moeilijkheid": "groen",
  "thema": ["vertrouwen", "troost"],
  "bijbeltekst": "Exodus 3",
  "spotifyId": "3abcd123",
  "previewUrl": "https://p.scdn.co/mp3-preview/..."
}
````

