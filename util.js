const fs = require('fs');
const util = require('util');
const path = require('path');
const chalk = require('chalk');
const log = require('./log.js');

const fsp = {
    readFile: util.promisify(fs.readFile),
    writeFile: util.promisify(fs.writeFile),
    access: util.promisify(fs.access),
    readdir: util.promisify(fs.readdir),
    mkdir: util.promisify(fs.mkdir)    
};

/**
 * Read & replace the contents of a file before writing it to a new file.
 * @param {string} source Source file to read
 * @param {string} target Target file to write
 * @param {Object} replacements Map of replacements to make in source file
 */
const readReplaceWriteAsync = async (source, target, replacements) => {    
    if (!(await pathExists(target))) {
        try {
            const data = await fsp.readFile(source, 'utf8');

            const replace = Object.keys(replacements).join('|');

            const result = data.replace(new RegExp(replace, 'g'), (matched) => replacements[matched]);

            await fsp.writeFile(target, result, 'utf8');
            
        } catch(err) {
            throw new Error('Could not create file:', err);
        }
    }
    else {
        throw new Error(`File creation aborted ${target} already exists.`);
    }    
}

/**
 * Check the given folder path needs creating, and create if needed.
 * Also checks if the current working directory is already a suitable candidate.
 * @param {string} targetPath 
 */
const checkAndCreateTargetPath = async (targetPath) => {    
    const currentDirectoryMatches = (targetPath === path.basename(process.cwd()));
    
    // First, check if are already in a folder that matches the intended component name
    if(currentDirectoryMatches) {
        
        if(await directoryEmpty(process.cwd())) { //If it's empty proceed with the cwd
            log.info("Current directory matches intended name, creating component in place.");
            return process.cwd();
        } else {
            throw new Error("Current directory matches intended component, but is not empty. Stopping creation.");
        }

    } else { // If not, check if the intended folder already exists
        const absoluteTargetPath = path.resolve(process.cwd(), targetPath);
        const dirExists = await pathExists(absoluteTargetPath);

        if(dirExists) { // Folder exists, check it is empty
            const dirEmpty = await directoryEmpty(absoluteTargetPath);
            
            if(dirEmpty) {  // If it's empty, proceed
                log.info("Intended directory exists, skipping creation.");
                return absoluteTargetPath;
            } else {
                throw new Error('Directory exists, and is not empty. Stopping creation.');
            }

        } else { // Folder does not exist, create it
            log.ok(`Created folder for component: ${chalk.green.underline.bold(targetPath)}`); 
            await createDirectory(absoluteTargetPath);
            return absoluteTargetPath;
        } 
    }
}

/**
 * Checks if a given path (file/folder) exists
 * @param {string} dir 
 */
const pathExists = async (dir) => {
    return await fsp.access(dir)
    .then(
        () => true)
    .catch(
        () => false);
}

/**
 * Checks if a given directory is empty
 * @param {string} dir 
 */
const directoryEmpty = async (dir) => {
    return (await fsp.readdir(dir)).length === 0;
}

/**
 * Creates the given directory
 * @param {string} dir 
 */
const createDirectory = async (dir) => {
    return await fsp.mkdir(dir);
}

/**
 * Checks the given character is a capital letter
 * @param {string} c 
 */
const isCapitalLetter = (c) => {
    return c === c.toUpperCase();
}

/**
 * Converts the given string into kebab case (from pascal case)
 * @param {string} str 
 */
const toKebabCase = (str) => {
    const result = str.replace(/[A-Z]/g, match => '-' + match.toLowerCase())
    return isCapitalLetter(str[0]) ? result.substring(1) : result;
}

module.exports = { 
    readReplaceWriteAsync, 
    checkAndCreateTargetPath,
    toKebabCase,
    isCapitalLetter     
};