import { createSignal, createEffect, For, onCleanup } from 'solid-js';
import { Icon } from 'solid-heroicons';
import {
  play,
  pause,
  backward,
  forward,
  tv,
  adjustmentsHorizontal,
  chatBubbleLeft,
  pencil,
  musicalNote,
} from 'solid-heroicons/solid';
import { heart, magnifyingGlass, bars_3 } from 'solid-heroicons/outline';

// https://medium.com/quick-code/100vh-problem-with-ios-safari-92ab23c852a8
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};
if (typeof window !== 'undefined') {
  window.addEventListener('resize', appHeight);
  appHeight();
}

let currentSrc;

const [currentTime, setCurrentTime] = createSignal(0);
const [duration, setDuration] = createSignal(0);
const [paused, setPaused] = createSignal(true);

// only once, create audio element + add event handlers
// we can reuse audio + the events for the rest of the session
const audio = new Audio();
audio.addEventListener('loadeddata', () => {
  console.log('loaded!', audio.duration);
  setDuration(audio.duration);
  // The duration variable now holds the duration (in seconds) of the audio clip
});
audio.autoplay = false;
audio.preload = 'auto';
audio.addEventListener('timeupdate', () => {
  setCurrentTime(audio.currentTime);
  setDuration(audio.duration);
});
/*audio.addEventListener('canplay', () => {
  console.log('can play..');
});*/
audio.addEventListener('ended', handleNext);

function startPlayback() {
  console.log('canplay');
  setPaused(false);
  audio.play();
}

function handlePlay(src) {
  console.log('handleplay', src);
  document.createElement('audio');
  audio.pause();
  audio.muted = false;
  // we need an additional variable currentSrc, because audio.src will edit src, prepending the hostname
  if (currentSrc !== src) {
    console.log('src has changed: go to 0', src);
    audio.src = src;
    audio.currentTime = 0;
  }
  startPlayback();
  currentSrc = src;
}

function handlePause() {
  setPaused(true);
  audio.pause();
}

function handleTogglePlay(src) {
  if (paused()) {
    handlePlay(src);
  } else {
    handlePause();
  }
}

function handlePrev() {
  if (!audio) {
    console.log('nothing loaded yet..');
    return;
  }
  if (audio.currentTime < 1) {
    const currentIndex = playlist().indexOf(currentMeditation());
    const prev = playlist()[(currentIndex - 1 + playlist().length) % playlist().length];
    setCurrentMeditation(prev);
    handlePlay(prev.files.sound);
  } else {
    audio.currentTime = 0;
  }
}

function handleNext() {
  console.log('next..');
  if (audio) {
    console.log('go..');
    const currentIndex = playlist().indexOf(currentMeditation());
    const next = playlist()[(currentIndex + 1) % playlist().length];
    setCurrentMeditation(next);
    handlePlay(next.files.sound);
  }
}

const meditations = [
  {
    title: 'Windy day with natural sound',
    subtitle: 'From Gretchen Baptista',
    files: {
      sound: './audio/Sound.mp3',
      voice: './audio/Voice.mp3',
    },
  },
  {
    title: 'Just Intonation',
    subtitle: 'From Felix',
    files: {
      sound: './audio/track1.mp3',
      voice: './audio/track2.mp3',
    },
  },
];

const [playlist] = createSignal(meditations);
const [currentMeditation, setCurrentMeditation] = createSignal();
createEffect(() => {
  if (playlist()?.length) {
    setCurrentMeditation(playlist()[0]);
  }
});

createEffect(() => {
  if (currentMeditation()) {
    console.log('currentMeditation', currentMeditation());
    const src = currentMeditation().files.sound;
    console.log('src', src);
    audio.src = src;
    currentSrc = src;
    // audio.pause();
  }
});

const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

function SliderInput(props) {
  let progressbar;
  const getValue = (clientX) => (clientX - progressbar.offsetLeft) / progressbar.clientWidth;
  const [scrubbing, setScrubbing] = createSignal();
  document.addEventListener('mouseup', () => {
    if (scrubbing()) {
      setScrubbing(false);
      props.onRelease?.(props.value);
    }
  });
  document.addEventListener('mousemove', (e) => {
    if (scrubbing()) {
      const offset = getValue(e.clientX);
      const value = clamp(offset, 0, 1);
      props.onChange(value);
    }
  });

  onCleanup(() => {
    audio.pause(); // just for hot reloading
  });
  return (
    <div
      class="cursor-pointer py-2"
      onMouseDown={(e) => {
        setScrubbing(true);
        props.onChange(getValue(e.clientX));
      }}
    >
      <div class="w-full bg-slate-200 h-1 rounded-md relative flex items-center" ref={progressbar}>
        <div class="bg-indigo-500 h-full rounded-md" style={{ width: `${props.value * 100}%` }} />
        <div
          class="w-4 h-4 rounded-full bg-indigo-500 -ml-1"
          onMouseDown={() => {
            setScrubbing(true);
          }}
        />
      </div>
    </div>
  );
}

