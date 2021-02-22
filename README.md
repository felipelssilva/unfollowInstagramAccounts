# Unfollow Instagram Accounts
Node application to unfollow few accounts on Instagram

---

# Important: 

You need to be previously logged into your instagram account.

This code will not access any of your information, I am not saving any information from your account, I am not sending your data anywhere.
In case your account data is lost, I guarantee that it will not be by this code.

Before running the entire process and making it work, review the code and understand it to answer your possible questions.

---

### Story



---

### How to use

`You will need Node version v15.0.0, NPM version 7.0.2.`

I recommend using the windows OS. I had many problems in using the extensions needed to be run on linux.

`Okay, detail that I used an extension on windows that simulates the CLI of an Ubuntu, probably this hindered me a little in the use of the components.`

But I still recommend using Window, other OSes I didn't have the opportunity to test.

Ideal resolution for executing the 1920x1080 code

http://robotjs.io/docs/building


Split the screen between the browser and the console, browser on the left and the console to the right.

---

### How I get my data (followers)

- Open a CMD as an administrator 
- Open your profile, aka: https://www.instagram.com/<YOUR_USER_NAME>/.
- Open the console (F12)

Run all following commands:

`This code open the modal of yours followers.`

    document.querySelectorAll('a.-nal3')[1].click()


Set the following variable in the browser console:

    var scrollingInterval = setInterval(function(){ scrolando() }, 100);



document.querySelectorAll(`.isgrP`)[0].scroll(0, document.querySelectorAll(`.isgrP`)[0].scrollHeight)


clearInterval(scrollingInterval)


procurado por contas com o verificado
document.querySelectorAll(`.isgrP`)[0].querySelectorAll('li span[title="Verified"]')

teste removendo contas verificadas
document.querySelectorAll(`.isgrP`)[0].querySelectorAll('li span[title="Verified"]')[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove()

removendo contas verificadas
document.querySelectorAll(`.isgrP`)[0].querySelectorAll('li span[title="Verified"]').forEach(function(e,i){  e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove() })


class .enpQJ
-> user id
-> name

printa o username e nome da conta
document.querySelectorAll(`.isgrP`)[0].querySelectorAll('li').forEach(function(e,i){ console.log(e.querySelectorAll('.enpQJ')[0].innerText) })

https://www.instagram.com/

document.querySelectorAll(`.isgrP`)[0].querySelectorAll('li').forEach(function(e,i){ console.log('https://www.instagram.com/'+e.querySelectorAll('.enpQJ a')[0].innerText) })
