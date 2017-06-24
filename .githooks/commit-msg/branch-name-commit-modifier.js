#!/usr/bin/env node
//https://github.com/austin-rausch/branch-name-commit-modifier/blob/master/index.js

'use strict';

require('require-self-ref')
const childProcess = require('child_process');
const fs = require('fs');

function main (options) {
    if (!options) {
        return;
    }
    const commitMessagePath = options.commitPath;

    const preChar = options.preChar || '[';
    const postChar = options.postChar || ']';
    const delimChar = options.delimiter || '-';

    const projectName = options.projectName || '[A-Z]+';

    let regExpString = `^\\${preChar}?`;
    regExpString += `(${projectName}${delimChar}`;
    regExpString += `[0-9]+\\${postChar}?)`;

    const detectRegExp = new RegExp(regExpString);

    let gitBranch = childProcess.execSync('git status --porcelain --long');
    gitBranch = gitBranch.toString().split('\n')[0].substring(10);
    let gitBranchPrefix = detectRegExp.exec(gitBranch);
    gitBranchPrefix = gitBranchPrefix ? gitBranchPrefix[0] : null;

    const commitMessage = fs.readFileSync(commitMessagePath, 'utf8');
    let commitBranch = detectRegExp.exec(commitMessage);
    commitBranch = commitBranch ? commitBranch[0] : null;

    let newCommitMessage;

    if (!commitBranch && !gitBranchPrefix) {
        console.log('Issue prefix not specified in commit and not on issue labeled branch, prepending NO-ISSUE...');
        newCommitMessage = `${preChar}NO-ISSUE${postChar} ${commitMessage}`;
    } else if (!commitBranch){
        console.log('Issue prefix not specified in commit, prepending branch issue prefix...');
        newCommitMessage = `${preChar}${gitBranchPrefix}${postChar} ${commitMessage}`;
    } else {
        console.log('Issue prefix present in commit message, ignoring...');
        newCommitMessage = commitMessage;
    }
    fs.writeFileSync(commitMessagePath, newCommitMessage, 'utf8');
}

function getConfig () {
    const config = require('~/package.json').config.branchNameCommitModifier;
    config.commitPath = process.argv[2];
    main(config);
}

getConfig();

