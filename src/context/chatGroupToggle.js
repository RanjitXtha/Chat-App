import {createContext,  useReducer } from "react";

export const CGToggleContext = createContext();

export const CGToggleContextProvider=({children})=>{

    const Reducer = (state,action)=>{
        console.log(state);
        switch(action.type){
            case "TOGGLE":{
                return {currentState:action.payload};
            }
            default:
                return state;
        }

    }

    const[state,dispatch] = useReducer(Reducer,{
        currentState:'null',
    });


    return(
        <CGToggleContext.Provider value={{CGState:state,groupDispatch:dispatch}}>
            {children}
        </CGToggleContext.Provider>
    )
}