//Requires
const express = require('express')
const firebase = require('firebase')
const cors = require('cors')
const port = 2100
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

firebase.initializeApp({
    databaseURL: 'https://smapp-560ec.firebaseio.com/',
})

const db = firebase.database()

app.listen(port, () => {
    console.log('Express Server - puerto ' + port + ' online')
})

app.use(function(req, res, next) {
    //Enabling Cords
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-cliente-token, x-client-secret, Authorization");
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: true }));
app.post('/login', async(req, res) => {
    let body = req.body
    db.ref('Empleados/' + body.rut).once('value', function(snapshot) {
        if (snapshot.val() !== null) {
            let emp = snapshot.val()
            if (!bcrypt.compareSync(body.pass, snapshot.val().pass)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas (contraseña)'
                })
            } else {
                let SEED = 'esto-es-semilla'
                let token = jwt.sign({ usuario: emp.pass }, SEED, { expiresIn: 2880 })
                return res.status(200).json({
                    ok: true,
                    usuario: snapshot.val(),
                    id: snapshot.val().rut,
                    token
                })
            }
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe'
            })
        }
    })
})
app.post('/contactarAdmin', (req, res) => {
        contacto(req, res)
    })
    //funcion para mandar correo
function contacto(req, res) {
    const nombre = req.body.nombre
    const rut = req.body.rut
    const email = req.body.email
    const asunto = req.body.asunto
    const descripcion = req.body.descripcion

    const emisorPlataforma = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gestionsmapp@gmail.com',
            pass: 'smapp2020'
        }
    })
    let payload = {
        from: nombre,
        to: 'gestionsmapp@gmail.com',
        subject: asunto,
        text: `Se ha presentado un problema y ${nombre} con rut ${rut} y correo ${email}, quiere contactarse contigo, la razon es: ${asunto}.\n Ademas agregó esto:\n ${descripcion}`
    }
    emisorPlataforma.sendMail(payload, (error) => {
        if (error) {
            console.log('Error Email: ' + error)
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            })
        } else {
            console.log('Email enviado')
            return res.status(200).json({
                ok: true,
                mensaje: 'Email enviado',
                payload: descripcion
            })
        }
    })
}

// app.use('/', (req, res, next) => {
//     let token = req.query.token || req.body.token
//     let SEED = 'esto-es-semilla'
//     jwt.verify(token, SEED, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'token incorrecto',
//                 errors: err
//             })
//         }
//         req.usuario = decoded.usuario
//         next()
//     })
// })

app.use(morgan('dev'))

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


//RUTAS CAMILLAS
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
    db.ref('/').once('value', (snapshot) => {
        return res.status(200).json({
            ok: true,
            mensaje: 'bdd completa',
            'data': snapshot.val()
        })
    })
}

//FUNCIONES DE PISO

async function agregarPiso(req, res) {
    await db.ref('Pisos/' + req.body.id).set({
        Habitaciones: {
            '0': {
                id: 0,
                Camillas: {
                    0: {
                        id: 0,
                        Historial: [{
                            0: {
                                id: 0
                            }
                        }]
                    }
                }
            }
        },
        nombre: req.body.nombre,
        id: req.body.id
    })

    return res.status(200).json({
        ok: true,
        mensaje: 'Se ha agregado el piso con éxito'
    })
}

async function eliminarPiso(req, res) {
    db.ref('Pisos/' + req.body.id).once('value', async(snap) => {
        if (snap.val() != null && snap.val() != undefined) {
            await db.ref('Pisos/' + req.body.id).remove().then(() => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Piso eliminado con exito'
                })
            })
        } else {
            return res.status(500).json({
                ok: false,
                mensaje: 'El piso no existe'
            })
        }
    })
}

function getPisoByID(req, res) {
    db.ref('Pisos/' + req.query.id).once('value', function(snapshot) {
        return snapshot.val() !== null ? (
            res.status(200).json({
                data: snapshot.val()
            })
        ) : (
            res.status(404).json({
                mensaje: 'no existe el piso'
            })
        )
    })

}

