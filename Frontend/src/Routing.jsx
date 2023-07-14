import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from  "./login/Login"
import Game from "./game/Game"
import Register from "./register/Register"
import Lobby from "./lobby/Lobby"

function Routing() {
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/lobby'} element={<Lobby/>}/>
                <Route path={'/game'} element={<Game/>}/>
                <Route path={'/'} element={<Login/>} />
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Routing