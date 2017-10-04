const path = require('path');
const register = require('ignore-styles').default;

register(undefined, (module, filename) => {
  if(['.svg'].some(ext => filename.endsWith(ext))) {
    module.exports = path.relative(process.cwd(), filename);
    //module.exports = path.basename(filename);
  }
});
