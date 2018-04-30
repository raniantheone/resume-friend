import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/**
Load available resumes and cover letters, setup default options, then render

3 dropdowns:
 type: resume or cover letter
 document: available content from Contentful
 style: corresponding component in the app

type dropdown
state: options

**/

/**
Get default data
**/



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
