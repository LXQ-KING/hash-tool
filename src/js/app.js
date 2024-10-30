const packageJson = require('../../package.json')
document.head.querySelector('title').textContent = packageJson.description + ' v' + packageJson.version

