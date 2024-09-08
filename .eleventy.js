// .eleventy.js

module.exports = function(eleventyConfig) {
    // Copy the `img/` directory
    eleventyConfig.addPassthroughCopy( { "_src/assets" : "assets" } );
    
    // CNAME
    eleventyConfig.addPassthroughCopy( "CNAME" );

    // Watch CSS files for changes
    eleventyConfig.setBrowserSyncConfig({
          files: './_site/css/**/*.css'
      });
  };