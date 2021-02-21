const robot = require("robotjs")
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const { join } = require('path')
const path = require('path')

const accountsPath = path.join(__dirname, 'bin/contas_test.txt')
const commandsPath = join(__dirname, 'bin/commands.json')

robot.setMouseDelay(1)
robot.setKeyboardDelay(1)

const unfollow = {}
unfollow.host = ''
unfollow.account = ''
unfollow.splittedData = []
unfollow.running = false

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

const getJson = (path) => {
    const data = fs.existsSync(path) ? fs.readFileSync(path) : []
    try {
        return JSON.parse(data)
    } catch (e) {
        return []
    }
}

const saveJson = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, '\t'))

async function getFilePaths() {
    let filePaths = fs.readFileSync(accountsPath, { encoding: 'utf-8' })
    return filePaths.split(`\r\n`)
}

async function initUnfollow() {
    const paths = await getFilePaths()

    await paths.reduce(async(promise, path) => {
        await promise;
        await toUnfollow(path);
    }, Promise.resolve());

}

async function toUnfollow(path) {
    unfollow.host = path.split('/')[2]
    unfollow.account = path.split('/')[3]

    console.log('')
    console.log('')
    console.log(`Unfollowing now: ${chalk.green( unfollow.account)}`)
    console.log('')

    /**
     * STEP ONE START *
     */
    console.log('move and click on navigator')
    robot.moveMouse(160, 1060)
    robot.mouseClick()

    await sleep(500)

    /**
     * STEP TWO START *
     */
    console.log('move and click to a new tab')
    robot.moveMouse(1240, 27)
    robot.mouseClick()

    await sleep(500)

    /**
     * STEP THREE START *
     */
    console.log('write url')
    unfollow.host.split('').forEach(hostElement => {
        robot.keyTap(hostElement)
    })
    robot.keyTap('/')
    unfollow.account.split('').forEach(accElement => {
        if (accElement == '_') {
            robot.keyTap(accElement, 'shift')
        } else {
            robot.keyTap(accElement)
        }
    })
    robot.keyTap('enter')

    await sleep(1000)

    /**
     * STEP FOUR START *
     */
    console.log('move and click on terminal')
    robot.moveMouse(1600, 600)
    robot.mouseClick()

    /**
     * STEP FIVE START *
     */
    console.log(`${chalk.green('1 - Unfollow')}`)
    console.log(`${chalk.green('2 - Still Following')}`)

    let answers
    answers = await inquirer.prompt([{
        type: 'input',
        name: 'unfollow',
        message: `Unfollow this user ${unfollow.account}? `,
        validate: value => value ? true : 'the field cannot be empty'
    }])

    const data = getJson(commandsPath)
    data.push({
        command: answers.unfollow,
        account: unfollow.account
    })

    saveJson(commandsPath, data)

    if (answers.unfollow == '1') {
        console.log('')
        console.log(`${chalk.red('Unfollowing...!')}`)
        console.log(`${chalk.red(unfollow.account)}`)
        console.log('')

        await sleep(500)

        console.log('move and click in button of friend')
        robot.moveMouse(820, 218)
        robot.mouseClick()

        await sleep(500)

        console.log('move and click in button for unfollow')
        robot.moveMouse(720, 650)
            //robot.mouseClick()

        await sleep(2000)

        console.log('close the tab')
        robot.keyTap('w', 'control')

        await sleep(500)

        console.log('move and click on terminal')
        robot.moveMouse(1600, 600)
        robot.mouseClick()

    } else {
        console.log('')
        console.log(`${chalk.green('You will continue to follow: ' + unfollow.account + '!')}`)
        console.log('')

        await sleep(2000)

        console.log('move and click on navigator')
        robot.moveMouse(160, 1060)
        robot.mouseClick()

        await sleep(500)

        console.log('close the tab')
        robot.keyTap('w', 'control')

        await sleep(500)

        console.log('move and click on terminal')
        robot.moveMouse(1600, 600)
        robot.mouseClick()
    }
}

initUnfollow()