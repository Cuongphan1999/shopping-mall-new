const iniState = []

const productsSlice = (state = iniState, action) => {
    switch (action.type) {
        case 'products/fetchData': {
            return [...action.payload]
        }
        default:{
            return state
        }
            
    }
}
export default productsSlice