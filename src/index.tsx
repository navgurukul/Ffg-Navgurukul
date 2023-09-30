import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {GoogleOAuthProvider} from '@react-oauth/google';
import {store} from "./redux/stores/store";
import {render} from "react-dom";

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

const rootElement = document.getElementById('root');
render(
    <GoogleOAuthProvider clientId="469147484778-h0hpb2nrk4qk8iheavgsf9ip147tiqmq.apps.googleusercontent.com">
        <Provider store={store}>
            <App/>
        </Provider>
    </GoogleOAuthProvider>,
    rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

