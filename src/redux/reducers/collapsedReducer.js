export default function collapsedReducer(prevState = {
    isCollapsed:false
},action){
    const {type} = action
    switch (type) {
        case "change_Collapsed":
            return {
                ...prevState,
                isCollapsed:!prevState.isCollapsed
            }
        default:
            return prevState;
    }
}