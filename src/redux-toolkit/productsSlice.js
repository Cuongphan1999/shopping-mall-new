import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'products',//name slide
    initialState: {
        status: 'idle',
        data: [],
        totalRows: 0
    },
   
    reducers: { //trang thai khoi tao// chi su dung k goi api
        //action creator: name/name => product/fetchdata
        // fetchData: (state, action) => {
        //     // console.log(action)
        //     //c1: return [...action.payload]
        //     state = action.payload //mutation => di qua immer => imutation -[rong]
        //     //immer 
        // }
    },

    extraReducers: (builder) => { //extra reducers xu ly bat dong bo vaf api 
        builder
        .addCase(fetchDataThunkAction.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchDataThunkAction.fulfilled, (state, action) => {
            //console.log(action.payload)
            state.data = action.payload.products
            state.status = 'idle'
            state.totalRows = action.payload?.total
        })
        .addCase(fetchDataThunkAction.rejected, (state, action) => {
            
        })
    }
})
//su dung reducer thunk
export const fetchDataThunkAction = createAsyncThunk('fetchDataThunkAction', async (limit) => {
    let productListRes = await fetch(`https://dummyjson.com/products?limit=${limit}`)
    let data = await productListRes.json();
    console.log(data?.products)
    return data //data?.products  : lay products trong api vaf thay 28: products
})

//thuc thi thunk action 3 trang thai:
/*Truong hop promise action
pending: cho de lay du lieu
fullfilled: da lay du lieu thanh cong
rejected: loi
*/
export default productsSlice