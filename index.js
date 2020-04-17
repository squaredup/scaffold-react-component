#!/usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
const util = require('./util.js');
const log = require('./log.js');
const core = require('./core.js');

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
            return core.Scaffold(argv.name, argv.type, argv.sb).then(() => {
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