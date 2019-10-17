module.exports = function search(settings, query, cb, analyticsSettings, analyticsCb = function (err) { console.log('Failed to send analytics event:', err) }) {
  const request = require('request');
  const utils = require('../utils/utils');
  const Coveo = require('../Coveo');

  if (typeof settings !== "object") {
    settings = {
      apiKey: settings,
      env: 'prod'
    }
  }

  if (typeof query !== "object") {
    query = {
      "q": query
    }
  }

  const urlQueryParam = settings.orgId ? '?organizationId=' + settings.orgId : '';

  const options = {
    url: utils.setAppropriateEnv('https://platform.cloud.coveo.com/rest/search/v2/' + urlQueryParam, settings.env),
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + settings.apiKey
    },
    body: query,
    json: true
  }

  request(options, function (err, response, body) {
    if (!err && response.statusCode != 200) {
      if (body.message) {
        err = response.statusCode + ' - ' + body.message
      } else {
        err = response.statusCode + ' - ' + body;
      }
    }
    if (typeof cb !== "function") {
      console.error("Callback is not a function.");
      return;
    }
    cb(err, response, body);

    if (analyticsSettings) {

      if (settings.analyticsKey) {
        settings.apiKey = settings.analyticsKey;
      }

      delete analyticsSettings.searchQueryUid;
      delete analyticsSettings.queryText;
      delete analyticsSettings.advancedQuery;
      delete analyticsSettings.numberOfResults;
      delete analyticsSettings.responseTime;
      delete analyticsSettings.queryPipeline;

      let analyticsBody = {
        language: "en",
        originContext: "CoveoJavaScriptLibrary",
        searchQueryUid: body.searchUid,
        queryText: query.q || "",
        actionCause: "CustomCode",
        advancedQuery: query.aq || "",
        numberOfResults: body.totalCount,
        responseTime: body.requestDuration,
        queryPipeline: body.pipeline
      }

      const analyticsOptions = Object.assign(analyticsSettings, analyticsBody);
      Coveo.analytics.send(settings, analyticsOptions, analyticsCb);
    }
  })
}
