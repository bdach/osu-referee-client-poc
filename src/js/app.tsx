import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from "./main";
import "../scss/styles.scss";

const root = createRoot(document.body);
root.render(<Main />)