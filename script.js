console.log("Welcome to Spotify");

const audio = new Audio();
const songs = [
    { title: "Warriyo - Mortals [NCS Release]", artist: "Warriyo", src: "songs/1.mp3", cover: "covers/1.jpg" },
    { title: "Cielo - Huma-Huma", artist: "Cielo", src: "songs/2.mp3", cover: "covers/2.jpg" },
    { title: "DEAF KEV - Invincible [NCS Release]", artist: "DEAF KEV", src: "songs/3.mp3", cover: "covers/3.jpg" },
    { title: "Different Heaven & EH!DE - My Heart", artist: "Different Heaven & EH!DE", src: "songs/4.mp3", cover: "covers/4.jpg" },
    { title: "Janji - Heroes Tonight", artist: "Janji", src: "songs/5.mp3", cover: "covers/5.jpg" },
    { title: "Rabba - Salam-e-Ishq", artist: "Rabba", src: "songs/6.mp3", cover: "covers/6.jpg" },
    { title: "Sakhiyaan - Salam-e-Ishq", artist: "Sakhiyaan", src: "songs/7.mp3", cover: "covers/7.jpg" },
    { title: "Bhula Dena - Salam-e-Ishq", artist: "Bhula Dena", src: "songs/8.mp3", cover: "covers/8.jpg" },
    { title: "Tumhari Kasam - Salam-e-Ishq", artist: "Tumhari Kasam", src: "songs/9.mp3", cover: "covers/9.jpg" },
    { title: "Na Jaana - Salam-e-Ishq", artist: "Na Jaana", src: "songs/10.mp3", cover: "covers/10.jpg" }
];

let currentSongIndex = 0;
let isLooping = false;
let isSeeking = false;

const masterPlay = document.getElementById('masterPlay');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const loopButton = document.getElementById('loopBtn');
const myProgressBar = document.getElementById('myProgressBar');
const gif = document.getElementById('gif');
const masterSongName = document.getElementById('masterSongName');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');
const songItems = Array.from(document.getElementsByClassName('songItem'));
const songBanner = document.querySelector('.songBanner');

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '00:00';
    }

    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const setPlayState = (isPlayingState) => {
    if (!masterPlay) return;
    masterPlay.textContent = isPlayingState ? '❚❚' : '▶';
    masterPlay.setAttribute('aria-label', isPlayingState ? 'Pause' : 'Play');
    masterPlay.title = isPlayingState ? 'Pause' : 'Play';

    if (gif) {
        gif.style.opacity = isPlayingState ? '1' : '0';
    }

    document.body.classList.toggle('is-playing', isPlayingState);
    document.body.classList.toggle('is-paused', !isPlayingState);
};

const updateCurrentTimeDisplay = () => {
    if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audio.currentTime || 0);
    }

    if (totalDurationEl && Number.isFinite(audio.duration) && audio.duration > 0) {
        totalDurationEl.textContent = formatTime(audio.duration);
    }
};

const updateSongList = () => {
    songItems.forEach((element, index) => {
        const title = element.getElementsByClassName('songName')[0];
        const icon = element.getElementsByClassName('songItemPlay')[0];
        const row = element;

        row.classList.toggle('active', index === currentSongIndex);

        if (title) {
            title.textContent = songs[index].title;
        }

        if (icon) {
            icon.classList.remove('is-active');
            icon.textContent = '▶';
            icon.setAttribute('aria-label', `Play ${songs[index].title}`);
            icon.title = `Play ${songs[index].title}`;

            if (index === currentSongIndex) {
                icon.textContent = audio.paused ? '▶' : '❚❚';
                icon.classList.add('is-active');
                icon.setAttribute('aria-label', audio.paused ? `Play ${songs[index].title}` : `Pause ${songs[index].title}`);
                icon.title = audio.paused ? `Play ${songs[index].title}` : `Pause ${songs[index].title}`;
            }
        }
    });
};

