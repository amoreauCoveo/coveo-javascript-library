module.exports = function sendSingleBatch(settings, data, cb) {
  const request = require('request');
  const utils = require('./utils');

  const amazonReadyData = {
    "addOrUpdate": data,
    "delete": []
  }

  let createFileOptions = {
    url: utils.setAppropriateEnv('https://push.cloud.coveo.com/v1/organizations/' + settings.orgId + '/files', settings.env),
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + settings.apiKey
    }
  }

  request(createFileOptions, function (createFileError, createFileResponse, createFileBody) {
    if (createFileError) {
      console.error("Error creating the file in Amazon: " + err);
      return;
    }
    if (createFileResponse.statusCode != 201) {
      console.error("Error creating the file in Amazon: " + createFileResponse.statusCode + " - " + createFileBody);
      return;
    }

    let createFileData = JSON.parse(createFileBody);
    let amazonUploadUrl = createFileData.uploadUri;
    let amazonUploadHeaders = createFileData.requiredHeaders;
    let pushUploadOptions = {
      url: amazonUploadUrl,
      method: "PUT",
      headers: amazonUploadHeaders,
      body: JSON.stringify(amazonReadyData)
    }
    request(pushUploadOptions, function (pushUploadError, pushUploadResponse, pushUploadBody) {
      if (pushUploadError) {
        console.error("Error pushing the data to S3: " + pushUploadError);
        return;
      }
      if (pushUploadResponse.statusCode != 200) {
        console.error("Error pushing the data to S3: ", pushUploadResponse.statusCode, pushUploadBody);
        console.error("uploadUrl: ", amazonUploadUrl);
        console.error("headers: ", amazonUploadHeaders);
        return;
      }
      let pushFileToCloudOptions = {
        url: utils.setAppropriateEnv("https://push.cloud.coveo.com/v1/organizations/" + settings.orgId + "/sources/" + settings.sourceId + "/documents/batch?fileId=" + createFileData.fileId, settings.env),
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + settings.apiKey
        }
      }
      request(pushFileToCloudOptions, function (pushFileToCloudError, pushFileToCloudResponse, pushFileToCloudBody) {
        if (pushFileToCloudError) {
          console.log("Error pushing file container to Coveo Cloud: " + pushFileToCloudError);
        }
        if (!pushFileToCloudError && pushFileToCloudResponse.statusCode != 202) {
          console.warn("Error pushing file container to Coveo Cloud: " + pushFileToCloudResponse.statusCode + " - " + pushFileToCloudBody);
        } else {
          if (typeof cb !== "function") {
            console.error("Callback is not a function.");
            return;
          }
          cb(pushFileToCloudError, pushFileToCloudResponse, pushFileToCloudBody)
        }
      });
    });
  });
}
