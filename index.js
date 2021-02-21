const robot = require("robotjs")
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const { join } = require('path')
const path = require('path')
const accountsPath = path.join(__dirname, 'bin/contas_test.txt')

robot.setMouseDelay(1)
robot.setKeyboardDelay(1)

const unfollow = {}
unfollow.host = ''
unfollow.account = ''

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function getFilePaths() {
    let filePaths = fs.readFileSync(accountsPath, { encoding: 'utf-8' })
    return filePaths.split(`\r\n`)
}

async function main() {
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
    console.log(chalk.green('----------------------------'))
    console.log('')
    console.log(`--- Begind the steps for ${chalk.green(unfollow.account)} account ---`)
    console.log('')

    /**
     * STEP ONE START *
     * find the browser and click to open
     */
    console.log('Move and click on navigator')
    robot.moveMouse(160, 1060)
    robot.mouseClick()

    await sleep(500)

    /**
     * STEP TWO START *
     * click on add a new tab
     */
    console.log('Move and click to a new tab')
    robot.moveMouse(1240, 27)
    robot.mouseClick()

    await sleep(500)

    /**
     * STEP THREE START *
     * write in browser a Instagram URL plus account ID and press enter
     * to access the website
     */
    console.log('Write url')
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
    console.log('Move and click on terminal')
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

    if (answers.unfollow == '1') {
        console.log('')
        console.log(`${chalk.red('Unfollowing...!')}`)
        console.log(`${chalk.red(unfollow.account)}`)
        console.log('')

        await sleep(500)

        //mudar o mudar do botao, as vezes tem o botao de messagem e ele atrapalha
        console.log('Move and click in button of friend')
        robot.moveMouse(820, 218)
        robot.mouseClick()

        await sleep(500)

        console.log('Move and click in button for unfollow')
        robot.moveMouse(720, 650)
            //robot.mouseClick()

        await sleep(2000)

        console.log('Close the tab')
        robot.keyTap('w', 'control')

        await sleep(500)

        console.log('Move and click on terminal')
        robot.moveMouse(1600, 600)
        robot.mouseClick()

    } else {
        console.log('')
        console.log(`${chalk.green('You will continue to follow: ' + unfollow.account + '!')}`)
        console.log('')

        await sleep(2000)

        console.log('Move and click on navigator')
        robot.moveMouse(160, 1060)
        robot.mouseClick()

        await sleep(500)

        console.log('Close the tab')
        robot.keyTap('w', 'control')

        await sleep(500)

        console.log('Move and click on terminal')
        robot.moveMouse(1600, 600)
        robot.mouseClick()
    }
}

/*function testScreenCapture() {

    var img = robot.screen.capture(0, 0, 1920, 1080);

    var pixel = img.colorAt(631, 222)

    console.log(pixel)

}*/

//testScreenCapture()

main()