import {useState, useEffect ,createContext, useContext, useReducer } from "react";
import { UserContext } from "./userContext";
import { onSnapshot } from "firebase/firestore"
import { doc } from "firebase/firestore";
import { db } from "../firebase";


export const FriendsContext = createContext();

export const FriendsContextProvider = ({children})=>{
    const {currentUser} = useContext(UserContext);

    const Reducer = (state,action)=>{
        console.log(state);
        switch(action.type){
            case "ADD_USER":{
                return{
                    user:action.payload,
                    chatId:currentUser.uid > action.payload.uid
                    ? currentUser.uid + action.payload.uid
                    : action.payload.uid + currentUser.uid,
                }
            }

            default:
                return state;
        }
    }

    const[state,dispatch] = useReducer(Reducer,{
        user:{},
        chatId:"null"
    })

    return(
        <FriendsContext.Provider value={{state , dispatch}}>
            {children}
        </FriendsContext.Provider>
    )
};