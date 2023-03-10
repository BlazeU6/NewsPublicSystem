export default function loadingReducer(prevState = {
    isLoading:true
},action){
    const {type,payload} = action
    switch (type) {
        case "change_isLoading":
            return {
                ...prevState,
                isLoading:payload
            }
        default:
            return prevState;
    }
}