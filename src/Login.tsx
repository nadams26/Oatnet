"use client";
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { LoginContext } from './App';

let serverDomain = "http://127.0.0.1:5000"

export async function loginUser(username:string, password:string) {
    let serverResponse = await fetch(serverDomain+"/auth", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                action:"login"
            },
            body: JSON.stringify([username, password]),
    })
    return serverResponse.json()
}

export async function logoutUser() {
    let sessionID = localStorage.getItem("sessionID")
    await fetch(serverDomain+"/auth", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                action:"logout"
            },
            body: JSON.stringify(sessionID),
    })
    localStorage.removeItem("sessionID")
}

function Login() {
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()
    const {loggedIn, setLoggedIn} = useContext<any>(LoginContext)
    const [incorrectPassword , setIncorrectPassword] = useState<boolean>(false)
    const navigate = useNavigate()
    return(
        <div className="flex flex-col items-center mt-2 select-none">
            {/* Text input for the username property */}
            
            {!localStorage.getItem("username") && <div className="ml-8 mr-8 text-center">
                If you want to sign into an organization's shared account, please use the shared account credentials below! Otherwise, entering credentials will create an account, then you can ask your Oatnet administrator for permissions.
            </div>}
            
            {!loggedIn && <div className="mt-6">
                <div className="w-20 float-left">Username: </div>
                <input id="usernameBox" className="w-48 pl-1 bg-oatnet-light rounded-lg" placeholder='oat200' value={username ? username:""} onChange={e => {
                    setUsername(e.target.value)
                }}/>
            </div>}

            {/* Text input for the password property */}
            {!loggedIn && <div className="mt-4">
                <div className="w-20 float-left">Password: </div>
                <input id="passwordBox" type="password" className="w-48 pl-1 bg-oatnet-light rounded-lg" placeholder='123password321' value={password ? password:""} onChange={ e =>{
                    setPassword(e.target.value)
                }}/>
            </div>}

            {incorrectPassword && <div className="pt-2">Haha WHOOPS! Wrong Password!</div>}

            {loggedIn && <div className="pt-2">You're logged in as "{localStorage.getItem("username")}", congrats! :D</div>}

            {/* Button to either log the user in or log the user out*/}
            <button className="mt-6 ml-2 w-40 h-8 bg-oatnet-light rounded-lg" onClick={() => {
                if (!localStorage.getItem("sessionID") && username && password){
                    loginUser(username, password).then((response)=>{
                        if (response !== "Incorrect Password!") {
                            localStorage.setItem("username",username)
                            localStorage.setItem("sessionID",response)
                            setLoggedIn(true)
                            navigate("/report")
                        }
                        else if (response === "Incorrect Password!"){
                            setIncorrectPassword(true)
                        }
                    })
                    
                }
                else if(localStorage.getItem("sessionID")){
                    logoutUser()
                    setLoggedIn(false)
                }
            }}>{loggedIn ? "Logout" : (localStorage.getItem("username") ? "Login" : "Register")}</button>
        </div>
    )
}

export default Login