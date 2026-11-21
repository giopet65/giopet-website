# Processo di creazione e pubblicazione degli articoli

Gli articoli sono scritti in italiano da Giovanni; la traduzione inglese la prepara Claude e Giovanni la rivede.
Il sito è compilato da Jekyll sui server di GitHub Pages a ogni push su `main`: i file `.md` vengono convertiti
in pagine HTML statiche, non c'è nessuna conversione al momento della visita.

## Struttura dei file

```
it/articles/index.md                          elenco italiano   → /it/articles/
it/articles/20261121-01-primo-articolo.md     articolo italiano → /it/articles/20261121-01-primo-articolo/
en/articles/index.md                          elenco inglese    → /en/articles/
en/articles/20261121-01-first-article.md      traduzione        → /en/articles/20261121-01-first-article/
img/articles/20261121-01/                     immagini condivise dalle due lingue
_layouts/  _includes/  _data/i18n.yml         modelli di pagina e testi fissi (non si toccano per un nuovo articolo)
```

- L'URL coincide con il percorso del file, senza `.md` e con la barra finale.
- La lingua è data dalla cartella (`it/` o `en/`): niente suffissi `-IT` / `-EN` nei nomi.

## Nome del file e ID

`<data>-<id>-<titolo>.md`, tutto minuscolo, parole separate da trattini.

- `<data>`: data di creazione, `AAAAMMGG`.
- `<id>`: progressivo del giorno a due cifre (`01`, `02`, …). Lo assegna Claude guardando i file già presenti per quella data.
- `<data>-<id>` (es. `20261121-01`) è **identico nei file italiano e inglese**: è il legame tra le due traduzioni
  e il nome della cartella delle immagini. Il titolo nel nome file invece è nella lingua del file.
- La data mostrata in elenco e nella pagina è quella del nome file.

## Front matter

Blocco in cima al file, tra due righe `---`. È l'unico punto dove si scrive il titolo.

```yaml
---
title: "Titolo dell'articolo"
description: "Abstract: appare nell'elenco e nell'anteprima social"
tags: [esp32, ai]        # opzionale
image: cover.png         # opzionale: file in img/articles/<data>-<id>/ usato per l'anteprima social
published: false         # solo per le bozze: togliere la riga per pubblicare
---
```

- Layout e lingua non si scrivono: li imposta `_config.yml` in base alla cartella.
- Senza `image` l'anteprima social usa `img/og-image.png`. Con `image`: PNG 1200×630, la stessa nelle due lingue.
- `published: false` esclude la pagina dal sito, dagli elenchi e dalla sitemap. Mettila nei due file di un articolo non ancora pronto.

## Immagini

- In `img/articles/<data>-<id>/`, condivise dalle due lingue (niente testo dipendente dalla lingua dentro l'immagine).
- Nel Markdown si usa il percorso assoluto: `![testo alternativo](/img/articles/20261121-01/nome.png)`.
- Il testo alternativo è nel Markdown, quindi si traduce con l'articolo.
- Una riga in corsivo subito sotto l'immagine (senza riga vuota) diventa la didascalia.
- Preferire PNG con risoluzione adeguata e sfondo che regga sia il tema chiaro sia quello scuro.

## Flusso di lavoro

1. **Giovanni** fornisce l'articolo in italiano (Markdown).
2. **Claude** lo importa in `it/articles/<data>-<id>-<titolo>.md`: aggiunge il front matter, sposta le immagini
   in `img/articles/<data>-<id>/`, corregge i percorsi, toglie eventuali note di lavoro e segnaposto.
3. **Claude** traduce in `en/articles/<data>-<id>-<titolo-inglese>.md` (stesso `<data>-<id>`), seguendo le regole
   sotto. Giovanni rivede la traduzione.
4. Si lavora sul branch `articles` (o su un branch dedicato). Finché non è tutto pronto i file restano con `published: false`.
5. **Commit e push solo su richiesta esplicita di Giovanni**; il consenso vale per la singola richiesta.
6. Per pubblicare: togliere `published: false` da entrambi i file, poi merge su `main` (sempre su richiesta esplicita).
7. Dopo il merge: attendere la compilazione di GitHub Pages (di solito meno di un minuto) e fare i controlli sotto.

Non c'è anteprima locale (Ruby/Docker non installati): il primo controllo reale avviene dopo il merge su `main`, quindi
conviene rileggere con attenzione i file prima di pubblicare.

## Regole di traduzione

- Stesso tono dell'originale (informale ma tecnico), non una traduzione letterale.
- Blocchi di codice, nomi di prodotti e termini tecnici restano invariati.
- Si traducono: titolo, descrizione, tag, testi alternativi delle immagini, didascalie, link interni all'altra lingua.
- Il titolo nel nome file è in inglese; la parte `<data>-<id>-` non cambia.

## Controlli prima del commit

- I due file hanno lo stesso prefisso `<data>-<id>-` e un `title` e una `description` ciascuno.
- Tutte le immagini citate esistono in `img/articles/<data>-<id>/` e i percorsi sono assoluti.
- Nessuna nota di lavoro o segnaposto rimasti nel testo.
- Se l'articolo deve restare nascosto: `published: false` in entrambi i file.
- Numeri e fatti citati nel testo verificati dall'autore.

## Controlli dopo la pubblicazione

- `https://giopet.eu/it/articles/` e `https://giopet.eu/en/articles/` mostrano l'articolo.
- La levetta IT/EN porta alla traduzione e il codice sorgente della pagina contiene i tre `hreflang` (it, en, x-default).
- Le immagini si vedono in tema chiaro e scuro; tabelle e codice, se presenti, sono leggibili anche da telefono.
- `https://giopet.eu/sitemap.xml` elenca le due pagine.
- Anteprima social: rigenerare la cache con il Post Inspector di LinkedIn.
