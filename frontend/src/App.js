import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import DetectZone from "./pages/DetectZone";
import PreviousAnalysis from "./pages/PreviousAnalysis";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import TryDemo from "./pages/TryDemo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ReportGeneration from "./pages/ReportGeneration";
import TrendingAnalysis from "./pages/TrendingAnalysis";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="app-container">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/detect" element={<DetectZone />} />
                    <Route path="/analysis" element={<PreviousAnalysis />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/demo" element={<TryDemo />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/report" element={<ReportGeneration />} />
                    <Route path="/trending" element={<TrendingAnalysis />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;