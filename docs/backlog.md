# Backlog

Idee e attività rimandate. Quando una voce viene fatta, si cancella (la cronologia resta in git).

## Articoli

- **Feed RSS**, uno per lingua (`/it/articles/feed.xml`, `/en/articles/feed.xml`) con link nell'`<head>`.
- **Pagine per tag**: oggi i tag sono solo etichette.
- **Anteprima locale**: installare Ruby (es. `winget install RubyInstallerTeam.RubyWithDevKit.3.3`, poi `gem install bundler jekyll`) e usare `bundle exec jekyll serve`, per vedere gli articoli prima del merge su `main`.

## Sito

- **Home bilingue statica**: dividerla in `/it/` ed `/en/` come pagine vere, con `/` come `x-default`. Oggi l'inglese esiste solo con JavaScript e non viene indicizzato.
