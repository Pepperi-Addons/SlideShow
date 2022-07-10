const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
const blockName = 'slideshow';

const webpackConfig = withModuleFederationPlugin({
    name: blockName,
    filename: `${blockName}.js`,
    exposes: {
        './SlideshowModule': './src/app/components/slideshow/index',
        './SlideshowEditorModule': './src/app/components/slideshow-editor/index'
    },
    shared: {
        ...shareAll({ strictVersion: true, requiredVersion: 'auto' }),
    }
});

module.exports = {
    ...webpackConfig,
    output: {
        ...webpackConfig.output,
        uniqueName: blockName,
    },
};