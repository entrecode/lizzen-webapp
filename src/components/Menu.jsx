import { Icon } from 'solid-heroicons';
import { xMark } from 'solid-heroicons/outline';
import { tbd, clickOutside } from '../util';
import { showMenu, setShowMenu } from '../App';

function Menu() {
  return (
    <div
      class="fixed bg-slate-900 h-app-height w-full max-w-[400px] top-0 right-0 duration-500 p-4 transition-transform text-white space-y-6"
      classList={{ 'translate-x-0': showMenu(), 'translate-x-full': !showMenu() }}
      use:clickOutside={() => setShowMenu(false)}
    >
      <div class="flex justify-between">
        <div class="flex items-center space-x-2">
          <img src="./img/avatar.png" class="w-8 h-8" />
          <span class="text-sm">Hallo Jan!</span>
        </div>
        <button onClick={() => setShowMenu(false)}>
          <Icon path={xMark} class="w-7 h-7" />
        </button>
      </div>
      <div class="space-y-3">
        <button class="p-2 w-full rounded-md bg-slate-800" onClick={tbd}>
          Mein Account!
        </button>
        <button class="p-2 w-full rounded-md bg-slate-800" onClick={tbd}>
          Benachrichtigungen
        </button>
        <button class="p-2 w-full rounded-md bg-slate-800" onClick={tbd}>
          Support und FAQ
        </button>
        <button class="p-2 w-full rounded-md bg-slate-800" onClick={tbd}>
          Datenschutz
        </button>
        <button class="p-2 w-full rounded-md bg-slate-800" onClick={tbd}>
          Impressum
        </button>
      </div>
    </div>
  );
}

export default Menu;
