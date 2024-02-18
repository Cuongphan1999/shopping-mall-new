//thong tin gio
/*
- danh sach sp
 + so luong(quantity)
 + so tien (amount)
- tong tien(total) = shipping fee subtotal
 + shipping?(shipping fee)
 + tong tien chua co phi shipp (subtotal)
 + ngay mua(orderdate)
- thong tin ng mua(customer total)
    + hoj va ten(fullname)
    + dia chi(address)
    + thu dien tu(email)
    + sdt(mobile)
*/
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from 'uuid'


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartId: uuid(),
        cartInfor: {
            subtotal: 0,
            shipping: 0,
            total: 0,
            orderDate: new Date().valueOf()
        },
        cartDetails: [],
        customerInfor: {
            fullname: '',
            address: '',
            email: '',
            mobile: ''
        }
    },
    reducers:{
        addToCart: (state, action) => {
            /*
            th1: sp do chua co trong gio
                - them thuoc tinh quantity = 1
                - tinhs amount = quantity * price
            th2: sp da co trong gio hang
                - tang so luon (quantity) len 1 don vi
                - tinh amount
            tinh lai subtotal
            tinh lai total
             */
            let cartItem = state.cartDetails.find((item) => item.id === action.payload.id)
           //console.log(cartItem)
            //sp da co trong gio hang
            if(cartItem?.id){
                cartItem.quantity = Number(cartItem.quantity) + 1
                cartItem.amount = Number(cartItem.quantity) * Number(cartItem.newPrice)
            }
            else { //sp chua co trong gio
                state.cartDetails.push({
                    ...action.payload,
                    quantity: 1,
                    amount: action.payload.newPrice
                })
            }
            let newSubtotal = 0
            for(let item of state.cartDetails){
                newSubtotal += Number(item.amount)
            }
            let newTotal = newSubtotal + Number(state.cartInfor.shipping)
            state.cartInfor.subtotal = newSubtotal;
            state.cartInfor.total = newTotal
        },
        incrementQuantity: (state, action) => {
            let cartItem = state.cartDetails.find((item) => item.id === action.payload)
            cartItem.quantity = Number(cartItem.quantity) + 1
            cartItem.amount = Number(cartItem.quantity) * Number(cartItem.newPrice)

            let newSubtotal = 0
            for (let item of state.cartDetails) {
                newSubtotal += Number(item.amount)
            }
            let newTotal = newSubtotal + Number(state.cartInfor.shipping)
            state.cartInfor.subtotal = newSubtotal;
            state.cartInfor.total = newTotal
        }
    }
})
export default cartSlice