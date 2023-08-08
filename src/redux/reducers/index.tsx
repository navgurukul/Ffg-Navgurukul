import {combineReducers} from "redux";

import user, {USER_INFO} from "./user";
import {connectRouter} from "connected-react-router";

const getRootReducer = history => {
    return combineReducers({
        [USER_INFO]: user,
        router: connectRouter(history),

    })
}

export default getRootReducer
