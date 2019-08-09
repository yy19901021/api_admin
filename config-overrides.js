const { override, fixBabelImports, overrideDevServer } = require('customize-cra');
module.exports = override(
     fixBabelImports('import', {
       libraryName: 'antd',
       libraryDirectory: 'es',
       style: 'css',
     })
   );