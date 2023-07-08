import { useState, createContext } from 'react';

const SelectedUnitContext = createContext(null);
const SelectedTileContext = createContext(null);
const SelectedWarriorListContext = createContext(null);
const UpdateContext = createContext(null);





export {SelectedUnitContext, SelectedTileContext, UpdateContext, 
    SelectedWarriorListContext};