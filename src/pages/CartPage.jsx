import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector } from "../store/selectors";
import { formatCurrency } from "../helper/helper";
import cartSlice, { checkoutThunkAction } from "../redux-toolkit/cartSlice";
import { toast } from "react-toastify";
import { useForm } from 'react-hook-form'
import Swal from "sweetalert2";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

const schema = yup.object({
    fullname: yup.string().required(),
    mobile: yup.string().required(),
    email: yup.string().email().required(),
    address: yup.string().required()
})

function CartPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const dispatch = useDispatch()
    const {cartId, cartCustomerInfor, cartInfor, cartDetails} = useSelector(cartSelector)
    const handleIncrementQuantity = (cartItem) => {
        if (cartItem?.quantity < cartItem?.stock) {
            dispatch(cartSlice.actions.incrementQuantity(cartItem.id))
        }
        else {
            toast.warning(`You can not by this product over ${cartItem?.stock}`)
        }
    }
    const handleDescrementQuantity = (cartItem) => {
        if (cartItem?.quantity > 1) {
            dispatch(cartSlice.actions.decrementQuantity(cartItem.id))
        }
        else {
            toast.warning(`You cannot descrement quantity less than 1`)
        }
    }
    const handleRemoveCartItem = (cartItem) => {
        Swal.fire({
            title: `Are you sure to remove${cartItem?.title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
          }).then((result) => {
            if (result.isConfirmed) {
              
                dispatch(cartSlice.actions.removeCartItem(cartItem?.id))
                toast.info(`${cartItem?.title} removed form cart success`)
              
            }
          });
    }
    const handleCreateCustomerInfo = async (values) => {
        //dispatch(cartSlice.actions.createCustomerInfor(values))
        Swal.fire({
            title: `Are you sure to Checkout?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
          }).then((result) => {
            if (result.isConfirmed) {
                //dispatch(cartSlice.actions.createCustomerInfor(values))
               const data = {
                cartId: cartId,
                cartInfor: {
                    ...cartInfor
                },
                cartDetails: [
                    ...cartDetails
                ],
                customerInfor: {
                    ...values
                }

               }
               dispatch(checkoutThunkAction(data))
                toast.info(`Cart checkout success`)
              reset()
            }
          });
    
    }
    return (
        <MainLayout>
            <div className="container mt-1">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className=" py-2">Cart Detail</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">

                        <table className="table cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th className="text-end">Price</th>
                                    <th className="text-center">Quantity</th>
                                    <th className="text-end">Total</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                     cartDetails?.map((cartItem) => (
                                        <tr key={cartItem.id}>
                                            <td style={{ maxWidth: '200px' }}>
                                                <div className="d-flex align-items-center">
                                                    <img className="product-image" src={cartItem.images[0]} alt="" />
                                                    <div className="d-inline">
                                                        <div className="d-block fw-bolder mb-2">{cartItem?.title.toLocaleUpperCase()}</div>
                                                        <div className="d-block">{cartItem?.brand.toLocaleUpperCase()}</div>
                                                    </div>
                                                </div>

                                            </td>
                                            <td className="text-end">
                                                {formatCurrency(cartItem?.newPrice)}
                                            </td>
                                            <td >
                                                <div className="cart-quantity-wrap">
                                                    <div className="cart-quantity">
                                                        <span
                                                            role="button"
                                                            onClick={() => handleDescrementQuantity(cartItem)}
                                                        >-</span>
                                                        <span>{cartItem?.quantity}</span>
                                                        <span
                                                            role="button"
                                                            onClick={() => handleIncrementQuantity(cartItem)}
                                                        >+</span>
                                                    </div>
                                                </div>

                                            </td>
                                            <td className="text-end">
                                                {formatCurrency(cartItem?.amount)}
                                            </td>
                                            <td>
                                                <div className="action-wrap">
                                                    <span className="btn-remove"
                                                        onClick={() => handleRemoveCartItem(cartItem)}
                                                    >&times;</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className="row col-md-12">
                            <Link to={'/product'}>
                                <FaArrowLeft/> Continue shopping
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-4" style={{ minWidth: '300px' }}>
                        <div className="order-summary p-3">
                            <h3 className="border-bottom py-2">Order Summary</h3>
                            <div className="d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-between py-2">
                                    <span>Subtotal</span>
                                    <span className="fw-bolder">{formatCurrency(cartInfor?.subtotal)}</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between py-2">
                                    <span>Shipping</span>
                                    <span className="fw-bolder">
                                    {
                                        cartInfor?.shipping ? formatCurrency(cartInfor?.shipping) : 'Free'
                                    }    
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between border-top mt-2 py-2">
                                <span className="fs-6">Total</span>
                                <span className="fw-bolder fs-6">{formatCurrency(cartInfor?.total)}</span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(handleCreateCustomerInfo)}>
                            <div className="customer-info p-3">
                                <h3 className="border-bottom py-2">Customer Info</h3>
                                <div className="form-group mb-3">
                                    <label className="form-label">Fullname</label>
                                    <input type="text"
                                        className={`${errors.fullname?.message ? 'is-invalid' : ''} form-control`}
                                        placeholder="Fullname"
                                        {...register('fullname')}
                                    />
                                     <span className="invalid-feedback">{errors.fullname?.message}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Address</label>
                                    <input type="text"
                                        className={`${errors.address?.message ? 'is-invalid' : ''} form-control`}
                                        placeholder="Address"
                                        {...register('address')}
                                    />
                                    <span className="invalid-feedback">{errors.address?.message}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="text"
                                        className={`${errors.email?.message ? 'is-invalid' : ''} form-control`}
                                        placeholder="Email"
                                        {...register('email')}
                                    />
                                    <span className="invalid-feedback">{errors.email?.message}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Mobile</label>
                                    <input type="text"
                                        className={`${errors.mobile?.message ? 'is-invalid' : ''} form-control`}
                                        placeholder="Mobile"
                                        {...register('mobile')}
                                    />
                                    <span className="invalid-feedback">{errors.mobile?.message}</span>
                                </div>
                            </div>
                            <div className="py-3 bg-success mt-2 d-flex align-items-center justify-content-center text-white btn-checkout">
                                <button type="submit" className="btn btn-block flex-grow-1">
                                    CHECKOUT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default CartPage