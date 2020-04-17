const path = require('path');
const chalk = require('chalk');
const util = require('./util.js');
const log = require('./log.js');

const StubName = "__NAME__";
const StubNameLowerCamel = "__NAME_LOWER_CAMEL__";
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
        [StubNameLowerCamel]: util.toCamelCase(name),
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
    const componentPath = path.resolve(targetPath, component);
    const map = ConstructMap(name, storybookType);

    // React component
    switch(type){
        case 'functional':
            await util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentFunctionalSrcPath), 
                componentPath, 
                map
            );
            log.ok(`Created functional component ${chalk.green.underline.bold(component)}`);
            break;

        case 'class':
            await util.readReplaceWriteAsync(
                path.resolve(__dirname, ComponentClassSrcPath), 
                componentPath, 
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

    return componentPath;
}

 module.exports = { Scaffold };
    