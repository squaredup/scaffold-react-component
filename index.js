#!/usr/bin/env node
const path = require('path');
const yargs = require('yargs');
const util = require('./util.js');

const StubName = "__NAME__";
const StubNameLower = "__NAME_LOWER__";
const StubStoryBookType = "__SB_TYPE__";

const ComponentClassSrcPath = 'template/component-class.js';
const ComponentFunctionalSrcPath = 'template/component-functional.js';
const StyleSrcPath = 'template/component.module.scss';
const StorySrcPath = 'template/component.story.js';
const TestSrcPath = 'template/component.test.js';

const ComponentTargetPath = (name) => `${name}.js`;
const StyleTargetPath = (name) => `${name}.module.scss`;
const StoryTargetPath = (name) => `${name}.story.js`;
const TestTargetPath = (name) => `${name}.test.js`;

const ConstructMap = (name, type, storybookType) => {
    return {
        [StubName] : name,
        [StubNameLower]: name.toLowerCase(),
        [StubStoryBookType]: storybookType
    }
};

const scaffold = (name, type, storybookType) => {
    console.log(`Scaffolding component ${name} (${type})`);

    const component = ComponentTargetPath(name);

    // React component
    switch(type){
        case 'functional':
            util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentFunctionalSrcPath), 
                path.resolve(process.cwd(), component), 
                ConstructMap(name, type, storybookType)
            );
            console.log(`Created functional component ${component}`);
            break;

        case 'class':
            util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentClassSrcPath), 
                path.resolve(process.cwd(), component), 
                ConstructMap(name, type, storybookType)
            );
            console.log(`Created class component ${component}`);
            break;

    }

    // SCSS
    util.readReplaceWriteAsync(
        path.resolve(__dirname, StyleSrcPath), 
        path.resolve(process.cwd(), StyleTargetPath(name)), 
        ConstructMap(name, type, storybookType)
    );
    console.log(`Created SCSS module for component ${StyleTargetPath(name)}`);

    // Story
    util.readReplaceWriteAsync(
        path.resolve(__dirname, StorySrcPath), 
        path.resolve(process.cwd(), StoryTargetPath(name)), 
        ConstructMap(name, type, storybookType)
    );
    console.log(`Created Story for component ${StoryTargetPath(name)}`);

    // Test
    util.readReplaceWriteAsync(
        path.resolve(__dirname, TestSrcPath), 
        path.resolve(process.cwd(), TestTargetPath(name)), 
        ConstructMap(name, type, storybookType)
    );
    console.log(`Created Test for component ${TestTargetPath(name)}`);
}

yargs
    .command('$0 [name] [storybookCategory]', 'Scaffold a React component with styles, tests and a story.', () => {}, (argv) => {
        scaffold(argv.name, argv.type, argv.sb);
    })
    .option('name', {
        alias: 'n',
        type: 'string',
        description: 'The name of the component to scaffold',
        demandOption: true
    })
    .option('type', {
        alias: 't',
        type: 'string',
        description: 'Type of the React component',
        choices: ['functional', 'class'],
        default: 'functional'
    })
    .option('storybookCategory', {
        alias: 'sb',
        type: 'string',
        description: 'Category for the Story to use',
        default: 'Common'
    })
    .check((argv) => {
        //check first letter of name is a capital
        if(!(argv.name.charCodeAt(0) >= 65 && argv.name.charCodeAt(0) <= 90)) {
            throw new Error('Error: The component name should be capitalised.');
        }; 

        return true;
    })
    .example('$0', 'e.g. scaffold ActionPanel')
    .example('$0', 'e.g. scaffold ActionPanel --type class')
    .example('$0', 'e.g. scaffold ActionPanel --storybookCategory Common')
    .help()
    .argv;