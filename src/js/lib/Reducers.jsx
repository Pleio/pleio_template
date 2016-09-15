import { combineReducers } from 'redux'

export const currentLanguage = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_LANG':
      return action.lang
    default:
      return state
  }
}