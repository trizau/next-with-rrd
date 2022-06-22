#!/usr/bin/env node

import fs from "fs";
import watch from "node-watch";
import generate from "./generate";

const config: { [keys: string]: string } = JSON.parse(
    fs.readFileSync(
        'next-with-rrd.json',
        {encoding: 'utf-8'}
    ).toString()
);


// (async () => {
//     const baseDir = 's';
//     const distFile = 'xx/index.tsx';
//     fs.writeFileSync(distFile, await generate(baseDir));
// })();

let timer: NodeJS.Timeout;

Object.entries(config).map(async ([baseDir, distFile]) => {
    baseDir = baseDir.replace(/^\//, '');
    distFile = distFile.replace(/^\//, '');

    if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
        fs.writeFileSync(distFile, await generate(baseDir));
        console.log('next-with-rrd watching: ' + baseDir + '; to: ' + distFile);

        watch(baseDir, {recursive: true}, (eventType, filePath) => {
            clearTimeout(timer);
            timer = setTimeout(async () => {
                // if (eventType == 'update') {
                try {
                    fs.writeFileSync(distFile, await generate(baseDir));
                    console.log('next-with-rrd generate success');
                } catch (e: any) {
                    console.warn('next-with-rrd: ' + e.message);
                }
                // }
            }, 1000);
        });
    } else {
        console.warn('next-with-rrd: skip:' + baseDir);
    }
})
console.log('next-with-rrd watching...');
