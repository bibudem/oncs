module.exports = {
  server: {
    port: 8080,
    session: 'meowmeow',
    origin: 'http://localhost:8080'
  },
  key: null,
  baseDir: 'd:\\projets\\on\\public\\cs',
  smallImageMaxSize: 2 * 1024 * 1024, // 2Mb
  extImages: [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".tiff"], // file browser
  fileTypes: {
    '.jpg': 'image',
    '.jpeg': 'image',
    '.png': 'image',
    '.tiff': 'image',
    '.tif': 'image',
    '.gif': 'image',
    '.svg': 'image'
  }
}