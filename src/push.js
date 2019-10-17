module.exports = {
  one: function (settings, data, cb) {
    const request = require('request');
    const utils = require('../utils/utils');

    let itemUri = '';

    if (settings.uri || data.uri) {
      itemUri = settings.uri || data.uri;
    } else {
      console.error('No URI provided. Please provide a valid uri either in the settings, or in the data.');
      return;
    }

    let options = {
      url: utils.setAppropriateEnv('https://push.cloud.coveo.com/v1/organizations/' + settings.orgId + '/sources/' + settings.sourceId + '/documents?documentId=' + itemUri, settings.env),
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + settings.apiKey
      },
      body: data,
      json: true
    };

    request(options, function (err, response, body) {
      if (!err && response.statusCode != 202) {
        if (response.statusCode == 429) {
          console.warn("Item was rejected because too many individual push calls were made. Consider using Coveo.push.batch to push multiple items at once instead.")
        } else {
          console.warn(response.statusCode + ' - ' + body)
        }
      } else {
        if (typeof cb !== "function") {
          console.error("Callback is not a function.");
          return;
        }
        cb(err, response, body);
      }
    })
  },
  batch: function (settings, data, cb) {
    const sendSingleBatch = require('../utils/sendSingleBatch');
    const getChunks = require('../utils/getChunks');

    let formattedData = [];

    data.forEach(item => {
      item['documentId'] = item.uri;
      if (!item.data) {
        if (item.body) {
          item['data'] = item.body;
        } else {
          item['data'] = '';
        }
      }
      formattedData.push(item);
    });

    if (!settings.maxSize) {
      settings.maxSize = '';
    }

    const chunks = getChunks(formattedData, settings.maxSize);

    chunks.forEach(chunk => {
      sendSingleBatch(settings, chunk, cb);
    })

  },
  delete: function (settings, data, cb) {
    const request = require('request');
    const utils = require('../utils/utils');

    let itemUri = '';

    if (typeof data === 'string' || settings.uri || data.uri) {
      itemUri = data || settings.uri || data.uri;
    } else {
      console.error('No URI provided. Please provide a valid uri as the second argument of this function.');
      return;
    }

    let options = {
      url: utils.setAppropriateEnv('https://push.cloud.coveo.com/v1/organizations/' + settings.orgId + '/sources/' + settings.sourceId + '/documents?documentId=' + itemUri, settings.env),
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + settings.apiKey
      },
      body: data,
      json: true
    };

    request(options, function (err, response, body) {
      if (!err && response.statusCode != 202) {
        if (response.statusCode == 429) {
          console.warn("Item deletion was rejected because too many individual push calls were made.")
        } else {
          console.warn(response.statusCode + ' - ' + body)
        }
      } else {
        if (typeof cb !== "function") {
          console.error("Callback is not a function.");
          return;
        }
        cb(err, response, body);
      }
    })
  },
  deleteOld: function (settings, timestamp, cb) {
    const request = require('request');
    const utils = require('../utils/utils');
    if (timestamp == '' || timestamp == 0) {
      timestamp = new Date().getTime();
    }

    let options = {
      url: utils.setAppropriateEnv('https://push.cloud.coveo.com/v1/organizations/' + settings.orgId + '/sources/' + settings.sourceId + '/documents/olderthan?orderingId=' + timestamp, settings.env),
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + settings.apiKey
      }
    }

    request(options, function (err, response, body) {
      if (!err && response.statusCode != 202) {
        console.warn(response.statusCode + ' - ' + body)
      } else {
        if (typeof cb !== "function") {
          console.error("Callback is not a function.");
          return;
        }
        cb(err, response, body);
      }
    })
  }
}