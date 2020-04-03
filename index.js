#!/usr/bin/env node
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const util = require('./util.js');
const log = require('./log.js');

const StubName = "__NAME__";
const StubNameLower = "__NAME_LOWER__";
const StubStoryBookType = "__SB_TYPE__";

const ComponentClassSrcPath = 'template/component-class.js';
const ComponentFunctionalSrcPath = 'template/component-functional.js';
const StyleSrcPath = 'template/component.module.scss';
const StorySrcPath = 'template/component.stories.js';
const TestSrcPath = 'template/component.test.js';

const ComponentTargetPath = (name) => `${name}.js`;
const StyleTargetPath = (name) => `${name}.module.scss`;
const StoryTargetPath = (name) => `${name}.stories.js`;
const TestTargetPath = (name) => `${name}.test.js`;

/**
 * Construct a map of string replaces to perform in templates
 * @param {string} name Component name
 * @param {*} storybookType Storybook type/category
 */
const ConstructMap = (name, storybookType) => {
    return {
        [StubName] : name,
        [StubNameLower]: name.toLowerCase(),
        [StubStoryBookType]: storybookType
    }
};

/**
 * Scaffold a React component and associated files
 * @param {string} name Component name
 * @param {string} type Component type (class/functional)
 * @param {string} storybookType Storybook type/category
 */
const Scaffold = async (name, type, storybookType) => {

    log.info(`Scaffolding component ${name} (${type})`);
    
    const directory = util.toKebabCase(name);
    const targetPath = await util.checkAndCreateTargetPath(directory);
    
    const component = ComponentTargetPath(name);
    const map = ConstructMap(name, storybookType);

    // React component
    switch(type){
        case 'functional':
            await util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentFunctionalSrcPath), 
                path.resolve(targetPath, component), 
                map
            );
            log.ok(`Created functional component ${chalk.green.underline.bold(component)}`);
            break;

        case 'class':
            await util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentClassSrcPath), 
                path.resolve(targetPath, component), 
                map
            );
            log.ok(`Created class component ${chalk.green.underline.bold(component)}`);
            break;
    }

    // SCSS
    await util.readReplaceWriteAsync(
        path.resolve(__dirname, StyleSrcPath), 
        path.resolve(targetPath, StyleTargetPath(name)), 
        map
    );
    log.ok(`Created SCSS module for component ${chalk.green.underline.bold(StyleTargetPath(name))}`);

    // Story
    await util.readReplaceWriteAsync(
        path.resolve(__dirname, StorySrcPath), 
        path.resolve(targetPath, StoryTargetPath(name)), 
        map
    );
    log.ok(`Created Story for component ${chalk.green.underline.bold(StoryTargetPath(name))}`);

    // Test
    await util.readReplaceWriteAsync(
        path.resolve(__dirname, TestSrcPath), 
        path.resolve(targetPath, TestTargetPath(name)), 
        map
    );
    log.ok(`Created Test for component ${chalk.green.underline.bold(TestTargetPath(name))}`);
}

/**
 * CLI
 */

yargs
    .scriptName('scaffold')
    .command(
        '$0 [name] [type] [storybookCategory]', 
        chalk.green.bold('Scaffold a React component with styles, tests and a story.'), 
        (y) => {
            y.example('$0', 'ActionPanel');
            y.example('$0', 'ActionPanel class');
            y.example('$0', 'ActionPanel --type class');
            y.example('$0', 'ActionPanel Common');
            y.example('$0', 'ActionPanel --sb Common');
        }, 
        (argv) => {
            return Scaffold(argv.name, argv.type, argv.sb).then(() => {
                log.info(chalk.bold("Scaffolding complete!"))
            })
            .catch(ex => {                               
                log.err(ex);
            });
    })
    .option('name', {
        alias: 'n',
        type: 'string',
        description: chalk.blue('The name of the component to scaffold'),
        demandOption: true
    })
    .option('type', {
        alias: 't',
        type: 'string',
        description: chalk.blue('Type of the React component'),
        choices: ['functional', 'class'],
        default: 'functional'
    })
    .option('storybookCategory', {
        alias: 'sb',
        type: 'string',
        description: chalk.blue('Category for the Story to use'),
        default: 'Common'
    })
    .check((argv) => {
        //check first letter of name is a capital
        if(!(util.isCapitalLetter(argv.name[0]))) {
            log.err('Error: The component name should be capitalised.');
            return false;
        }; 

        return true;
    })
    .wrap(yargs.terminalWidth())   
    .help()
    .argv;
    