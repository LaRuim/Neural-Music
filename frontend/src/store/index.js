import 'bootstrap/dist/css/bootstrap.min.css';
import {createStore,combineReducers } from 'redux';
import reducers from '../reducers/reducers.js';
import { loadState } from './localStorage.js';

const persistedState = loadState()
export const store = createStore(reducers, persistedState)
