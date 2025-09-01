const fs = require('fs');
const readline = require('readline');
const EXTRA_HEADER_LINE = 12
const TOKEN_START_INDEX = 35
const SAVED_TOKEN_FILE = "token.txt"

async function readSpecificLine(filePath, lineNumber) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity // Handle all common newline characters
    });

    let currentLine = 0;
    for await (const line of rl) {
        currentLine++;
        if (currentLine === lineNumber) {
            rl.close(); // Close the interface once the line is found
            return line;
        }
    }

    rl.close(); // Close the interface if the line number is not found
    return null; // Return null if the line does not exist
}

readSpecificLine('.git/config', EXTRA_HEADER_LINE)
    .then(lineContent => {
        let token = lineContent.substring(TOKEN_START_INDEX)
        fs.writeFile(SAVED_TOKEN_FILE, token, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('File saved successfully!');
            }
        });
    })
