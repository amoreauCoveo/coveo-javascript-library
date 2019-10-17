module.exports = {
  setAppropriateEnv: function (url, env = '') {
    if (env.toLowerCase() == 'prod' || env.toLowerCase() == 'production') {
      env = '';
    }
    if (env.toLowerCase() == 'staging' || env.toLowerCase() == 'uat' || env.toLowerCase() == 'qa') {
      if (url.startsWith('https://usageanalytics.coveo.com')) {
        env = 'staging';
      } else {
        env = 'qa';
      }
    }
    if (env.toLowerCase() == 'development') {
      env = 'dev';
    }

    let isRecognizedEnv = env == '' || env.toLowerCase() == 'qa' || env.toLowerCase() == 'staging' || env.toLowerCase() == 'dev' || env.toLowerCase() == 'hipaa';

    if (!isRecognizedEnv) {
      console.warn("The environment you are trying to connect to is not recognized. Your call may fail due to a wrong endpoint.\nRecognized environments are 'production', 'hipaa', 'qa', and 'dev'.")
    }

    if (env == '') {
      return url;
    }

    return url.split('.', 1) + env + url.substring(url.indexOf('.'));
  },
  htmlize: function (str) {
    return str.normalize('NFKD').replace(/[^\w]/g, '');
  },
  addZeroWhenTooSmall: function (num, lgth = 2) {
    if (num.toString().length < lgth) {
      zerosToAdd = lgth - num.toString().length;
      for (i = 0; i < zerosToAdd; i++) {
        num = "0" + num;
      }
    }
    return num;
  },
  getCurrentTime: function () {
    const utils = require('./utils');
    const currentTime = new Date();
    let currentTimeArray = [currentTime.getFullYear(),
    currentTime.getMonth() + 1,
    currentTime.getDate(),
    currentTime.getHours(),
    currentTime.getMinutes(),
    currentTime.getSeconds()];

    for (i = 0; i < currentTimeArray.length; i++) {
      currentTimeArray[i] = utils.addZeroWhenTooSmall(currentTimeArray[i]);
    }

    const timeNow = currentTimeArray[0] + "/" + currentTimeArray[1] + "/" + currentTimeArray[2] + ": " + currentTimeArray[3] + ":" + currentTimeArray[4] + ":" + currentTimeArray[5];
    return timeNow;
  },
  getSizeInBytes: function (str) {
    if (typeof str == "object") {
      str = JSON.stringify(str);
    } else if (typeof str == "number") {
      str = str.toString();
    }
    let m = encodeURIComponent(str).match(/%[89ABab]/g);

    return str.length + (m ? m.length : 0);
  }
}