function Progressbar() {
  const progress = () => (duration() > 0 ? currentTime() / duration() : 0);
  const [seeking, setSeeking] = createSignal(-1);
  return (
    <div class="space-y-2">
      <SliderInput
        value={seeking() > 0 ? seeking() : progress()}
        onChange={(v) => setSeeking(v)}
        onRelease={(v) => {
          if (audio.duration > 0) {
            audio.currentTime = v * audio.duration;
          }
          setCurrentTime(v * audio.duration);
          setSeeking(-1);
        }}
      />
      <div class="text-right font-thin text-sm">
        {duration() > 0 ? (
          <span>
            {formatCurrentTime(currentTime())} / {formatCurrentTime(duration())}
          </span>
        ) : (
          <span class="text-transparent">...</span>
        )}
      </div>
    </div>
  );
}

function Button(props) {
  return (
    <button class="p-2 rounded-full items-center w-12 h-12" onClick={() => props.onClick()}>
      <div class="w-full h-full flex justify-center items-center">{props.children}</div>
    </button>
  );
}

function handleAirplay() {
  console.log('tbd: airplay');
}

const [showMixer, setShowMixer] = createSignal(true);

function handleToggleMixer() {
  setShowMixer(!showMixer());
}

function MeditationInfoHeader() {
  return (
    <div class="flex justify-between items-top">
      <div class="space-y-2">
        <h1 class="text-md font-bold">{currentMeditation().title}</h1>
        <h2 class="text-sm font-thin">{currentMeditation().subtitle}</h2>
      </div>
      <div class="pl-3 pr-1 pt-1">
        <button
          onClick={() => {
            console.log('TBD: fav');
          }}
        >
          <Icon path={heart} class="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function PlayerActions() {
  return (
    <nav class="flex justify-between">
      <Button onClick={() => handleAirplay()}>
        <Icon path={tv} class="w-6 h-6" />
      </Button>
      <div class="items-center space-x-4">
        <Button onClick={() => handlePrev()}>
          <Icon path={backward} class="w-6 h-6" />
        </Button>
        <Button onClick={() => handleTogglePlay('./audio/Sound.mp3')}>
          {paused() ? <Icon path={play} class="w-6 h-6" /> : <Icon path={pause} class="w-6 h-6" />}
        </Button>
        <Button onClick={() => handleNext()}>
          <Icon path={forward} class="w-6 h-6" />
        </Button>
      </div>
      <Button onClick={() => handleToggleMixer()}>
        <Icon path={adjustmentsHorizontal} class="w-6 h-6" />
      </Button>
    </nav>
  );
}

function Box(props) {
  return <div class=" bg-slate-800 rounded-lg p-4 space-y-4">{props.children}</div>;
}

const [voiceGain, setVoiceGain] = createSignal(1);
const [musicGain, setMusicGain] = createSignal(1);
const lanes = () => [
  { icon: musicalNote, gain: musicGain, setGain: setMusicGain },
  { icon: chatBubbleLeft, gain: voiceGain, setGain: setVoiceGain },
];

function Mixer() {
  return (
    <div class="px-3">
      <For each={lanes()}>
        {(lane) => (
          <div class="flex justify-between items-center space-x-4 py-3">
            <Icon path={lane.icon} class="w-6 h-6" />
            <div class="grow">
              <SliderInput value={lane.gain()} onChange={(value) => lane.setGain(value)} />
            </div>
            <Icon path={pencil} class="w-5 h-5" />
          </div>
        )}
      </For>
    </div>
  );
}

function Player() {
  return (
    <Box>
      <MeditationInfoHeader />
      <Progressbar />
      <PlayerActions />
      {showMixer() && <Mixer />}
    </Box>
  );
}

function Artwork() {
  return (
    <Box>
      <div class="px-3">
        <img src="./img/cover.png" class="object-contain h-64 w-full" />
      </div>
    </Box>
  );
}

function Header() {
  return (
    <nav class="flex justify-between items-center px-1">
      <div class="flex items-center space-x-2">
        <img src="./img/avatar.png" class="w-8 h-8" />
        <span class="text-sm">Hallo Jan!</span>
      </div>
      <div class="flex space-x-2">
        <button
          onClick={() => {
            console.log('fav');
          }}
        >
          <Icon path={heart} class="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            console.log('search');
          }}
        >
          <Icon path={magnifyingGlass} class="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            console.log('menu');
          }}
        >
          <Icon path={bars_3} class="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div class="relative flex justify-center items-top h-app-height w-full bg-slate-900 overflow-auto">
      <div class="text-white max-w-[375px]">
        <div class="sticky top-0 bg-slate-900 py-4 px-3">
          <Header />
        </div>
        <div class="px-3 space-y-4 pb-4">
          <Artwork />
          <Player />
        </div>
      </div>
    </div>
  );
}

export default App;

// thanks chatGPT
function formatCurrentTime(currentTime) {
  // Get the hours, minutes, and seconds
  var hours = Math.floor(currentTime / 3600);
  var minutes = Math.floor((currentTime - hours * 3600) / 60);
  var seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);

  // Add leading zeros if necessary
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    if (hours > 0) {
      minutes = '0' + minutes;
    } else {
      minutes = minutes.toString();
    }
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  // Format the time as hh:mm:ss or mm:ss, depending on whether there are hours
  if (hours == 0) {
    return minutes + ':' + seconds;
  } else {
    return hours + ':' + minutes + ':' + seconds;
  }
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
