//const {count, getUsersByLimit}= require('./controller');
const fs = require('fs');
const Users = require('./model')
const path = require('path')
const zipFolder = require('zip-folder');
//const child_process = require("child_process");


function writeToCsvFile(users, outputStream) {
    users.forEach(user => {
        let csvFormat = user.lastName ? `${user.email}, ${user.firstName} ${user.lastName}\n`: `${user.email}, ${user.firstName}\n`;
        outputStream.write(csvFormat);
    })
}

async function generateCSVFiles(directory = '.') {
    let totalDBUsers = await Users.countDocuments({});
    console.log('this is the count', totalDBUsers)
    const maxLinesPerFile = 7;

    let batch = 1;
    let limit = process.env.MAX_USERS_LIMIT || 3;
    
    let totalWrittenLines = 0;
    let currentWrittenLinesPerFile = 0;
    let writeStream = fs.createWriteStream(path.join(__dirname,`/usersCSV/users-${Date.now()}.csv`), { encoding: 'utf-8' });
    
    let currentBatchOffset = 0;

    let users = []

    let monitor = 0;
        

    while (totalWrittenLines < totalDBUsers) {
        console.log(totalWrittenLines, "inbtw", totalDBUsers);
        if (currentBatchOffset === 0) {
            let skip = (batch - 1) * limit;
            users = await Users.find({}).limit(limit).skip(skip);
            batch += 1;
            console.log("batch ", batch);
        }
        else {
            users = users.slice(monitor)
            console.log("user ", users, monitor);
        }
        
        let writableUsers = users;
        if (currentWrittenLinesPerFile < maxLinesPerFile) {
            let remainingCSVFileLines = maxLinesPerFile - currentWrittenLinesPerFile;
            console.log("remCSVFL ", remainingCSVFileLines);
            monitor = remainingCSVFileLines;
            if (users.length > remainingCSVFileLines) {
                currentBatchOffset = users.length - remainingCSVFileLines;
                writableUsers = users.slice(0, remainingCSVFileLines)
                console.log("writUsr ", writableUsers);
            }
            
            writeToCsvFile(writableUsers, writeStream);
            console.log("currLPF ", currentWrittenLinesPerFile);
            if (currentWrittenLinesPerFile === 0) currentBatchOffset = 0;
            currentWrittenLinesPerFile += writableUsers.length;
            totalWrittenLines += writableUsers.length;
            console.log("totalWL ", totalWrittenLines);
        } else {
            currentWrittenLinesPerFile = 0;
            writeStream = fs.createWriteStream(path.join(__dirname,`/usersCSV/users-${Date.now()}.csv`), { encoding: 'utf-8' })
            console.log("enterrred ", totalWrittenLines);
            
        }
    }
    
}



function zipAFolder() {
 
zipFolder(path.join(__dirname, 'usersCSV'), path.join(__dirname, 'archive.zip'), function(err) {
    if(err) console.log('oh no!', err);
    else { console.log('EXCELLENT');}
});
    
}

//zipAFolder();

// function zip() {
//     console.log('zippp itttt')
//     child_process.execSync(`zip -r archive *`, {
//   cwd: path.join(__dirname, 'usersCV')
// });
// }

// zip();




module.exports = {
    generateCSVFiles
}