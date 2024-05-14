import { createContext, useContext, useReducer } from "react";
import { UserContext } from "./userContext";


export const FriendsContext = createContext();

export const FriendsContextProvider = ({children})=>{

    const {currentUser} = useContext(UserContext);


    const Reducer = (state,action)=>{
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