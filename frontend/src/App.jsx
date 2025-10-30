import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";

import Home from "./pages/Home";
import Loader from "./utils/Loader";

const GenerateSummary = lazy(() => import("./pages/GenerateSummary"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <BrowserRouter>
          <Navbar />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <main className="flex-1">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Auth />} path="/auth" />
                <Route
                  path="/summarizer"
                  element={
                    <ProtectedRoute>
                      <GenerateSummary />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
