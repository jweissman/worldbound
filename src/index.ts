// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
import { Game } from './Game';
import { World } from './models/World';

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

let world: World = new World()
let game: Game = new Game(world)
// game.backgroundColor = Color.Black.clone().lighten(0.02)

// game.add(cells)

game.start()
