import { appState } from './appState';
import { getGameOutcome } from './appState/game/getGameOutcome';
import { getNthNextTurn } from './appState/game/getNthNextTurn';
import { capitalise } from './capitalise';

let isActive = true;

window.addEventListener('focus', () => {
  isActive = true;
});

window.addEventListener('blur', () => {
  isActive = false;
});

export const notifyOtherPlayerMove = () => {
  if (!document.hidden && isActive) return;

  const notificationPermission = appState.get('app.notificationPermission');
  if (notificationPermission !== 'granted') return;

  const currentPlayer = appState.get('app.game.currentTurn');
  const lastPlayer = getNthNextTurn(currentPlayer, -1);
  const outcome = getGameOutcome(appState.get('app.game'));

  const title = `${capitalise(lastPlayer)} made a move`;

  const body: string = {
    'in-progress': `It's now ${capitalise(currentPlayer)}'s turn`,
    win: `${capitalise(lastPlayer)} wins`,
    draw: 'It\'s a draw'
  }[outcome.type];

  new Notification(title, {
    body,
  });
};
