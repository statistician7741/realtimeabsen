import * as actionTypes from "../types/organik.type";

export default (
  state = {
    organik_all: [],
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_ORGANIK:
      console.log(state);
      return {
        ...state,
        organik_all: action.new_organik_all
      }
    case actionTypes.SET_NEW_HANDKEY:
      console.log(1111111111111);
      const usersTemp = [...state.organik_all];
      _.forEach(usersTemp, (user, i) => {
        if (user.id_fingerprint === action.id_fingerprint) {
          user.presensi.handkey_time.push(action.new_handkey_time)//moment(action.new_handkey_time, 'YYYY/MM/DD HH:mm:ss'))
        }
      })
      return {
        ...state,
        organik_all: usersTemp
      }
    default: return state
  }
};
