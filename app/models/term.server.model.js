'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Term Schema
 */
var TermSchema = new Schema({
  token: {
    type: String
  },
  documents: [{
    fileName: String,
    termFrequency: Number
  }],
  inverseDocumentFrequency: {
    type: String
  }
});

mongoose.model('Term', TermSchema);
