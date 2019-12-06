const { override, fixBabelImports, addLessLoader } = require('customize-cra');
// const rewireReactHotLoader = require('react-app-rewire-hot-loader');

const bgColor = '#f2f6ff';
const defaultColor = '#3E80FB';
const hoverColor = '#145ce2';

const option = [
  // 按需加载
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  // 自定义主题加载less
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': defaultColor,
      '@border-radius-base': '2px',
      '@link-hover-color': hoverColor,
      '@btn-default-border': defaultColor,
      '@btn-default-color': defaultColor,
      '@table-row-hover-bg': bgColor,
      '@item-hover-bg': bgColor,
      '@menu-bg': bgColor,
    },
  }),
];

// 热更新
// if (process.env.NODE_ENV === 'development') {
//   option.push((config, env) => rewireReactHotLoader(config, env));
// }

/* config-overrides-overrides.js */
module.exports = override(...option);
