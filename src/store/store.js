import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "../redux-toolkit/productsSlice";
import filtersSlice from "../redux-toolkit/filterSlice";
import cartSlice from "../redux-toolkit/cartSlice";
//store co configurationstore
const store = configureStore({
    reducer: { //tap hop slice
        products: productsSlice.reducer, //reducer tap hop cac slide
        filters: filtersSlice.reducer,
        cart: cartSlice.reducer
    }
})
export default store