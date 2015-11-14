'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  terms = require('../../app/controllers/terms.server.controller');

module.exports = function(app) {
  // Term Routes
  app.route('/terms').post(terms.postSearchQuery);

  app.route('/totalTerms').get(terms.getTotalTerms);
  
  app.route('/terms/:pageNumber').get(terms.getPagedList);  
};
