export const CONNECTED_TO_WS = 'CONNECTED_TO_WS';
export const ON_SNOW_BALL_READY = 'ON_SNOW_BALL_READY';
export const UPDATE_PLAYER_NUMBERS = 'UPDATE_PLAYER_NUMBERS';
export const STORE_PLAYERS = 'STORE_PLAYERS';
export const STORE_GAME_MODE = 'STORE_GAME_MODE';
export const START_GAME = 'START_GAME';
export const STORE_COUNTDOWN = 'STORE_COUNT_DOWN';

export const storeCountDown = (data) => ({ type: STORE_COUNTDOWN, data });

export const startGame = () => ({ type: START_GAME });

export const updateGameMode = (gameMode) => ({ type: STORE_GAME_MODE, gameMode });

export const updatePlayerNumbers = (payload) => ({ type: UPDATE_PLAYER_NUMBERS, payload });

export const storePlayers = (payload) => ({ type: STORE_PLAYERS, payload });

export const connectedToWS = () => ({ type: CONNECTED_TO_WS });

export const onSnowBallReady = () => ({ type: ON_SNOW_BALL_READY });
