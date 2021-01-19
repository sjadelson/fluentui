import { webpackCliTask, argv, logger } from 'just-scripts';
import * as path from 'path';
import * as fs from 'fs';
import execSync from '../exec-sync';
import { Arguments } from 'yargs-parser';

type JustArguments<T extends Record<string, unknown>> = Arguments & T;

export function webpack() {
  const args: JustArguments<Partial<{ production: boolean }>> = argv();
  return webpackCliTask({
    webpackCliArgs: args.production ? ['--production'] : [],
    nodeArgs: ['--max-old-space-size=4096'],
  });
}

export function webpackDevServer(
  options: Partial<{
    /**
     * Open the default browser
     * @default 'true'
     */
    open: 'true' | 'false';
    /**
     * @default 'webpack.serve.config.js'
     */
    webpackConfig: string;
    /**
     * @default false
     */
    cached: boolean;
  }> = {},
) {
  return async () => {
    const args = { ...argv(), ...options };

    const fp = (await import('find-free-port')).default;
    const webpackConfigFilePath = args.webpackConfig || 'webpack.serve.config.js';
    const configPath = path.resolve(process.cwd(), webpackConfigFilePath);
    const port = await fp(4322, 4400);
    const openBrowser = args.open === 'false' ? '' : '--open';

    if (fs.existsSync(configPath)) {
      const webpackDevServerPath = require.resolve('webpack-dev-server/bin/webpack-dev-server.js');
      const cmd = `node ${webpackDevServerPath} --config ${configPath} --port ${port} ${openBrowser}`.trim();

      logger.info(`Caching enabled: ${args.cached ? 'YES' : 'NO'}`);
      logger.info('Running: ', cmd);

      process.env.cached = String(args.cached);

      execSync(cmd);
    }
  };
}

let server;
export async function webpackDevServerWithCompileResolution() {
  return async function() {
    const webpack = (await import('webpack')).default;
    const webpackDevServer = await import('webpack-dev-server');
    return new Promise((resolve, reject) => {
      const webpackConfig = require(path.resolve(process.cwd(), 'webpack.serve.config.js'));

      const compiler = webpack(webpackConfig);
      compiler.plugin('done', () => {
        resolve();
      });

      const devServerOptions = Object.assign({}, webpackConfig.devServer, {
        stats: 'minimal',
      });
      server = new webpackDevServer(compiler, devServerOptions);
      const port = webpackConfig.devServer.port;
      server.listen(port, '127.0.0.1', () => {
        console.log(`started server on http://localhost:${port}`);
      });
    });
  };
}

webpackDevServerWithCompileResolution.done = async function() {
  return new Promise((resolve, reject) => {
    server.close(() => {
      resolve();
    });
  });
};
