export const cancelOrder = (req, res) => {
  res.send('Your payment was canceled. Please try again.');
};

export const successResponse = (req, res) => {
  res.send('Votre paiement a été réussi !');
};

export const testRoute = (req, res) => {
  res.send('CORS is working!');
};
