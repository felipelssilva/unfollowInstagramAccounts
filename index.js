const robot = require("robotjs");
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const { join } = require('path');
const path = require('path');
const { config } = require("process");
const accountsPath = path.join(__dirname, 'bin/accounts-2.txt');

const configs = {
    browser: {
        x: 160,
        y: 1060
    },
    terminal: {
        x: 1600,
        y: 600
    },
    friend: {
        x: 250,
        y: 250
    },
    unfollow: {
        btn: {
            x: 0,
            y: 0
        },
        count: {
            paths: 0,
            unfollow: {
                count: 0,
                accounts: []
            },
            stillFollow: {
                count: 0,
                accounts: []
            },
            doNothing: {
                count: 0,
                accounts: []
            }
        }
    }
};

robot.setMouseDelay(0);
robot.setKeyboardDelay(0);

var unfollow = {};
unfollow.host = '';
unfollow.account = '';

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function getFilePaths() {
    let filePaths = fs.readFileSync(accountsPath, { encoding: 'utf-8' });

    return filePaths.length > 0 ? filePaths.split(`\r\n`) : '';
}

async function main() {
    const paths = await getFilePaths();
    var start = new Date(),
        hrstart = process.hrtime();

    configs.unfollow.count.paths = paths.length;

    if (configs.unfollow.count.paths > 0) {

        await paths.reduce(async(promise, path) => {
            await promise;
            path.length > 0 ? await toUnfollow(path) : Promise.resolve();
        }, Promise.resolve());

        showResults();

    } else {

        console.log('');
        console.log('----------------------------');
        console.log('');

        console.log('No results were found');
    }

    setTimeout(function() {
        var end = new Date() - start,
            hrend = process.hrtime(hrstart);

        console.log('');
        console.log('----------------------------');
        console.log('');
        console.log("Execution time: %ds %dms", hrend[0], hrend[1] / 1000000);
        console.log('');
        console.log('----------------------------');
        console.log('');
    }, 1);

}

async function toUnfollow(path) {
    configs.unfollow.count.paths = configs.unfollow.count.paths - 1;

    unfollow.host = path.split('/')[2];
    unfollow.account = path.split('/')[3];

    console.log('');
    console.log('----------------------------');
    console.log('');
    console.log(`--- Starting the steps for ${chalk.green(unfollow.account)} account ---`);
    console.log('');
    console.log('----------------------------');
    console.log('');

    moveMouseAndClick('browser');
    addNewTab();
    writeUrlAndEnter();
    await sleep(500);
    moveMouseAndClick('terminal');

    console.log(`${chalk.green('1 - Unfollow')}`);
    console.log(`${chalk.green('2 - Still Following')}`);
    console.log(`${chalk.green('3 - Do nothing')}`);

    let answers;
    answers = await inquirer.prompt([{
        type: 'input',
        name: 'unfollow',
        message: `Unfollow this user ${unfollow.account}? `,
        validate: value => value ? true : 'the field cannot be empty'
    }]);

    if (answers.unfollow == '1') {
        configs.unfollow.count.unfollow.count++;
        configs.unfollow.count.unfollow.accounts.push(path);

        console.log('');
        console.log(chalk.red(`Unfollowing ${unfollow.account} ...!`));
        console.log('');

        moveMouseAndClick('friend');
        await sleep(500);
        moveMouseAndClick('unfollow');
        await sleep(1000);
        closeTab();
        moveMouseAndClick('terminal');

    } else if (answers.unfollow == '3') {
        configs.unfollow.count.doNothing.count++;
        configs.unfollow.count.doNothing.accounts.push(path);

        console.log('');
        console.log(chalk.green('Do nothing to: ' + unfollow.account));
        console.log('');

        moveMouseAndClick('browser');
        closeTab();
        moveMouseAndClick('terminal');

    } else {
        configs.unfollow.count.stillFollow.count++;
        configs.unfollow.count.stillFollow.accounts.push(path);

        console.log('');
        console.log(chalk.green('You will continue to follow: ' + unfollow.account + '!'));
        console.log('');

        moveMouseAndClick('browser');
        closeTab();
        moveMouseAndClick('terminal');
    }
}

function addNewTab() {
    console.log('Add new tab');
    robot.keyTap('t', 'control');
}

function writeUrlAndEnter() {
    console.log('Write url');
    unfollow.host.split('').forEach(hostElement => {
        robot.keyTap(hostElement);
    })
    robot.keyTap('/');
    unfollow.account.split('').forEach(accElement => {
        if (accElement == '_') {
            robot.keyTap(accElement, 'shift');
        } else {
            robot.keyTap(accElement);
        }
    })
    robot.keyTap('enter');
}

function moveMouseAndClick(options) {
    console.log(`Move and click on ${options}`);

    switch (options) {
        case 'browser':
            robot.moveMouse(configs.browser.x, configs.browser.y);
            break;
        case 'terminal':
            robot.moveMouse(configs.terminal.x, configs.terminal.y);
            break;
        case 'unfollow':
            configs.unfollow.btn = findBtn();
            robot.moveMouse(configs.unfollow.btn.x, configs.unfollow.btn.y);
            break;
        case 'friend':
            robot.moveMouse(configs.friend.x, configs.friend.y);
            break;
        default:
            break;
    }

    robot.mouseClick();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findBtn() {
    console.log(`Find the button...`);

    var img = robot.screen.capture(0, 110, 660, 970),
        color = ["ef5e6a", "ee5460", "f1737d", "ed4956", "f6a5ac", "f04860", "f09090", "f0a8a8", "f0d8d8", "f07878", "f0c0c0", "f06060", "f06078", "f090a8"],
        x = 1,
        y = 110,
        width = 660,
        height = 970;

    for (var i = 0; i < width * height; i++) {
        var random_x = getRandomInt(0, width - 1);
        var random_y = getRandomInt(0, height - 1);
        var sample_color = img.colorAt(random_x, random_y);

        if (color.includes(sample_color)) {
            var screen_x = random_x + x;
            var screen_y = random_y + y;
            console.log("Found a button at: " + screen_x + ", " + screen_y + " color " + sample_color);
            return { x: screen_x, y: screen_y };
        }
    }

    return false;
}

function closeTab() {
    console.log('Close the tab');
    robot.keyTap('w', 'control');
}

function showResults() {

    console.log('');
    console.log('----------------------------');

    if (configs.unfollow.count.stillFollow.accounts.length > 0) {
        console.log('');
        console.log('Still Follow:');
        configs.unfollow.count.stillFollow.accounts.forEach((stillFollow, i) => {
            var accFollowing = stillFollow.split('/')[3];
            console.log(chalk.green(' - ' + accFollowing));
        });

    }

    if (configs.unfollow.count.doNothing.accounts.length > 0) {
        console.log('');
        console.log(`Do nothing:`);
        configs.unfollow.count.doNothing.accounts.forEach((doNothing, i) => {
            var accDoNothing = doNothing.split('/')[3];
            console.log(chalk.grey(' - ' + accDoNothing));
        });
    }

    if (configs.unfollow.count.unfollow.accounts.length > 0) {
        console.log('');
        console.log('Unfollows:');
        configs.unfollow.count.unfollow.accounts.forEach((unfollow, i) => {
            var accUnfollow = unfollow.split('/')[3];
            console.log(chalk.red(' - ' + accUnfollow));
        });
    }
}

main();