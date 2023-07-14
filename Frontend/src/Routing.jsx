import { BrowserRouter, Routes, Route } from "react-router-dom"
import Instructions from "./backup/instructions/instructions"
import Attack from "./backup/instructions/rules/attack"
import Building from "./backup/instructions/rules/building"
import Movement from "./backup/instructions/rules/movement"
import Review from "./backup/instructions/rules/review"
import Rules from "./backup/instructions/rules/rules"
import Training from "./backup/instructions/rules/training"
import Login from  "./login/Login"
import About from "./about/About"
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
                <Route path={'/about'} element={<About/>}/>
                <Route path={'/instructions'} element={<Instructions/>}/>
                <Route path={'/rules'} element={<Rules/>}/>
                <Route path={'/rules/1'} element={<Review/>}/>
                <Route path={'/rules/2'} element={<Building/>}/>
                <Route path={'/rules/3'} element={<Training/>}/>
                <Route path={'/rules/4'} element={<Movement/>}/>
                <Route path={'/rules/5'} element={<Attack/>}/>
                <Route path={'/'} element={<Login/>} />
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Routing