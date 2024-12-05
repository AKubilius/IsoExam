import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import App from './App';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import ExamPage from './Pages/ExamPage';
import ProfilePage from './Pages/ProfilePage';
import GraphsPage from './Pages/GraphsPage';
import ExamplePage from './Pages/ExamplePage';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'; // Import the ProtectedRoute component

import { DataProvider } from "../src/Components/DataContext/DataContext";
import { NotificationProvider } from './Components/ProtectedRoute/NotificationProvider';
import DocumentPage from './Pages/DocumentPage';

const logged = sessionStorage.getItem("token");

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <NotificationProvider>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route 
            path="/documents" 
            element={
              <ProtectedRoute>
                <DocumentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exam" 
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/graphs" 
            element={
              <ProtectedRoute>
                <GraphsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/test" element={<ExamplePage />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  </NotificationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();