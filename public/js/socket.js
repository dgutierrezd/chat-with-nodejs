socket = io()

// socket.on('mensaje', informacion => {
//     console.log(informacion)
// })

// socket.emit('mensaje', 'Estoy conectado')

var param = new URLSearchParams(window.location.search);

var user = param.get('nombre')


const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
const chat = document.querySelector('#chat')

socket.on('connect', () => {
    console.log(user)
    socket.emit('usuarioNuevo', user)
})

socket.on('nuevoUsuario', texto => {
    console.log(texto)
    chat.innerHTML = chat.innerHTML + '<p class="text-primary">' + texto + '</p>'
})

socket.on('usuarioDesconectado', texto => {
    chat.innerHTML = chat.innerHTML + '<p class="text-danger">' + texto + '</p>'
})

formulario.addEventListener('submit', (datos) => {

    datos.preventDefault()

    socket.emit('texto', mensaje.value, () => {
            mensaje.value = ''
            mensaje.focus()
    })
})

socket.on('texto', text => {
    console.log(text)
    chat.innerHTML = chat.innerHTML + text + '<br>'
})