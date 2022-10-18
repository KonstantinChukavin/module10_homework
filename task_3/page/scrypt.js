const btnMessageSubm = document.querySelector('.submit-message')
const btnGeo_Pos = document.querySelector('.submit-geolocation')
const input = document.querySelector('#message')
const chatBlock = document.querySelector('.chat-place')
let arrayMessage = []

function Server(message) {
    this.name = 'server'
    this.message = message
}

function User(message) {
    this.name = 'user'
    this.message = message
}

function userBlockHtml(value) {
    chatBlock.innerHTML += `
	<div class='block__user-message'>
		<div class='user-message'>${value}</div>
	</div>
	`
}

function serverBlockHtml(value) {
    chatBlock.innerHTML += `
		<div class='block__server-message'>
			<div class='server-message'>${value}</div>
		</div>
    `
}

function SavedMessage() {
    resultSaved = JSON.parse(localStorage.getItem('chat'))
    console.log(JSON.parse(localStorage.getItem('chat')))
    resultSaved.forEach(function (item) {
        if (item.name == 'user') {
            userBlockHtml(item.message)
        } else if (item.name == 'server') {
            serverBlockHtml(item.message)
        }
    })
}


function SendMessage() {
    let socket = new WebSocket('wss://echo-ws-service.herokuapp.com')
    const inputValue = input.value
    if (inputValue !== "") { //проверка на ввод сообщения
        Message(inputValue)
    } else {
        alert('Напишите сообщение')
    }

    socket.onopen = function (event) {
        console.log('Подключен')
        socket.send(inputValue)
        console.log(event)
    }

    socket.onmessage = function (event) {
        serverBlockHtml(event.data)
        let newServerMess = new Server(event.data)
        arrayMessage.push(newServerMess)
        console.log(arrayMessage)
        console.log(event.data)
        localStorage.setItem('chat', JSON.stringify(arrayMessage))
    }

    socket.onclose = function (event) {
        alert('Отключен ' + event.code + event.reason)
    }
}


function Message(text) {
    userBlockHtml(text)
    let newUserMess = new User(text)
    arrayMessage.push(newUserMess)
    localStorage.setItem('chat', JSON.stringify(arrayMessage))
}


function Geo() {
    let socketGeo = new WebSocket('wss://echo-ws-service.herokuapp.com')
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const coords = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }
            console.log(coords)
            let jsonCoords = JSON.stringify(coords)

            socketGeo.onopen = function (event) {
                socketGeo.send(jsonCoords)
                console.log(jsonCoords)
            }

            socketGeo.onmessage = function (event) {
                let result = JSON.parse(event.data)
                chatBlock.innerHTML += `
				<div class='block__user-message'>
					<div class='user-message'>
						<a href='https://www.openstreetmap.org/#map=19/${result.lat}/${result.long}' target='_blank'>https://www.openstreetmap.org/#map=19/${result.lat}/${result.long}</a>
					</div>
				</div>
				`
                let newUserMess = new User(`https://www.openstreetmap.org/#map=19/${result.lat}/${result.long}`)
                arrayMessage.push(newUserMess)
                localStorage.setItem('chat', JSON.stringify(arrayMessage))
            }

            socketGeo.onclose = function (event) {
                alert('Отключен ' + event.code + event.reason)
            }
        })
    } else {
        alert('ERROR')
    }
}

document.addEventListener('DOMContentLoaded', SavedMessage)
btnMessageSubm.addEventListener('click', SendMessage)
btnGeo_Pos.addEventListener('click', Geo)