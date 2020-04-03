const chalk = require('chalk');
const symbols = require('log-symbols');

module.exports = {
    ok: (text) => console.log(`${symbols.success} ${chalk.green(text)}`),
    err: (text) => console.log(`${symbols.error} ${chalk.red(text)}`),
    info: (text) => console.log(`${chalk.blue(text)}`)
}