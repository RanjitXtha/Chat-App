import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const LogIn=()=>{

    const handleSubmit=async (e)=>{
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

        try{
            await signInWithEmailAndPassword(auth, email, password);
        }
        catch(error){
            console.log("problem with login:"+error)
        }
    
    }

    return(
        <div>
            <h1>Login page</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="email" />
                <input type="password" placeholder="password" />
                <button>Log In</button>
            </form>
            <Link to="/register">No account yet?</Link>
        </div>
    )
}

export default LogIn;