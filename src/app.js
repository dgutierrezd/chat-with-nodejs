require('./config/config')
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const dirPublic = path.join(__dirname, '../public')
const dirNode_modules = path.join(__dirname , '../node_modules')
app.use(express.static(dirPublic))

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));


const { Usuarios } = require('./Usuario');
const usuarios = new Usuarios()

io.on('connection', client => {
    console.log('Un usuario se ha conectado')

    // client.emit('mensaje', 'Bienvenido')

    // client.on('mensaje', informacion => {
    //     console.log(informacion)
    // })

    client.on('usuarioNuevo', user => {
        let listado = usuarios.agregarUsuario(client.id, user)
        let texto = `Se ha conectado ${user}`
        io.emit('nuevoUsuario', texto)
    })

    // client.on('disconnect', () => {
    //     let usuarioBorrado = usuarios.borrarUsuario(client.id)
    //     let texto = `Se ha desconectado ${usuarioBorrado.nombre}`
    //     io.emit('usuarioDesconectado', texto)
    // })

    client.on('texto', (text, callback) => {
        let usuario = usuarios.getUsuario(client.id)
        let texto = `<b>${usuario.nombre} :</b> ${text} `
        io.emit('texto', texto)
        callback()
    })
});

server.listen(process.env.PORT, err => {
    console.log('Servidor en el puerto ' + process.env.PORT)
})