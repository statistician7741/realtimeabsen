import * as actionTypes from "../types/organik.type";
import moment from 'moment'

export default (
  state = {
    organik_all: [],
    spd_nip: {}
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_ORGANIK:
      let spd_nip = {}
      action.spd_nip.forEach(nip=>{
        spd_nip[nip] = true;
      })
      return {
        ...state,
        organik_all: action.new_organik_all,
        spd_nip
      }
    case actionTypes.SET_NEW_HANDKEY:
      const usersTemp = [...state.organik_all];
      _.forEach(usersTemp, (user, i) => {
        if (user.id_fingerprint === action.id_fingerprint) {
          if (!user.isPpnpn) user.presensi.handkey_time.push(action.new_handkey_time)
          else {
            user.presensi.forEach((d_p, i) => {
              if (d_p._id === moment().format('YYYY_MM_DD')) {
                user.presensi[i].handkey_time.push(action.new_handkey_time)
              }
            })
          }
        }
      })
      return {
        ...state,
        organik_all: usersTemp
      }
    default: return state
  }
};
