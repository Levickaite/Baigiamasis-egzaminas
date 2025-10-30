import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()
    const login = async (email, password) =>{
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/autonamai/useriai/login', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        const json = await response.json()
        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
            return false
        }
        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json))
            localStorage.setItem('token', json.token)
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
            return true
        }
    }
    return {login, isLoading, error}
}