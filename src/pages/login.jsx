import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import '../cssFiles/loginregister.css'

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
        <div className="login-page">
            <h1>Login page</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="email" />
                <input type="password" placeholder="password" />
                <button className="click-button">Log In</button>
            </form>
            <Link className="click-button" to="/register">No account yet?</Link>
        </div>
    )
}

export default LogIn;