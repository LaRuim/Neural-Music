import 'bootstrap/dist/css/bootstrap.min.css';
import {createStore,combineReducers } from 'redux';
import reducers from '../reducers/reducers.js';

export const store = createStore(reducers)