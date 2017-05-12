import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

// production vs development variables
const LAUNCH_COMMAND = process.env.npm_lifecycle_event;
const isProduction = LAUNCH_COMMAND === 'build-dist';
process.env.BABEL_ENV = LAUNCH_COMMAND;

const PATHS = {
    app: path.resolve(__dirname, 'www/app'),
    bin: path.resolve(__dirname, 'www/bin'),
};

const HtmlWebpackPluginConfig = 
    new HtmlWebpackPlugin({
        template: path.resolve(PATHS.app, 'index.html'),
        filename: 'index.html',
        inject: 'body'
    })

// tells React to use the production version of itself
const productionEnvPlugin = 
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
        }
    });

const consoleRainbowPlugin =
    new webpack.DefinePlugin({
        'console.rainbow': function (color, input) {
            console.log(`%c${input}`, `color:${color};`);
        }
    });


const buildInfoPlugin =
    new webpack.DefinePlugin({
        "build.info": {
            version: JSON.stringify(require(path.resolve(__dirname, 'package.json')).version),
            date: JSON.stringify(`${new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}`),
            environment: JSON.stringify((isProduction) ? 'PRODUCTION': 'DEVELOPMENT'),
        }
    });

// prints console.debug messages in dev builds
const consolePluginDev =
    new webpack.DefinePlugin({
        'console.debug': function (input) {
            console.debug(input);
        }
    });

// removes console.debug messages from production builds
const consolePluginProduction =
    new webpack.DefinePlugin({
        'console.debug': function (input) {
            console.log();
        }
    });

// webpack's uglifier
const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    mangle: {
        screw_ie8: true
    }
});

// hot module replacement for nicer dev experience
const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

// common config options between dev and production builds
const baseConfig = {
    entry: [
        PATHS.app,
    ],
    output: {
        path: PATHS.bin,
        filename: "bundle.min.js"
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015', 'stage-0']
                }
            }, {
                test: /\.(png|svg|gif|jpg)$/,
                loader: 'url-loader?limit=100000'
            }, {
                test: /\.(svg(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader'
            }, {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            }, {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.min.js'],
        modules: [path.resolve(__dirname, "www/app"), "node_modules"]
    }
};

let basePlugins = [buildInfoPlugin, consoleRainbowPlugin, HtmlWebpackPluginConfig];
const devPlugins = [consolePluginDev, HotModuleReplacementPlugin]
const productionPlugins = [uglifyPlugin, consolePluginProduction, productionEnvPlugin]

const productionConfig = {
    devtool: 'cheap-module-source-map',
    plugins: basePlugins.concat(productionPlugins),
};

const devConfig = {
    devtool: 'source-map',
    devServer: {
        hot: true,
        inline: true,
        historyApiFallback: {
            index: path.resolve(PATHS.app, 'index.html'),
        },
        contentBase: PATHS.bin,
        // Display only errors to reduce the amount of output.
        stats: 'errors-only',
        port: '8888',

    },
    plugins: basePlugins.concat(devPlugins),
};

export default Object.assign({}, baseConfig,
    isProduction ? productionConfig : devConfig
);
