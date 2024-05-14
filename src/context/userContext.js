import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const UserContext = createContext();

export const UserContextProvider = ({children})=>{

    const [currentUser , setCurrentUser] = useState({});

    useEffect(()=>{
        const loggedin = onAuthStateChanged(auth, (user) => {
             setCurrentUser(user);
        });

        return()=>{
            loggedin();
        }
        },[]);
       

    return(
        <UserContext.Provider value={{currentUser}}>
            {children}
        </UserContext.Provider>
    )
}