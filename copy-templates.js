const glob = require('glob');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

async function copyTemplates() {
    const files = glob.sync('src/**/*.html');

    for (const file of files) {
        const destFile = path.join('dist', path.relative('src', file));
        const destDir = path.dirname(destFile);

        try {
            await mkdir(destDir, { recursive: true });
            await copyFile(file, destFile);
            console.log(`Copied ${file} to ${destFile}`);
        } catch (err) {
            console.error(`Error copying ${file} to ${destFile}:`, err);
        }
    }
}

copyTemplates();