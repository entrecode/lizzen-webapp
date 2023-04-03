import { createSignal } from 'solid-js';
import Header from './components/Header';
import Artwork from './components/Artwork';
import Player from './components/Player';
import Menu from './components/Menu';

export const [showMenu, setShowMenu] = createSignal(false);

function App() {
  return (
    <div class="relative flex justify-center items-top h-app-height w-full bg-slate-900 overflow-auto">
      <div class="text-white max-w-[675px]">
        <div class="sticky top-0 bg-slate-900 py-4 px-3">
          <Header />
        </div>
        <div class="px-3 space-y-4 pb-4">
          <Artwork />
          <Player />
        </div>
        <Menu />
      </div>
    </div>
  );
}

export default App;

// https://medium.com/quick-code/100vh-problem-with-ios-safari-92ab23c852a8
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};
if (typeof window !== 'undefined') {
  window.addEventListener('resize', appHeight);
  appHeight();
}

/*
// this seems to only work if an audio element is playing somewhere
if ('mediaSession' in navigator) {
  const player = document.getElementById('dummyplayer');
  // navigator.mediaSession.playbackState = 'playing';
  //const player = document.querySelector('audio');
  console.log('mediasession!');
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Shadows of Ourselves',
    artist: 'Thievery Corporation',
    album: 'The Mirror Conspiracy',
    artwork: [
      {
        src: 'https://whatpwacando.today/src/img/media/mirror-conspiracy256x256.jpeg',
        sizes: '256x256',
        type: 'image/jpeg',
      },
      {
        src: 'https://whatpwacando.today/src/img/media/mirror-conspiracy512x512.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  });

  navigator.mediaSession.setActionHandler('play', () => {
    console.log('play');
    player.play();
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    console.log('pause');
    player.pause();
  });
  navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    const skipTime = details.seekOffset || 1;
    player.currentTime = Math.max(player.currentTime - skipTime, 0);
    console.log('seekbackward', skipTime);
  });

  navigator.mediaSession.setActionHandler('seekforward', (details) => {
    const skipTime = details.seekOffset || 1;
    player.currentTime = Math.min(player.currentTime + skipTime, player.duration);
    console.log('seekforward', skipTime);
  });

  navigator.mediaSession.setActionHandler('seekto', (details) => {
    if (details.fastSeek && 'fastSeek' in player) {
      player.fastSeek(details.seekTime);
      return;
    }
    player.currentTime = details.seekTime;
    console.log('seekto', details);
  });

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    player.currentTime = 0;
    console.log('previoustrack');
  });
}
*/
