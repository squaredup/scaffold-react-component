#!/usr/bin/env node
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const symbols = require('log-symbols');
const util = require('./util.js');

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

const ConstructMap = (name, type, storybookType) => {
    return {
        [StubName] : name,
        [StubNameLower]: name.toLowerCase(),
        [StubStoryBookType]: storybookType
    }
};

const log = {
    ok: (text) => console.log(`${symbols.success} ${chalk.green(text)}`),
    err: (text) => console.log(`${symbols.error} ${chalk.red(text)}`),
    info: (text) => console.log(`${chalk.blue(text)}`)
};

const scaffold = (name, type, storybookType) => {
    log.info(`Scaffolding component ${name} (${type})`);

    const component = ComponentTargetPath(name);

    // React component
    switch(type){
        case 'functional':
            util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentFunctionalSrcPath), 
                path.resolve(process.cwd(), component), 
                ConstructMap(name, type, storybookType)
            );
            log.ok(`Created functional component ${chalk.green.underline.bold(component)}`);
            break;

        case 'class':
            util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentClassSrcPath), 
                path.resolve(process.cwd(), component), 
                ConstructMap(name, type, storybookType)
            );
            log.ok(`Created class component ${chalk.green.underline.bold(component)}`);
            break;

    }

    // SCSS
    util.readReplaceWriteAsync(
        path.resolve(__dirname, StyleSrcPath), 
        path.resolve(process.cwd(), StyleTargetPath(name)), 
        ConstructMap(name, type, storybookType)
    );
    log.ok(`Created SCSS module for component ${chalk.green.underline.bold(StyleTargetPath(name))}`);

    // Story
    util.readReplaceWriteAsync(
        path.resolve(__dirname, StorySrcPath), 
        path.resolve(process.cwd(), StoryTargetPath(name)), 
        ConstructMap(name, type, storybookType)
    );
    log.ok(`Created Story for component ${chalk.green.underline.bold(StoryTargetPath(name))}`);

    // Test
    util.readReplaceWriteAsync(
        path.resolve(__dirname, TestSrcPath), 
        path.resolve(process.cwd(), TestTargetPath(name)), 
        ConstructMap(name, type, storybookType)
    );
    log.ok(`Created Test for component ${chalk.green.underline.bold(TestTargetPath(name))}`);
}

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
            try {
                scaffold(argv.name, argv.type, argv.sb);
                log.info(chalk.bold("Scaffolding complete!"))
            } catch (ex) {
                log.err(ex);
            }
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
        if(!(argv.name.charCodeAt(0) >= 65 && argv.name.charCodeAt(0) <= 90)) {
            log.err('Error: The component name should be capitalised.');
            false;
        }; 

        return true;
    })
    .wrap(yargs.terminalWidth())   
    .help()
    .argv;