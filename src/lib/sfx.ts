// Centralised sound effect manager.
// All sounds are pre-loaded as Audio elements so there's no fetch delay on first play.
// Browser autoplay policy: we resume the AudioContext on first user gesture and
// call .play() with a silent catch — if it fails before unlock, it's just skipped.

const BASE = '/sfx/'

const SOUNDS = {
  hover:          { src: 'hover.wav',          volume: 0.18 },
  click:          { src: 'click.wav',           volume: 0.35 },
  walletConnect:  { src: 'wallet-connect.wav',  volume: 0.55 },
  comEstablished: { src: 'com-established.mp3', volume: 0.45 },
  agentInit:      { src: 'agent-init.wav',      volume: 0.5  },
  nodeHover:      { src: 'node-hover.wav',      volume: 0.22 },
  nodeClick:      { src: 'node-click.wav',      volume: 0.5  },
  sheetOpen:      { src: 'sheet-open.wav',      volume: 0.4  },
  copied:         { src: 'copied.wav',          volume: 0.4  },
  confirm:        { src: 'confirm.wav',         volume: 0.55 },
} as const

export type SoundKey = keyof typeof SOUNDS

// Pool of Audio elements per key (avoids cutting off rapid successive plays)
const pool: Partial<Record<SoundKey, HTMLAudioElement[]>> = {}

function getAudio(key: SoundKey): HTMLAudioElement {
  const cfg = SOUNDS[key]
  if (!pool[key]) pool[key] = []
  const bucket = pool[key]!
  // Find one that's ended or not started
  const free = bucket.find(a => a.paused || a.ended)
  if (free) {
    free.currentTime = 0
    return free
  }
  const el = new Audio(BASE + cfg.src)
  el.volume = cfg.volume
  el.preload = 'auto'
  bucket.push(el)
  return el
}

// Preload all sounds after first user interaction
let preloaded = false
function preloadAll() {
  if (preloaded) return
  preloaded = true
  ;(Object.keys(SOUNDS) as SoundKey[]).forEach(key => getAudio(key))
}

export function play(key: SoundKey) {
  preloadAll()
  try {
    const audio = getAudio(key)
    audio.volume = SOUNDS[key].volume
    audio.play().catch(() => {/* blocked before user gesture — silent fail */})
  } catch {
    // ignore
  }
}

// Convenience: attach hover + click sounds to any element
export function sfxProps(clickSound: SoundKey = 'click') {
  return {
    onMouseEnter: () => play('hover'),
    onClick:      () => play(clickSound),
  }
}
