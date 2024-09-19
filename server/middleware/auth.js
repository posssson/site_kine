// server/middleware/auth.js
function isAuthenticated(req, res, next) {
  console.log('isAuthenticated middleware called');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Is Authenticated:', req.isAuthenticated());

  if (req.isAuthenticated()) {
    console.log('User is authenticated');
    return next();
  } else {
    console.log('User is not authenticated');
    if (req.xhr) {
      // Si la requête est une requête AJAX, renvoyer une erreur 401
      console.log('AJAX request detected, sending 401');
      res.status(401).json({ message: 'Non authentifié' });
    } else {
      // Sinon, rediriger vers la page de connexion
      console.log('Redirecting to /login');
      res.redirect('/auth/login');
    }
  }
}

module.exports = isAuthenticated;