import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "../redux-toolkit/productsSlice";
import filterSlice from "../redux-toolkit/filterSlice";
import filtersSlice from "../redux-toolkit/filterSlice";
//store co configurationstore
const store = configureStore({
    reducer: {
        products: productsSlice.reducer, //reducer tap hop cac slide
        filters: filtersSlice.reducer
    }
})
export default store