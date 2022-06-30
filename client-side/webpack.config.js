const { shareAll, share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
const blockName = 'slideshow';

module.exports = withModuleFederationPlugin({
    name: blockName,
    filename: `${blockName}.js`,
    exposes: {
        './SlideshowModule': './src/app/components/slideshow/index',
        './SlideshowEditorModule': './src/app/components/slideshow-editor/index'
    },
    shared: {
        ...shareAll({ strictVersion: true, requiredVersion: 'auto' }),
    },
    // shared: share({
    //     "@angular/core": { strictVersion: true, requiredVersion: 'auto' }, 
    //     "@angular/common": { strictVersion: true, requiredVersion: 'auto' }, 
    //     "@angular/common/http": { strictVersion: true, requiredVersion: 'auto' }, 
    //     "@angular/router": { strictVersion: true, requiredVersion: 'auto' },
    // })
});