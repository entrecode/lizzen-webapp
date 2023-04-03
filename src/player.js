import { createEffect, createSignal } from 'solid-js';
import { createAudio } from './audio';

const _music = createAudio({ onEnded: next });
const _voice = createAudio();

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
      voice: './audio/track3.mp3',
    },
  },
];

export const [playlist] = createSignal(meditations);
export const [currentMeditation, setCurrentMeditation] = createSignal();
export const progress = () => (duration() > 0 ? currentTime() / duration() : 0);
export const [showMixer, setShowMixer] = createSignal(false);

createEffect(() => {
  if (playlist()?.length) {
    setCurrentMeditation(playlist()[0]);
  }
});

createEffect(() => {
  if (currentMeditation()) {
    console.log('change currentMeditation', currentMeditation());
    _music.load(currentMeditation().files.sound);
    _voice.load(currentMeditation().files.voice);
  }
});

export const { audio: music, currentTime, duration, paused } = _music;

export function play() {
  _music.play();
  _voice.play();
}

export function pause() {
  _music.pause();
  _voice.pause();
}

export function toggle() {
  _music.toggle(currentMeditation().files.sound);
  _voice.toggle(currentMeditation().files.voice);
}

export function seekToProgress(normalized) {
  _music.seekToProgress(normalized);
  _voice.seekToProgress(normalized);
}

export function prev() {
  if (!music) {
    console.log('nothing loaded yet..');
    return;
  }
  if (music.currentTime < 1) {
    const currentIndex = playlist().indexOf(currentMeditation());
    const prev = playlist()[(currentIndex - 1 + playlist().length) % playlist().length];
    setCurrentMeditation(prev);
    _music.play(prev.files.sound);
    _voice.play(prev.files.voice);
  } else {
    seekToProgress(0);
  }
}

export function next() {
  if (!music) {
    console.log('nothing loaded yet..');
    return;
  }
  const currentIndex = playlist().indexOf(currentMeditation());
  const next = playlist()[(currentIndex + 1) % playlist().length];
  setCurrentMeditation(next);
  _music.play(next.files.sound);
  _voice.play(next.files.voice);
}
