const fs = require('fs');

const readReplaceWriteAsync = (templateFile, newFile, replacements) => {    
    if (!fs.existsSync(newFile)) {
        fs.readFile(templateFile, 'utf8', (err, data) => {

            if (err) {
                console.log('Could not read file:', err);
                return false;
            }
            const replace = Object.keys(replacements).join('|');

            const result = data.replace(new RegExp(replace, 'g'), function(matched){
                return replacements[matched];
              });

            fs.writeFile(newFile, result, 'utf8', (err) => {
                if (err) {
                    console.log('Could not write file:', err);
                    return false;
                }
            });
        });
    }
    else {
        console.log('File creation aborted', newFile, 'already exists.');
    }    
}

module.exports = { readReplaceWriteAsync };