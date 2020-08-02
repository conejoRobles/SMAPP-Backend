//FUNCIONES
export default class Functions {

    constructor() {}

    getAll(res) {
        db.ref('/').on('value', (snapshot) => {
            res.status(200).json({
                ok: true,
                mensaje: 'bdd completa',
                "data": snapshot.val()
            })
        })
    }

    agregarPiso(id, nombre = id) {
        db.ref('Pisos/' + id).set({
            nombre
        })
        return true
    }

    getPisos(res) {
        db.ref('/').on('value', (snapshot) {
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
}