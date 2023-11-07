import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Auth } from './pages/authentication/customHooks/Auth.jsx';

const root = createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <Auth>
            <App />
        </Auth>
    </BrowserRouter>
)
