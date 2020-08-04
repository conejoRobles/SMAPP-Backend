//Requires
const express = require('express')
const firebase = require('firebase')
const cors = require('cors')
const port = 2100
const app = express()
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function(req, res, next) {
    //Enabling Cords
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-cliente-token, x-client-secret, Authorization");
    next();
});

firebase.initializeApp({
    databaseURL: 'https://smapp-560ec.firebaseio.com/',
})

const db = firebase.database()

app.listen(port, () => {
    console.log('Express Server - puerto ' + port + ' online')
})

//RUTAS GENERALES
app.get('/', (req, res) => {
    getAll(res)
})

app.get('/paciente', (req, res) => {
    getPaciente(req, res)
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

app.post('/actualizarEmpleado', (req, res) => {
    actualizarEmpleado(req, res)
})

app.post('/eliminarEmpleado', (req, res) => {
    eliminarEmpleado(req, res)
})

//RUTAS HABITACIONES
app.get('/habitacion', (req, res) => {
    getHabitacionByID(req, res)
})

app.get('/habitaciones', (req, res) => {
    getHabitaciones(req, res)
})

app.post('/addHabitacion', (req, res) => {
    agregarHabitacion(req, res)
})

app.post('/eliminarHabitacion', (req, res) => {
    eliminarHabitacion(req, res)
})

//RUTAS HABITACIONES
app.get('/camilla', (req, res) => {
    getCamillaByID(req, res)
})

app.get('/camillas', (req, res) => {
    getCamillas(req, res)
})

app.post('/addCamilla', (req, res) => {
    agregarCamilla(req, res)
})

app.post('/actualizarCamilla', (req, res) => {
    actualizarCamilla(req, res)
})

app.post('/eliminarCamilla', (req, res) => {
    eliminarCamilla(req, res)
})

//FUNCIONES GENERALES

function getAll(res) {
    db.ref('/').on('value', (snapshot) => {
        res.status(200).json({
            ok: true,
            mensaje: 'bdd completa',
            'data': snapshot.val()
        })
    })
}

//FUNCIONES DE PISO

async function agregarPiso(req, res) {
    try {
        db.ref('Pisos/' + req.body.id).set({
            nombre: req.body.nombre,
            id: req.body.id
        })
        res.status(200).json({
            ok: true,
            mensaje: 'Se ha agregado el piso con éxito'
        })
    } catch {
        res.status(409).json({
            ok: false,
            mensaje: 'No se ha podido agregar el piso'
        })
    }
}

async function eliminarPiso(req, res) {
    try {
        await db.ref('Pisos/' + req.body.id).remove()
        res.status(200).json({
            mensaje: 'Piso eliminado con exito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'No se ha podido eliminar el piso'
        })
    }
}

function getPisoByID(req, res) {
    try {
        db.ref('Pisos/' + req.query.id).on('value', function(snapshot) {
            snapshot.val() !== null ? (
                res.status(200).json({
                    data: snapshot.val()
                })
            ) : (
                res.status(404).json({
                    mensaje: 'no existe el piso'
                })
            )
        })
    } catch {
        res.status(409).json({
            mensaje: 'no se ha podido realizar la petición'
        })
    }
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
                Pisos: snapshot.val().Pisos
            })
        )
    })
}

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
                Empleados: snapshot.val().Empleados
            })
        )
    })
}

function getEmpleadoByID(req, res) {
    db.ref('Empleados/' + req.query.rut).on('value', function(snapshot) {
        (snapshot.val()[req.query.rut] !== null ? (
            res.status(200).json({
                ok: true,
                mensaje: 'Empleado encontrado',
                data: snapshot.val()
            })
        ) : (
            res.status(404).json({
                mensaje: 'Empleado no encontrado',
            })
        ))
    })
}

async function agregarEmpleado(req, res) {
    try {
        await db.ref('Empleados/' + req.body.rut).set({
            dv: req.body.dv,
            rut: req.body.rut,
            nombre: req.body.nombre,
            pass: req.body.pass,
            rol: req.body.rol
        })
        res.status(200).json({
            ok: true,
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
            mensaje: 'se ha eliminado el Empleado con exito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'no se ha podido eliminar el Empleado'
        })
    }
}

