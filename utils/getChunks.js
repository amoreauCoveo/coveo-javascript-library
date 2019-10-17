module.exports = function getChunks(arr, maxSize) {
  const utils = require('./utils');

  if (maxSize == '') {
    maxSize = 256 * 1024 * 1024; 
  }
  
  let allChunks = [];
  let currentChunk = [];

  for (i = 0; i < arr.length; i++) {
    if (currentChunk.length > 0 && utils.getSizeInBytes(currentChunk) + utils.getSizeInBytes(arr[i]) > maxSize) {
      allChunks.push(currentChunk);
      currentChunk = [];
    }
    currentChunk.push(arr[i]);
    if (i == arr.length - 1) {
      allChunks.push(currentChunk);
    }
  }

  return allChunks;
}