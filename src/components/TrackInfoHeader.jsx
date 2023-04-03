import { Icon } from 'solid-heroicons';
import { heart } from 'solid-heroicons/outline';
import * as player from '../player';
import { tbd } from '../util';

function TrackInfoHeader() {
  return (
    <div class="flex justify-between items-top">
      <div class="space-y-2">
        <h1 class="text-md font-bold">{player.currentMeditation().title}</h1>
        <h2 class="text-sm font-thin">{player.currentMeditation().subtitle}</h2>
      </div>
      <div class="pl-3 pr-1 pt-1">
        <button onClick={tbd}>
          <Icon path={heart} class="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}

export default TrackInfoHeader;
