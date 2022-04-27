#!/usr/bin/env node

import fs from "fs";
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

Object.entries(config).map(async ([baseDir, distFile]) => {
    baseDir = baseDir.replace(/^\//, '');
    distFile = distFile.replace(/^\//, '');

    if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
        fs.writeFileSync(distFile, await generate(baseDir));
        console.log('next-with-rrd watching: ' + baseDir + '; to: ' + distFile);

        fs.watch(baseDir, {recursive: true}, async (event) => {
            if (event == 'rename') {
                try {
                    fs.writeFileSync(distFile, await generate(baseDir));
                    console.log('next-with-rrd generate success');
                } catch (e: any) {
                    console.warn('next-with-rrd: ' + e.message);
                }
            }
        });
    } else {
        console.warn('next-with-rrd: skip:' + baseDir);
    }
})
console.log('next-with-rrd watching...');
