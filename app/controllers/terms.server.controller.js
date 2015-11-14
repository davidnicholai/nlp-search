'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Term = mongoose.model('Term'),
  _ = require('lodash');

exports.getTotalTerms = function(req, res) {
  Term.count(function(err, total) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({'total': total});
    }
  });
};

exports.getPagedList = function(req, res) {
  var page;  
  if (!req.params.pageNumber) {
    page = 1;
  } else {
    page = req.params.pageNumber;
  }

  Term.find({ $query: {}, $orderby: {token: -1} }).skip((page - 1) * 10).limit(10).exec(function(err, terms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(terms);
    }
  });
};

function getWeight(termFrequency) {
  if (termFrequency > 0) {
    return 1 + Math.log10(termFrequency);
  }

  return 0;
}

function getIdfWeight(N, df, tfWeight) {
  return Math.log10(N / df) * tfWeight;
}

exports.postSearchQuery = function(req, res) {
  var query = req.body.query.toLowerCase();
  var queries = query.split(' ');

  var N = 303;
  Term.find({token: {$in: queries}}).lean().exec(function(err, terms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var documents = [];
      var documentsFileNames = [];

      var doc = {};
      var df, idf;

      for (var idxTerms = 0; idxTerms < terms.length; idxTerms++) {
        for (var idxDocus = 0; idxDocus < terms[idxTerms].documents.length; idxDocus++) {
          df = terms[idxTerms].documents.length;
          idf = Math.log10(N / df);

          doc = {score: 0, score2: 0};
          doc.fileName = terms[idxTerms].documents[idxDocus].fileName;
          doc.score += getWeight(terms[idxTerms].documents[idxDocus].termFrequency);
          doc.score2 += getIdfWeight(N, terms[idxTerms].documents.length, doc.score);

          if (documentsFileNames.indexOf(doc.fileName) < 1) {
            documentsFileNames.push(doc.fileName);
            documents.push(doc);
          } else {
            for (var k = 0; k < documents.length; k++) {
              if (documents[k].fileName.toString() === doc.fileName) {
                documents[k].score += doc.score;
                documents[k].score2 += doc.score2;
              }
            }
          }
        }
      }

      res.json(documents);
    }
  });
};