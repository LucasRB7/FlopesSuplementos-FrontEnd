import { Routes,Route } from "react-router-dom";
import Home from "./pages/home/home";
import Dashboard from "./pages/dashboard/dashboard";
import Produtos from "./pages/produtos/produtos";
import Cliente from "./pages/clientes/cliente"

export default function MainRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Cliente/>} />
        </Routes>
    )
}