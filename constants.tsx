
import { PatchNote } from './types';

export const PATCH_NOTES: PatchNote[] = [
  {
    "version": "3.1.0",
    "date": "05/01/2026",
    "title": "Nouvelle interface",
    "description": "On change de style (encore!) mais cette fois c'est pour des raisons de performance.",
    "changes": [
      {
        "type": "new",
        "text": "Toute nouvelle interface beaucoup plus propre, lisse et fluide. Performance améliorées d'environ 50%. Chargement plus rapide."
      }
    ]
  },
  {
    "version": "3.0.1",
    "date": "02/01/2026",
    "title": "Bonne année! ",
    "description": "Quelques améliorations et refontes pour ce début d'année.",
    "changes": [
      {
        "type": "improved",
        "text": "Interface plus fluide, plus réactive"
      },
      {
        "type": "new",
        "text": "Les épisodes d'une saison s'affiche désormais sous forme de ligne défilante droite-gauche "
      },
      {
        "type": "fix",
        "text": "Correction d'un bug qui empêche que les épisodes en cours apparaissent dans \"Continue Watching\""
      },
      {
        "type": "new",
        "text": "Ajout d'une catégorie \"My Requests\" à l'acceuil"
      },
      {
        "type": "system",
        "text": "Passage à l'encodage x265 pour une meilleure gestion du stockage"
      },
      {
        "type": "new",
        "text": "Ajout d'un onglet \"Watchlist\". Vous pouvez désormais mettre des films et séries en watchlist pour pouvoir les regarder dans le futur. Vous y trouverez également un onglet statistiques."
      },
      {
        "type": "new",
        "text": "Ajout d'un défilement infini sur la page d'acceuil"
      },
      {
        "type": "improved",
        "text": "Meilleur rapidité et fluidité de la recherche de médias."
      },
      {
        "type": "new",
        "text": "Changement de couleur de l'interface en rouge"
      }
    ]
  }
];