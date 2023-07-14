import { useState, createContext } from 'react';

const SelectedUnitContext = createContext(null);
const SelectedTileContext = createContext(null);
const SelectedWarriorListContext = createContext(null);
const UpdateContext = createContext(null);
const GameContext = createContext(null);
const AuthContext = createContext(null);



export {SelectedUnitContext, SelectedTileContext, UpdateContext, 
    SelectedWarriorListContext, AuthContext, GameContext};