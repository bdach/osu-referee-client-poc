import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from "./components/main";
import "../scss/styles.scss";

const root = createRoot(document.body);
root.render(<Main />)
document.body.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');