function getPisos(res) {
    db.ref('/').once('value', function(snapshot) {
        return snapshot.val() === null ? (
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

async function getEmpleados(res) {
    db.ref('/').once('value', function(snapshot) {
        return snapshot.val() === null ? (
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

async function getEmpleadoByID(req, res) {
    db.ref('Empleados/' + req.query.rut).once('value', function(snapshot) {
        return (snapshot.val()[req.query.rut] !== null ? (
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
    await db.ref('Empleados/' + req.body.rut).set({
        dv: req.body.dv,
        rut: req.body.rut,
        nombre: req.body.nombre,
        pass: bcrypt.hashSync(req.body.pass, 10), //traspaso de pass a codigo hash
        rol: req.body.rol
    })

    return res.status(200).json({
        ok: true,
        mensaje: 'Se ha agregado el Empleado con éxito'
    })
}

async function eliminarEmpleado(req, res) {
    db.ref('Empleados/' + req.body.rut).once('value', async(snap) => {
        if (snap.val() != null && snap.val() != undefined) {
            await db.ref('Empleados/' + req.body.rut).remove()
            return res.status(200).json({
                ok: true,
                mensaje: 'se ha eliminado el Empleado con exito'
            })
        } else {
            return res.status(500).json({
                ok: false,
                mensaje: 'El Empleado no existe'
            })
        }
    })

}

async function actualizarEmpleado(req, res) {
    await db.ref('Empleados/' + req.body.rut).update({
        nombre: req.body.nombre,
        pass: bcrypt.hashSync(req.body.pass, 10),
        rol: req.body.rol
    })

    return res.status(200).json({
        mensaje: 'actualización realizada con exito'
    })
}
//FUNCIONES HABITACION

async function agregarHabitacion(req, res) {
    await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.id).set({
        id: req.body.id,
        Camillas: {
            0: {
                id: 0,
                Historial: [{
                    0: {
                        id: 0
                    }
                }]
            }
        }
    })

    return res.status(200).json({
        mensaje: 'Se ha agregado la Habitacion con éxito'
    })
}

function getHabitaciones(req, res) {
    db.ref('/Pisos/' + req.query.piso + '/Habitaciones/').once('value', function(snapshot) {
        return snapshot.val() === null ? (
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
    db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.id).once('value', async(snap) => {
        if (snap.val() != null && snap.val() != undefined) {
            await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.id).remove()
            return res.status(200).json({
                ok: true,
                mensaje: 'Habitacion eliminada con exito'
            })
        } else {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe la Habitacion'
            })
        }
    })
}

function getHabitacionByID(req, res) {
    db.ref('Pisos/' + req.query.piso + '/Habitaciones/' + req.query.id).once('value', function(snapshot) {
        return snapshot.val() !== null ? (
            res.status(200).json({
                data: snapshot.val()
            })
        ) : (
            res.status(404).json({
                mensaje: 'habitacion no encontrada'
            })
        )
    })
    return res.status(409).json({
        mensaje: 'no se ha podido realizar la petición'
    })
}

//FUNCIONES CAMILLAS

async function agregarCamilla(req, res) {
    await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).set({
        estado: 'disponible',
        id: req.body.id,
        nombrePaciente: '',
        apellidoPaciente: '',
        rutPaciente: '',
        Historial: [{
            0: {
                id: 0
            }
        }]
    })

    return res.status(200).json({
        mensaje: 'Se ha agregado la Camilla con éxito'
    })
}

async function eliminarCamilla(req, res) {
    db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).once('value', async(snap) => {
        if (snap.val() != null && snap.val() != undefined) {
            await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).remove()
            return res.status(200).json({
                ok: true,
                mensaje: 'Camilla eliminado con exito'
            })
        } else {
            return res.status(500).json({
                ok: false,
                mensaje: 'La Camilla no existe'
            })
        }
    })
}

function getCamillaByID(req, res) {
    db.ref('Pisos/' + req.query.piso + '/Habitaciones/' + req.query.habitacion + '/Camillas/' + req.query.id).once('value', function(snapshot) {
        return snapshot.val() !== null ? (
            res.status(200).json({
                data: snapshot.val()
            })
        ) : (
            res.status(404).json({
                mensaje: 'no existe la camilla'
            })

        )
    })

}

function getCamillas(req, res) {
    db.ref('/Pisos/' + req.query.piso + '/Habitaciones/' + req.query.habitacion + '/Camillas/').once('value', function(snapshot) {
        return snapshot.val() === null ? (
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
    db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).once('value', async(snap) => {
        if (snap.val() != null && snap.val() != undefined) {
            await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id).update({
                estado: req.body.estado,
                nombrePaciente: req.body.nombrePaciente,
                apellidoPaciente: req.body.apellidoPaciente,
                rutPaciente: req.body.rutPaciente
            })
            if (req.body.estado != 'disponible') {
                await actualizarHistorial(req, res)
            } else {
                return res.status(200).json({
                    mensaje: 'Actualización realizada'
                })
            }
        } else {
            return res.status(500).json({
                mensaje: 'La Camilla no existe'
            })
        }
    })
}

async function actualizarHistorial(req, res) {
    await db.ref('Pisos/' + req.body.piso + '/Habitaciones/' + req.body.habitacion + '/Camillas/' + req.body.id + '/Historial/' + req.body.historyID).set({
        nombrePaciente: req.body.nombrePaciente,
        apellidoPaciente: req.body.apellidoPaciente,
        rutPaciente: req.body.rutPaciente,
        idCamilla: req.body.id,
        id: req.body.historyID,
        fechaInicio: req.body.dateIn,
        fechaTermino: req.body.dateOut
    })
    return res.status(200).json({
        mensaje: 'Actualización realizada'
    })
}