const updateNowPlaying = () => {
    const currentSong = songs[currentSongIndex];
    if (!currentSong) return;

    if (masterSongName) {
        masterSongName.textContent = currentSong.title;
    }

    if (songBanner) {
        songBanner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('${currentSong.cover}')`;
    }

    updateSongList();
    updateCurrentTimeDisplay();
};

const loadSong = (index, shouldPlay = false) => {
    if (!songs.length) return;

    currentSongIndex = (index + songs.length) % songs.length;
    const currentSong = songs[currentSongIndex];

    if (!currentSong) return;

    audio.src = currentSong.src;
    audio.load();
    audio.currentTime = 0;
    updateNowPlaying();

    if (shouldPlay) {
        playCurrentSong();
    }
};

const playCurrentSong = async () => {
    if (!audio.src) {
        loadSong(currentSongIndex, false);
    }

    try {
        await audio.play();
        setPlayState(true);
    } catch (error) {
        console.log('Playback blocked until the user interacts with the page.');
        setPlayState(false);
    }
};

const pauseCurrentSong = () => {
    audio.pause();
    setPlayState(false);
};

const handleSongClick = (index) => {
    if (index === currentSongIndex) {
        if (audio.paused) {
            playCurrentSong();
        } else {
            pauseCurrentSong();
        }
        return;
    }

    loadSong(index, true);
};

songItems.forEach((element, index) => {
    const img = element.getElementsByTagName('img')[0];
    const title = element.getElementsByClassName('songName')[0];
    const icon = element.getElementsByClassName('songItemPlay')[0];

    if (img) img.src = songs[index].cover;
    if (title) title.textContent = songs[index].title;

    if (icon) {
        icon.id = String(index);
        icon.setAttribute('aria-label', `Play ${songs[index].title}`);
        icon.title = `Play ${songs[index].title}`;
        icon.addEventListener('click', (event) => {
            event.stopPropagation();
            handleSongClick(index);
        });
    }

    element.addEventListener('click', (event) => {
        if (event.target.closest('.songItemPlay')) return;
        handleSongClick(index);
    });
});

if (masterPlay) {
    masterPlay.addEventListener('click', async () => {
        if (!audio.src) {
            loadSong(currentSongIndex, true);
            return;
        }

        if (audio.paused) {
            await playCurrentSong();
        } else {
            pauseCurrentSong();
        }
    });
}

if (previousButton) {
    previousButton.addEventListener('click', () => {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            updateCurrentTimeDisplay();
            return;
        }
        loadSong(currentSongIndex - 1, true);
    });
}

if (nextButton) {
    nextButton.addEventListener('click', () => {
        loadSong(currentSongIndex + 1, true);
    });
}

if (loopButton) {
    loopButton.addEventListener('click', () => {
        isLooping = !isLooping;
        loopButton.classList.toggle('loop-active', isLooping);
        audio.loop = isLooping;
        loopButton.textContent = '↻';
        loopButton.setAttribute('aria-label', isLooping ? 'Loop enabled' : 'Toggle loop');
        loopButton.title = isLooping ? 'Loop enabled' : 'Toggle loop';
    });
}

myProgressBar.addEventListener('input', (event) => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    isSeeking = true;
    const value = Number(event.target.value) || 0;
    const nextTime = (value / 100) * audio.duration;
    audio.currentTime = nextTime;
    currentTimeEl.textContent = formatTime(nextTime);
});

myProgressBar.addEventListener('change', () => {
    isSeeking = false;
});

audio.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        totalDurationEl.textContent = formatTime(audio.duration);
    } else {
        totalDurationEl.textContent = '00:00';
    }

    if (!Number.isFinite(audio.currentTime) || audio.currentTime < 0) {
        audio.currentTime = 0;
    }
});

audio.addEventListener('timeupdate', () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
    }

    if (!isSeeking) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        if (Number.isFinite(progressPercent)) {
            myProgressBar.value = progressPercent;
        }
    }

    currentTimeEl.textContent = formatTime(audio.currentTime || 0);
});

audio.addEventListener('play', () => {
    setPlayState(true);
    updateSongList();
});

audio.addEventListener('pause', () => {
    setPlayState(false);
    updateSongList();
});

audio.addEventListener('ended', () => {
    if (isLooping) {
        audio.currentTime = 0;
        playCurrentSong();
        return;
    }

    loadSong(currentSongIndex + 1, true);
});

audio.addEventListener('error', () => {
    console.log('Audio could not be loaded for the current song.');
    currentTimeEl.textContent = '00:00';
    totalDurationEl.textContent = '00:00';
    setPlayState(false);
});

if (masterSongName) {
    masterSongName.textContent = songs[0].title;
}

if (totalDurationEl) {
    totalDurationEl.textContent = '00:00';
}

if (currentTimeEl) {
    currentTimeEl.textContent = '00:00';
}

if (myProgressBar) {
    myProgressBar.value = 0;
}

loadSong(0, false);
updateSongList();
setPlayState(false);