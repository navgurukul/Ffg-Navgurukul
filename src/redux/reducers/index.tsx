import {combineReducers} from "redux";

import user, {USER_INFO} from "./user";

const getRootReducer = () => {
    return combineReducers({
        [USER_INFO]: user

    })
}

export default getRootReducer
