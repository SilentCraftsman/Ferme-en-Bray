// utility.js
export const clearCart = () => {
  try {
    // Effacer le panier du localStorage
    localStorage.removeItem('cart');

    console.log('Panier effacé avec succès');
  } catch (error) {
    console.error("Erreur lors de l'effacement du panier", error);
  }
};
