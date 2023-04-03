import { Icon } from 'solid-heroicons';
import { bars_3, heart, magnifyingGlass } from 'solid-heroicons/outline';
import { tbd } from '../util';
import { setShowMenu } from '../App';

function Header() {
  return (
    <nav class="flex justify-between items-center px-1">
      <div class="flex items-center space-x-2">
        <img src="./img/avatar.png" class="w-8 h-8" />
        <span class="text-sm">Hallo Jan!</span>
      </div>
      <div class="flex space-x-3">
        <button onClick={tbd}>
          <Icon path={heart} class="w-7 h-7" />
        </button>

        <button onClick={tbd}>
          <Icon path={magnifyingGlass} class="w-7 h-7" />
        </button>

        <button onClick={() => setShowMenu((s) => !s)}>
          <Icon path={bars_3} class="w-7 h-7" />
        </button>
      </div>
    </nav>
  );
}

export default Header;
