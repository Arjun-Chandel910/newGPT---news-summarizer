import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import ViewArticle from "./pages/ViewArticle";
import EditArticlePage from "./pages/EditArticle";
import Home from "./pages/Home";
import Loader from "./utils/Loader";
import ViewSummary from "./pages/ViewSummary";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));
const History = lazy(() => import("./pages/History"));
const MyArticles = lazy(() => import("./pages/MyArticles"));
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
                  path="/articles/:id"
                  element={
                    <ProtectedRoute>
                      <ViewArticle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/articles/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditArticlePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/summaries/:id"
                  element={
                    <ProtectedRoute>
                      <ViewSummary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                  path="/me"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <CreateArticle />
                    </ProtectedRoute>
                  }
                  path="/create-article"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <MyArticles />
                    </ProtectedRoute>
                  }
                  path="/my-articles"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                  path="/history"
                />
                <Route
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                  path="/admin"
                />

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
