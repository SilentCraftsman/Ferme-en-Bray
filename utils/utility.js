// utility.js ou dans un fichier de fonctions utilitaires
export const clearCart = () => {
  try {
    // Effacer le panier du localStorage
    localStorage.removeItem("cart");

    // Réinitialiser le panier dans le state du composant
    // Si vous utilisez un state local dans le composant
    // Exemple : setCart([]);

    // Si vous n'avez pas accès à setCart, vous pouvez utiliser un autre mécanisme
    // pour informer le composant que le panier a été vidé.

    console.log("Panier effacé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'effacement du panier", error);
  }
};
