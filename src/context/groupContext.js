import {useState, useEffect ,createContext, useContext, useReducer, Children } from "react";
import { UserContext } from "./userContext";


export const GroupContext = createContext();

export const GroupContextProvider=({children})=>{


    const Reducer = (state,action)=>{
        switch(action.type){
            case "ADD_GROUP":{
                return action.payload;
            }
            default:
                return state;
        }

    }

    const[state,dispatch] = useReducer(Reducer,{
       

    });


    return(
        <GroupContext.Provider value={{groupData:state,dispatch}}>
            {children}
        </GroupContext.Provider>
    )
}