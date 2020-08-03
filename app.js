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

//RUTAS GENERALES
app.get('/', (req, res) => {
    getAll(res)
})

//RUTAS PISOS
app.get('/pisos', (req, res) => {
    getPisos(res)
})

app.get('/piso', (req, res) => {
    getPisoByID(req, res)
})

app.post('/addPiso', (req, res) => {
    agregarPiso(req, res)
})

app.post('/eliminarPiso', (req, res) => {
    eliminarPiso(req, res)
})

//FUNCIONES GENERALES

function getAll(res) {
    db.ref('/').on('value', (snapshot) => {
        res.status(200).json({
            ok: true,
            mensaje: 'bdd completa',
            "data": snapshot.val()
        })
    })
}

//FUNCIONES DE PISO

async function agregarPiso(req, res) {
    try {
        db.ref('Pisos/' + req.body.id).set({
            nombre: req.body.nombre
        })
        res.status(200).json({
            mensaje: 'Se ha agregado el piso con éxito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'No se ha podido agregar el piso'
        })
    }
}

function eliminarPiso(req, res) {
    db.ref('Pisos/' + req.body.id).remove()
}

function getPisoByID(req, res) {
    db.ref('Pisos/' + req.query.id).on('value', function(snapshot) {
        res.status(200).json({
            id: req.query.id,
            data: snapshot.val()
        })
    })
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
                "Pisos": snapshot.val().Pisos
            })
        )
    })
}

//RUTAS EMPLEADOS

app.get('/empleados', (req, res) => {
    getEmpleados(res)
})

app.get('/empleado', (req, res) => {
    getEmpleadoByID(req, res)
})

app.post('/addEmpleado', (req, res) => {
    agregarEmpleado(req, res)
})

app.post('/eliminarEmpleado', (req, res) => {
    eliminarEmpleado(req, res)
})

//FUNCIONES EMPLEADOS

function getEmpleados(res) {
    db.ref('/').on('value', function(snapshot) {
        snapshot.val() === null ? (
            res.status(404).json({
                mensaje: 'No se encontraron empleados',
            })
        ) : (
            res.status(200).json({
                ok: true,
                mensaje: 'Lista de empleados',
                "Empleados": snapshot.val().Empleados
            })
        )
    })
}

function getEmpleadoByID(req, res) {
    db.ref('Empleados/' + req.query.rut).on('value', function(snapshot) {
        (snapshot.val()[req.query.rut] !== null ? (
            res.status(200).json({
                mensaje: "Empleado encontrado",
                rut: req.query.rut,
                data: snapshot.val()
            })
        ) : (
            res.status(404).json({
                mensaje: "Empleado no encontrado",
            })
        ))
    })
}

async function agregarEmpleado(req, res) {
    try {
        await db.ref('Empleados/' + req.body.rut).set({
            dv: req.body.dv,
            nombre: req.body.nombre,
            pass: req.body.pass,
            rol: req.body.rol
        })
        res.status(200).json({
            mensaje: 'Se ha agregado el Empleado con éxito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'No se ha podido agregar el Empleado'
        })
    }
}

async function eliminarEmpleado(req, res) {
    try {
        await db.ref('Empleados/' + req.body.rut).remove()
        res.status(200).json({
            mensaje: "se ha eliminado el Empleado con exito"
        })
    } catch {
        res.status(409).json({
            mensaje: "no se ha podido eliminar el Empleado"
        })
    }
}