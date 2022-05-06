const fs = require('fs')
const { extname, join } = require('path')
const sizeOf = require('image-size')
const mime = require('mime-types')
const { getVideoDurationInSeconds } = require('get-video-duration')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const imageManifestTemplate = require('../config/image-manifest-template.json')
const videoManifestTemplate = require('../config/video-manifest-template.json')
const audioManifestTemplate = require('../config/audio-manifest-template.json')
const config = require('config')

const fileExists = async function (path) {
  return new Promise((resolve, reject) => {
    // check if file exists
    fs.stat(path, (err, stats) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

const getFileType = function (path) {
  const ext = extname(path);
  return config.get('fileTypes')[ext];
}

module.exports = async function getManifest(path) {
  const thePath = config.get('baseDir') + path;
  try {
    await fileExists(thePath)
  }
  catch (e) {
    return null
  }

  const fileType = getFileType(thePath)
  if (typeof fileType === 'undefined') {
    return null
  }
  if (fileType === 'image') {
    return getImageManifest(path)
  }
  if (fileType === 'video') {
    return await getVideoManifest(path)
  }
  if (fileType === 'audio') {
    return await getAudioManifest(path)
  }

  return null;
}

function getImageManifest(path) {
  try {
    let manifest = Object.assign({}, imageManifestTemplate);
    const imageUrl = config.get('server.origin') + path;
    const imageSize = sizeOf(config.get('baseDir') + path);
    manifest.items[0].height = imageSize.height;
    manifest.items[0].width = imageSize.width;
    manifest.items[0].items[0].items[0].body.id = imageUrl;
    manifest.items[0].items[0].items[0].body.height = imageSize.height;
    manifest.items[0].items[0].items[0].body.width = imageSize.width;
    manifest.items[0].items[0].items[0].body.format = mime.lookup(path);
    return manifest;
  } catch (e) {
    console.error(e)
    return null;
  }
}

async function getVideoManifest(path) {
  try {
    let manifest = Object.assign({}, videoManifestTemplate);
    const videoUrl = config.get('server.origin') + path;
    // const imageSize = sizeOf(config.get('baseDir') + path);
    const duration = await getVideoDurationInSeconds(config.get('baseDir') + path)
    // manifest.items[0].height = imageSize.height;
    // manifest.items[0].width = imageSize.width;
    manifest.items[0].items[0].items[0].body.id = videoUrl;
    // manifest.items[0].items[0].items[0].body.height = imageSize.height;
    // manifest.items[0].items[0].items[0].body.width = imageSize.width;
    manifest.items[0].items[0].items[0].body.format = mime.lookup(path);
    manifest.items[0].items[0].items[0].body.duration = duration;
    return manifest;
  } catch (e) {
    console.error(e)
    return null;
  }
}

async function getAudioManifest(path) {
  try {
    let manifest = Object.assign({}, audioManifestTemplate);
    const audioUrl = config.get('server.origin') + path;
    const duration = await getAudioDurationInSeconds(config.get('baseDir') + path)
    manifest.items[0].items[0].items[0].body.id = audioUrl;
    manifest.items[0].items[0].items[0].body.format = mime.lookup(path);
    manifest.items[0].items[0].items[0].body.duration = duration;
    return manifest;
  } catch (e) {
    console.error(e)
    return null;
  }
}