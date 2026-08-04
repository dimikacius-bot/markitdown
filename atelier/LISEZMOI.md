# Atelier — sources du répertoire Mitry Watch

Le site publié à la racine du dépôt est engendré ; tout se modifie ici.

## Chaîne de fabrication

```
python3 build/enrich.py    # data/watches.raw.json + data/ajouts.json -> data/watches.json
python3 build/photos.py    # appariement automatique avec Wikimedia Commons
python3 build/review.py    # relecture : retraits, variantes, attributions manuelles
python3 build/links.py     # site officiel, cote du marché, recherche  (--verify pour tester)
python3 build/bundle.py    # assets/data.js + version autonome en un seul fichier
python3 build/dist.py      # dist/ : ce qui est copié à la racine du dépôt
```

`build/verifie.py` sonde les liens marché ; Chrono24 refuse les robots, la
sonde ne conclut donc que depuis un réseau qui l'atteint.

## Où se trouve quoi

- `data/watches.raw.json` — les 167 montres du répertoire d'origine.
- `data/ajouts.json` — les pièces ajoutées depuis, décrites à la main.
- `data/watches.json` — engendré, ne pas modifier à la main.
- `build/enrich.py` — table SPEC (boîtier, verre, étanchéité) des 167 premières.
- `build/review.py` — `MANUAL_POOL` : la photo choisie à l'œil pour chaque pièce,
  avec son degré de certitude (`exact` = référence confirmée, sinon variante).
- `build/photos.py` — barème d'appariement, `BAD`, `BLOCK`, `DROP_IDS`.
- `img/orig/` — les photos venues du fichier d'origine, introuvables ailleurs.
  Les visuels Commons se retéléchargent, ceux-ci non.

## Règle

Une fiche ne paraît que si elle porte une photographie : `PHOTOS_SEULEMENT`
dans `build/bundle.py`. Les pièces sans visuel restent complètes dans
`data/watches.json` et reparaissent dès qu'une photo est trouvée.
