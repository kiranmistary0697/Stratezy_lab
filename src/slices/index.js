import { combineReducers } from "redux";

import LoginReducer from "./auth/login/reducer";
import ProfileReducer from "./auth/profile/reducer";
import StockReducer from "./page/reducer";
import { api } from "./api";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  Login: LoginReducer,
  Profile: ProfileReducer,
  Stock: StockReducer,
});

export default rootReducer;
