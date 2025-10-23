import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
const Login = () =>{
    const [email, setEmail] = useState('')
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const success = await login (email, password)
        if (success) {
                navigate('/');
            } 
    }
 return (
 <form className="login" onSubmit={handleSubmit}>
            <h3>Prisijungimas</h3>
            <label>El. paštas</label>
            <input
                type="email"
                onChange={(e)=> setEmail(e.target.value)}
                value={email}
            />
            <label>Slaptažodis</label>
            <input
                type="password"
                onChange={(e)=> setPassword(e.target.value)}
                value={password}
            />
            <button disabled={isLoading}>Prisijungti</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}
export default Login