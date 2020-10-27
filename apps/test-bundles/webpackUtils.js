// @ts-check
const path = require('path');
const fs = require('fs');
const resources = require('@fluentui/scripts/webpack/webpack-resources');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function createWebpackConfig(entries) {
  return Object.keys(entries).map(entryName => {
    let anaylizerPluginOptions = {
      analyzerMode: 'static',
      reportFilename: entryName + '.stats.html',
      openAnalyzer: false,
      generateStatsFile: false,
      logLevel: 'warn',
    };

    const { entryPath, includeStats } = entries[entryName];

    if (includeStats) {
      anaylizerPluginOptions = {
        ...anaylizerPluginOptions,
        generateStatsFile: true,
        statsOptions: {
          // https://webpack.js.org/configuration/stats
          assets: true,
          modules: true,

          builtAt: false,
          outputPath: false,
          namedChunkGroups: false,
          logging: false,
          children: false,
          source: false,
          reasons: false,
          chunks: false,
          cached: false,
          cachedAssets: false,
          performance: false,
          timings: false,
        },
        statsFilename: entryName + '.stats.json',
      };
    }

    return resources.createConfig(
      entryName,
      true,
      {
        entry: {
          [entryName]: entryPath,
        },
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        plugins: [new BundleAnalyzerPlugin(anaylizerPluginOptions)],
      },
      true,
      true,
    )[0];
  });
}

// Files which should not be considered top-level entries.
const TopLevelEntryFileExclusions = ['index.js', 'version.js', 'index.bundle.js'];

/**
 * Build webpack entries based on top level imports available in a package.
 *
 * @param {boolean} [includeStats] - Stats are generated and used by the size auditor report
 * to check more details on what caused the bundle size change. Due to stats generation being slow,
 * and therefore slowing down CI significantly, setting this to true to avoid stats generation.
 * If bundle size is changed unexpectedly, developers can drill down deeper on the problem by
 * locally running bundle tests.
 * @param {boolean} [onlyOwnComponents] - If true, only run the tests for an entry point file if it
 * has a corresponding folder under `lib/components`. This eliminates duplicate bundle size tests
 * for components which are just re-exported.
 */
function buildEntries(packageName, entries = {}, includeStats = true, onlyOwnComponents = false) {
  let packagePath = '';

  try {
    packagePath = path.dirname(require.resolve(packageName)).replace('lib-commonjs', 'lib');
  } catch (e) {
    console.log(`The package "${packageName}" could not be resolved. Add it as a dependency to this project.`);
    console.log(e);
    return;
  }

  fs.readdirSync(packagePath).forEach(itemName => {
    const isAllowedFile =
      // is JS
      itemName.match(/.js$/) &&
      // not excluded
      !TopLevelEntryFileExclusions.includes(itemName) &&
      // if requested, has component implementation within this package (not re-export)
      (!onlyOwnComponents || fs.existsSync(path.join(packagePath, 'components', itemName.replace('.js', ''))));

    if (isAllowedFile) {
      const entryName = itemName.replace(/.js$/, '');

      // Replace commonjs paths with lib paths.
      const entryPath = path.join(packagePath, itemName);

      entries[`${packageName.replace('@', '').replace('/', '-')}-${entryName}`] = {
        entryPath,
        includeStats,
      };
    }
  });

  return entries;
}

/**
 * Create entries for single top level import.
 */
function buildEntry(packageName, includeStats = true) {
  return {
    entryPath: path.join(path.dirname(require.resolve(packageName)).replace('lib-commonjs', 'lib'), 'index.js'),
    includeStats,
  };
}

module.exports = {
  createWebpackConfig,
  buildEntries,
  buildEntry,
};
