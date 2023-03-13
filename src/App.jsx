import { createSignal, createResource, createEffect, For } from 'solid-js';

// audio code

const ac = new AudioContext();

const cache = {}; // string: Promise<ArrayBuffer>
const loadBuffer = (url) => {
  if (!cache[url]) {
    cache[url] = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((res) => ac.decodeAudioData(res))
      .catch((err) => {
        console.dir(err);
        delete cache[url];
      });
  }
  return cache[url];
};

const playBuffer = (buffer, options) => {
  const { gain, time = ac.currentTime, offset = 0 } = options;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.start(time, offset % buffer.duration);
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(ac.destination);
  return { gainNode: g, sourceNode: src };
};
// const playSample = async url => playBuffer(await loadBuffer(url));

function fetchTracks() {
  return Promise.all([
    loadBuffer('./audio/track1.mp3'),
    loadBuffer('./audio/track2.mp3'),
    loadBuffer('./audio/track3.mp3'),
    loadBuffer('./audio/track4.mp3'),
  ]);
}

// state
const [gains, setGains] = createSignal([100, 100, 100, 100]);
const [trackNodes, setTrackNodes] = createSignal();
const [tracks] = createResource('load', fetchTracks);
const [started, setStarted] = createSignal(false);
const [progress, setProgress] = createSignal(0);
const [scrubbing, setScrubbing] = createSignal(false);

document.addEventListener('mouseup', () => {
  setScrubbing(false);
});

let lastPlayStart,
  interval,
  phase = 0;

let progressbar;
createEffect(() => {
  if (started()) {
    interval = setInterval(() => {
      const _progress = ac.currentTime - lastPlayStart + phase;
      setProgress(_progress);
      if (trackNodes().length) {
        const total = trackNodes()[0].sourceNode.buffer.duration;
        if (!scrubbing()) {
          progressbar.value = ((_progress % total) / total) * 100;
        }
      }
    }, 100);
  } else if (interval) {
    clearInterval(interval);
  }
});

const stopAllNodes = () => {
  trackNodes().forEach(({ sourceNode }) => sourceNode.stop());
  setStarted(false);
  const playPhaseLength = ac.currentTime - lastPlayStart;
  phase += playPhaseLength;
};
const startAllNodes = (time, offset = 0) => {
  lastPlayStart = time;
  const _trackNodes = tracks().map((track, i) =>
    playBuffer(track, {
      time,
      gain: gains()[i] / 100,
      offset: offset,
    }),
  );
  setTrackNodes(_trackNodes);
  setStarted(true);
};

const getDuration = () => {
  return trackNodes()[0].sourceNode.buffer.duration;
};
const seekTo = (normalizedPosition) => {
  stopAllNodes();
  phase = normalizedPosition * getDuration();
  setProgress(phase);
  startAllNodes(ac.currentTime, phase);
};

const handleTogglePlay = () => {
  /* const dummyplayer = document.getElementById('dummyplayer');
  dummyplayer.play(); */
  if (!started()) {
    ac.resume();
    startAllNodes(ac.currentTime, phase);
  } else {
    stopAllNodes();
  }
};
const handleUpdateGain = (index, value) => {
  // update frontend
  gains()[index] = value;
  setGains([...gains()]);
  if (trackNodes()) {
    // update audio nodes only if already playing
    const newValue = value / 100;
    const { gainNode } = trackNodes()[index];
    gainNode.gain.value = newValue;
  }
};
// UI

function Slider(props) {
  return (
    <div>
      <label class="flex items-center space-x-2">
        <span class="w-16">{props.label}</span>
        <input
          class="grow accent-slate-800"
          type="range"
          value={props.value}
          disabled={props.disabled}
          onInput={(e) => props.onChange(e.target.value)}
        />
        <span class="w-8">{props.value}%</span>
      </label>
    </div>
  );
}

function Button(props) {
  return (
    <button class="text-white bg-slate-800 p-2 rounded-md" onClick={(e) => props.onClick(e)}>
      {props.children}
    </button>
  );
}
function App() {
  return (
    <div class="max-w-lg m-auto p-2 space-y-4 select-none">
      <div class="grid grid-cols-2 gap-2">
        <h1 class="text-xl flex items-center">Lizzen to this</h1>
        <Button onClick={handleTogglePlay}>{started() ? 'Pause' : 'Play'}</Button>
      </div>
      <div class="grid gap-2">
        <For each={tracks()}>
          {(_, i) => (
            <Slider
              label={`Track ${i() + 1}`}
              value={gains()[i()]}
              onChange={(value) => handleUpdateGain(i(), value)}
            />
          )}
        </For>
        <div class="flex space-x-2">
          <span class="w-16">{Math.round(progress())}</span>
          <input
            class="grow"
            ref={progressbar}
            type="range"
            value={0}
            onMouseDown={() => {
              setScrubbing(true);
            }}
            onChange={(e) => {
              if (trackNodes()) {
                seekTo(e.target.value / 100);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

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
