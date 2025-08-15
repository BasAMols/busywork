/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import express from 'express';
import fs from 'fs';
import { glob } from 'glob';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import path from 'path';

const app = express();
const port = 3000;
let client = null;

// Check if the optional "watch" and or "verbose" flag is there.
const WATCH = !!process.argv.find((f) => f === '-w' || f === '--watch');
const HOTRELOAD = !!process.argv.find((f) => f === '-h' || f === '--hotreload');

/**
 * Report/log possible error and warning messages.
 * @param {esbuild.Message[]} errors
 * @param {esbuild.Message[]} warnings
 */
function checkForErrorWarnings(errors, warnings) {
    if (errors.length > 0) {
        for (const error of errors) {
            console.error(error);
        }
    }
    if (warnings.length > 0) {
        for (const warning of warnings) {
            console.warn(warning);
        }
    }
}

/**
 * Write all provided files to the system.
 * @param {esbuild.OutputFile[]} outFiles
 */
async function writeBundlesToSystem(outFiles) {
    const p = [];
    for (const outFile of outFiles) {
        const dirName = path.dirname(outFile.path);
        //Check if path exits
        if (!fs.existsSync(dirName)) {
            // If not, create directory.
            fs.mkdirSync(dirName, { recursive: true });
        }

        p.push(fs.promises.writeFile(outFile.path, outFile.text, 'utf8'));
    }

    return Promise.all(p);
}

/**
 * Start separate express server to serve files.
 * Esbuild server does not serve latest files on system.
 * See: https://github.com/evanw/esbuild/issues/3101
 */
function startExpressServer() {
    console.log('start');
    app.use(express.static('.'));

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });

    app.get('/express', (req, res) => {
        // send headers to keep connection alive
        const headers = {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
        };
        res.writeHead(200, headers);

        // store `res` of client to let us send events at will
        client = res;

        // listen for client 'close' requests
        req.on('close', () => {
            client = null;
        });
    });
}


/**
 * Copy a file to a destination, with checking and possibly creating the destination folder.
 * @param {*} source The file you want to copy.
 * @param {*} destPath Path of the folder you want to copy to.
 * @param {*} destFile (new) name of the copied file.
 */
function fsCopyFile(source, destPath, destFile) {
    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
    }
    fs.copyFileSync(source, `${destPath}/${destFile}`);
}


const entryPoints = await glob('./ts/index.ts');

// Check if Glob was able to pickup any entry points.
if (entryPoints?.length <= 0) {
    console.error('\x1b[41m%s\x1b[0m', 'No entrypoint have been detected.');
    process.exit(1);
}

// Bundle entry points with esbuild.
const esbuildContext = await esbuild.context({
    entryPoints,
    bundle: true,
    outdir: 'dist',
    outbase: 'ts',
    format: 'esm',
    target: [
        'chrome55',
        'edge18', //Use 18 (instead of 15) because destructuring and for of/in loop did't work.
        'firefox53', //Use 53 (instead of 52) because destructuring and for of/in loop did't work.
        'safari11',
        'opera42',
        'es2017',
    ],
    sourcemap: true,
    write: false,
    plugins: [
        sassPlugin(),
        {
            name: 'env',
            setup(build) {
                // Holds a the package names per course/graphic in a object.
                let includeObj = {};
                
                build.onResolve({ filter: /local_packages\/[\w\d-]+\/module/u }, (args) => {
                    // Catch all package imports and create obj. To be able to insert translation files in `onEnd` callback. 
                    const importerMatch = args.importer.match(/(?<course>[\d]{4}-\w+)\\(?<graphic>[\w\d-]+)/u);
                    const packageMatch = args.path.match(/local_packages\/(?<packageName>[\w\d-]+)\/module/u);
                    if (importerMatch) {
                        if (!Object.prototype.hasOwnProperty.call(includeObj, `${importerMatch.groups.course}/${importerMatch.groups.graphic}`)) {
                            includeObj[`${importerMatch.groups.course}/${importerMatch.groups.graphic}`] = [];
                        }
                        includeObj[`${importerMatch.groups.course}/${importerMatch.groups.graphic}`].push(packageMatch.groups.packageName);
                    }
                });
                build.onEnd((result) => 
                    // eslint-disable-next-line no-async-promise-executor
                     new Promise(async (resolve) => {
                        checkForErrorWarnings(result.errors, result.warnings);

                        //Modify the esbuild bundle results
                        for (const [index, outFile] of result.outputFiles.entries()) {
                            // Only modify `.js` files
                            if (outFile.path.match(/\.js$/u)) {
                                // Create array of paths to package translation files.

                                let content = outFile.text;
                                // Remove export
                                content = content.replace(/export\s\{\n\s\sgraphic\sas\sdefault\n\};/gmu, '');
                                // Remove graphic function
                                content = content.replace(/function graphic\(\) \{/gmu, '');

                                // You cannot modify .text because its only a getter.
                                // Also see: https://github.com/evanw/esbuild/issues/1792
                                result.outputFiles[index].contents = Buffer.from(`${content}`);
                            }
                        }

                        //Write results to files.
                        await writeBundlesToSystem(result.outputFiles);

                        console.log(
                            '\x1b[32m%s\x1b[0m',
                            `[${new Date().toLocaleTimeString()}] Successfully bundled all files!`
                        );

                        // Empty object otherwise include statements just add up.
                        // eslint-disable-next-line require-atomic-updates
                        includeObj = {};

                        // client is not assigned on first build.
                        if (client && HOTRELOAD) {
                            // Send refresh event to index.html (must start with 'data: ', and end with '\n\n').
                            client.write('data: refresh\n\n');
                        }

                        resolve();
                    })
                );
            },
        },
    ],
});

if (WATCH) {
    await esbuildContext.watch();

    console.log('Watching files...');

    

    startExpressServer();
} else {
    await esbuildContext.rebuild();

    await esbuildContext.dispose();
}
