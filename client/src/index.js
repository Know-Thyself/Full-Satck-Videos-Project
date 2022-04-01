import React, { useEffect } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.css';

function AppWithCallbackAfterRender() {
	useEffect(() => {
		console.log('rendered');
	});
	return <App tab='home' />;
}

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(<AppWithCallbackAfterRender />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
