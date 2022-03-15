import { configureStore, createSlice } from "@reduxjs/toolkit";

const searchCriteria = createSlice({
    name: 'searchCriteria',
    initialState: {username:'', sortBy:'name-asc'},
    reducers: {
        updateUsername(state, action){
            state.username = action.payload;
        },
        updateSortBy(state, action){
            state.sortBy = action.payload;
        }
    }
})

export const actions = searchCriteria.actions;

const store = configureStore({
    reducer: searchCriteria.reducer
});

export default store;

// import { createStore } from "redux";

// const reducerFn = (state = {username : ''}, action) => {
//     if(action.type === 'CHANGE'){
//         return {...state, username: action.username }
//     }
//     return state;
// };

// const store = createStore(reducerFn);

// export default store;