import {handleActions} from 'redux-actions';

import {set} from 'timm';
import {createSelector} from 'reselect';
import {loginFromGoogle, setCurrentUser} from "../actions/user";
export const initialState = {
    user: [],
    profile: [],
}

export default handleActions({
    [loginFromGoogle]: (state,action) => {
        const response = action.payload
        let newState = state
        newState = set(state,'profile',response)

        return newState
    },
    [setCurrentUser]: (state,action) => {
        const response = action.payload
        let newState = state
        newState = set(state,'user',response)

        return newState
    }
},initialState)

export const USER_INFO = 'USER_INFO'

export const getUserInfoStateSelector = state => state[USER_INFO]

export const getUserStateSelector = createSelector(
    getUserInfoStateSelector,
    state => state.user
)

export const getProfileStateSelector = createSelector(
    getUserInfoStateSelector,
    state => state.profile
)
