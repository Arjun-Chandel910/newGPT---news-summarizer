import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <BrowserRouter>
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Auth />} path="/auth" />
            </Routes>
          </main>

          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
