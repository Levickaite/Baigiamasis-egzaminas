import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = () =>{
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const success = await signup(email, password, name, lastname)
        if (success) {
                navigate('/');
            } 
    }
    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Registracija</h3>
            <label>Vardas</label>
            <input
                type="text"

                onChange={(e)=> setName(e.target.value)}
                value={name}
            /><label>Pavardė</label>
            <input
                type="text"

                onChange={(e)=> setLastname(e.target.value)}
                value={lastname}
            />
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
            <button disabled={isLoading}>Registruotis</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup