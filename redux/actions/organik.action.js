import * as actionTypes from "../types/organik.type";

export const setOrganik = (socket) => dispatch => {
    socket.emit('api.socket.organik/s/getOrganikAll', ({ all_organik_ppnpn, spd_nip }) => {
        return dispatch({ type: actionTypes.SET_ORGANIK, new_organik_all: all_organik_ppnpn, spd_nip })
    })
}
export const setNewHandkey = (id_fingerprint, new_handkey_time) => dispatch => {
    return dispatch({ type: actionTypes.SET_NEW_HANDKEY, id_fingerprint, new_handkey_time })
}