async function actualizarEmpleado(req, res) {
    try {
        await db.ref('Empleados/' + req.body.rut).update({
            nombre: req.body.nombre,
            pass: req.body.pass,
            rol: req.body.rol
        })
        res.status(200).json({
            mensaje: 'actualización realizada con exito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'no se ha logrado realizar la actualización'
        })
    }
}
//FUNCIONES HABITACION

async function agregarHabitacion(req, res) {
    try {
        await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.id).set({
            id: req.body.id
        })

        res.status(200).json({
            mensaje: 'Se ha agregado la Habitacion con éxito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'No se ha podido agregar la Habitacion'
        })
    }
}

function getHabitaciones(req, res) {
    db.ref('/Pisos/' + req.query.piso + '/Habitaciones/').on('value', function(snapshot) {
        snapshot.val() === null ? (
            res.status(404).json({
                mensaje: 'No se encontraron elementos',
            })
        ) : (
            res.status(200).json({
                ok: true,
                mensaje: 'Habitaciones de piso: ' + req.query.piso,
                Habitaciones: snapshot.val()
            })
        )
    })
}

async function eliminarHabitacion(req, res) {
    try {
        await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.id).remove()
        res.status(200).json({
            mensaje: 'Habitacion eliminada con exito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'No se ha podido eliminar la Habitacion'
        })
    }
}

function getHabitacionByID(req, res) {
    try {
        db.ref('Pisos/' + req.query.piso + '/Habitaciones/' + req.query.id).on('value', function(snapshot) {
            snapshot.val() !== null ? (
                res.status(200).json({
                    data: snapshot.val()
                })
            ) : (
                res.status(404).json({
                    mensaje: 'habitacion no encontrada'
                })
            )
        })
    } catch {
        res.status(409).json({
            mensaje: 'no se ha podido realizar la petición'
        })
    }
}

//FUNCIONES CAMILLAS

async function agregarCamilla(req, res) {
    try {
        db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).set({
            estado: 'disponible',
            id: req.body.id,
            nombrePaciente: '',
            rutPaciente: ''
        })
        res.status(200).json({
            mensaje: 'Se ha agregado la Camilla con éxito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'No se ha podido agregar la Camilla'
        })
    }
}

async function eliminarCamilla(req, res) {
    try {
        await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).remove()
        res.status(200).json({
            mensaje: 'Camilla eliminado con exito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'No se ha podido eliminar el Camilla'
        })
    }
}

function getCamillaByID(req, res) {
    try {
        db.ref('Pisos/' + req.query.piso + '/Habitaciones/' + req.query.habitacion + '/Camillas/' + req.query.id).on('value', function(snapshot) {
            snapshot.val() !== null ? (
                res.status(200).json({
                    data: snapshot.val()
                })
            ) : (
                res.status(404).json({
                    mensaje: 'no existe la camilla'
                })

            )
        })
    } catch {
        res.status(409).json({
            mensaje: 'no se ha podido realizar la petición'
        })
    }
}

function getCamillas(req, res) {
    db.ref('/Pisos/' + req.query.piso + '/Habitaciones/' + req.query.habitacion + '/Camillas/').on('value', function(snapshot) {
        snapshot.val() === null ? (
            res.status(404).json({
                mensaje: 'No se encontraron elementos',
            })
        ) : (
            res.status(200).json({
                ok: true,
                mensaje: 'Habitaciones de la Habitacion: ' + req.query.habitacion,
                Camillas: snapshot.val()
            })
        )
    })
}

async function actualizarCamilla(req, res) {
    try {
        await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).update({
            estado: req.body.estado,
            nombrePaciente: req.body.nombrePaciente,
            rutPaciente: req.body.rutPaciente
        })
        await actualizarHistorial(req, res)
        res.status(200).json({
            mensaje: 'Actualización realizada'
        })
    } catch {
        res.status(409).json({
            mensaje: 'no se ha logrado la actualización'
        })
    }
}

async function actualizarHistorial(req, res) {
    try {
        await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id + '/Historial/' + req.body.historyID).set({
            nombrePaciente: req.body.nombrePaciente,
            rutPaciente: req.body.rutPaciente,
            idCamilla: req.body.id,
            id: req.body.historyID,
            fechaInicio: req.body.dateIn,
            fechaTermino: req.body.dateOut
        })
        res.status(200).json({
            mensaje: 'Actualización realizada con exito'
        })
    } catch {
        res.status(409).json({
            mensaje: 'Actualización fallida'
        })
    }

}