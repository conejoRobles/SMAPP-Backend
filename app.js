//Requires
const express = require('express')
const firebase = require("firebase")
const port = 2100
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

firebase.initializeApp({
    databaseURL: "https://smapp-560ec.firebaseio.com/",
})

const db = firebase.database()

app.listen(port, () => {
    console.log('Express Server - puerto ' + port + ' online')
})

//RUTAS
app.get('/', (req, res) => {
    getAll(res)
})


app.get('/Pisos', (req, res) => {
    getPisos(res)
})


app.post('/addPiso', (req, res) => {
    agregarPiso(req, res)
})

//FUNCIONES

function getAll(res) {
    db.ref('/').on('value', (snapshot) => {
        res.status(200).json({
            ok: true,
            mensaje: 'bdd completa',
            "data": snapshot.val()
        })
    })
}

function agregarPiso(req, res) {
    let data = getAll(res).data.cantiadPisos
    db.ref('Pisos/' + (data + 1)).set({
        nombre: req.body.nombre
    })
    res.status(201).json({ mensaje: "insertado" })
}

function getPisos(res) {
    db.ref('/').on('value', function(snapshot) {
        snapshot.val() === null ? (
            res.status(404).json({
                mensaje: 'No se encontraron elementos',
            })
        ) : (
            res.status(200).json({
                ok: true,
                mensaje: 'bdd completa',
                "Pisos": snapshot.val()['Pisos']
            })
        )
    })

}