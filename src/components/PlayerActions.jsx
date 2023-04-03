import { Icon } from 'solid-heroicons';
import { adjustmentsHorizontal, backward, forward, pause, play, tv } from 'solid-heroicons/solid';
import Button from './Button';
import * as player from '../player';
import { tbd } from '../util';

function PlayerActions() {
  return (
    <nav class="flex justify-between">
      <Button onClick={tbd}>
        <Icon path={tv} class="w-7 h-7" />
      </Button>
      <div class="items-center space-x-4">
        <Button onClick={() => player.handlePrev()}>
          <Icon path={backward} class="w-7 h-7" />
        </Button>
        <Button onClick={() => player.handleTogglePlay('./audio/Sound.mp3')}>
          {player.paused() ? <Icon path={play} class="w-7 h-7" /> : <Icon path={pause} class="w-7 h-7" />}
        </Button>
        <Button onClick={() => player.handleNext()}>
          <Icon path={forward} class="w-7 h-7" />
        </Button>
      </div>
      <Button onClick={() => player.setShowMixer((v) => !v)}>
        <Icon path={adjustmentsHorizontal} class="w-7 h-7" />
      </Button>
    </nav>
  );
}

export default PlayerActions;
