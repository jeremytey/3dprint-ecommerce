import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug" element={<Product />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;