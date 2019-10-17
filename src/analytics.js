module.exports = {
  send: function (settings, body, cb) {
    const request = require('request');
    const utils = require('../utils/utils');

    const isOrgSpecified = settings.orgId ? 'org=' + settings.orgId : '';
    const isVisitorSpecified = body.visitorId ? 'visitor=' + body.visitorId : '';
    const oneSpecified = isOrgSpecified || isVisitorSpecified ? '?' : '';
    const bothSpecified = isOrgSpecified && isVisitorSpecified ? '&' : '';

    const options = {
      url: utils.setAppropriateEnv('https://usageanalytics.coveo.com/rest/v15/analytics/search' + oneSpecified + isOrgSpecified + bothSpecified + isVisitorSpecified, settings.env),
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + settings.apiKey
      },
      body: body,
      json: true
    }

    request(options, function (err, response, body) {
      if (typeof cb !== "function") {
        console.error("Callback is not a function.");
        return;
      }
      if (response.statusCode != 200) {
        err = {
          statusCode: response.statusCode,
          response: body
        }
      }
      cb(err, response, body);
    })
  }
}