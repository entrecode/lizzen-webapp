import { createEffect, createSignal } from 'solid-js';
import { createAudio } from './audio';

export const music = createAudio({ onEnded: next });
export const voice = createAudio();

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
    // console.log('change currentMeditation', currentMeditation());
    music.load(currentMeditation().files.sound);
    voice.load(currentMeditation().files.voice);
  }
});

export const { currentTime, duration, paused } = music;

export function play() {
  music.play();
  voice.play();
}

export function pause() {
  music.pause();
  voice.pause();
}

export function toggle() {
  music.toggle(currentMeditation().files.sound);
  voice.toggle(currentMeditation().files.voice);
}

export function seekToProgress(normalized) {
  music.seekToProgress(normalized);
  voice.seekToProgress(normalized);
}

export function prev() {
  if (!music.audio) {
    console.log('nothing loaded yet..');
    return;
  }
  if (music.currentTime < 1) {
    const currentIndex = playlist().indexOf(currentMeditation());
    const prev = playlist()[(currentIndex - 1 + playlist().length) % playlist().length];
    setCurrentMeditation(prev);
    music.play(prev.files.sound);
    voice.play(prev.files.voice);
  } else {
    seekToProgress(0);
  }
}

export function next() {
  if (!music.audio) {
    console.log('nothing loaded yet..');
    return;
  }
  const currentIndex = playlist().indexOf(currentMeditation());
  const next = playlist()[(currentIndex + 1) % playlist().length];
  setCurrentMeditation(next);
  music.play(next.files.sound);
  voice.play(next.files.voice);
}
