const fetch = require('node-fetch');
const authController = {};
const clientId = '';
const clientSecret = '';
const redirectUrl = 'http://localhost:3000/auth/profile';

authController.getToken = (req, res, next) => {
  //Receive the code parameter from GitHub API after user signin there
  const requestToken = req.query.code;
  const githubTokenUrl = `https://github.com/login/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUrl}&client_secret=${clientSecret}&code=${requestToken}`;

  //Post request to another GitHub API endpoint for an access token
  fetch(githubTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      res.locals.access_token = data.access_token;
      res.redirect('/profile');
      return next();
    })
    .catch((error) => {
      console.log('fetch error');
      return next(error);
    });
};

authController.getData = (req, res, next) => {
  const githubDataUrl = 'https://api.github.com/user';

  fetch(githubDataUrl, {
    method: 'GET',
    headers: {
      Authorization: `token ${res.locals.access_token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return next();
    })
    .catch((error) => {
      console.log('fetch error');
      return next(error);
    });
};

// export default authController;
module.exports = authController;
