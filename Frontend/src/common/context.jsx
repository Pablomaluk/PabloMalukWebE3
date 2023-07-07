import { useState, createContext } from 'react';

const SelectedUnitContext = createContext(null);
const SelectedTileContext = createContext(null);
const MovesContext = createContext(null);



export {SelectedUnitContext, MovesContext, SelectedTileContext};