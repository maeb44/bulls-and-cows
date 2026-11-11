import { renderMenu } from './menu/renderMenu';
import { renderGame } from './game/renderGame';

export function initialApp() {
  const app = document.getElementById('app')!;
  function showGame(): void {
    const { element, startTimer } = renderGame(showMenu, showGame);
    app.replaceChildren(element);
    startTimer();
  }
  function showMenu(): void {
    app.replaceChildren(renderMenu(showGame));
  }
  showMenu();
}
