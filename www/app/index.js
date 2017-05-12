import React from 'react';
import ReactDOM from'react-dom';
import routes from './config/routes';
import {BrowserRouter} from 'react-router-dom'


ReactDOM.render(
    <BrowserRouter>
        {routes}
    </BrowserRouter>, 
    document.getElementById('app'));