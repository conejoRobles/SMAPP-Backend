//Requires
const express = require('express')
const app = express()

app.listen(3000, () => {
    console.log('Express Server - puerto 3000 online')
})

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'se logró'
    })
})