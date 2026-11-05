import { renderMenu } from './menu/renderMenu';

export function initialApp() {
  const menu = renderMenu();
  document.body.appendChild(menu);
}
