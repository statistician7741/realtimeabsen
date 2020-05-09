const Organik = require('../models/organik.model')
const moment = require('moment');

function applyToClient(client) {
    client.on('api.socket.organik/s/getOrganikAll', (cb) => {
        const _id = moment().format('YYYY_MM_DD')
        Organik.updateMany({
            'isProv': false,
            '$and': [
                { pensiun: false },
                { pindah: false }
            ],
            'presensi._id': {
                $nin: [_id]
            }
        }, {
            $push: {
                presensi: {
                    _id,
                    handkey_time: []
                }
            }
        }, (e, r) => {
            Organik.aggregate([
                { $unwind: "$presensi" },
                {
                    $match: {
                        "presensi._id": _id,
                        'isProv': false,
                        '$and': [
                            { pensiun: false },
                            { pindah: false }
                        ]

                    }
                }
            ]).sort('nama').exec((e, semua_organik) => {
                if (semua_organik) cb(semua_organik)
                else cb([])
            })
        })
    });
}

module.exports = applyToClient