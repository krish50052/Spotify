console.log("Welcome to Spotify");

let songIndex = 0;
let audioElement = new Audio();
audioElement.preload = 'auto';

let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let songBanner = document.querySelector('.songBanner');
let loopBtn = document.getElementById('loopBtn');
let isLooping = false;

let songs = [
    { songName: "Warriyo - Mortals [NCS Release]", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", coverPath: "covers/2.jpg" },
    { songName: "DEAF KEV - Invincible [NCS Release]", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Janji - Heroes Tonight", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Rabba - Salam-e-Ishq", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", coverPath: "covers/6.jpg" },
    { songName: "Sakhiyaan - Salam-e-Ishq", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", coverPath: "covers/7.jpg" },
    { songName: "Bhula Dena - Salam-e-Ishq", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", coverPath: "covers/8.jpg" },
    { songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", coverPath: "covers/9.jpg" },
    { songName: "Na Jaana - Salam-e-Ishq", filePath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", coverPath: "covers/10.jpg" }
];

const setPlayState = (isPlayingState) => {
    masterPlay.classList.toggle('fa-pause-circle', isPlayingState);
    masterPlay.classList.toggle('fa-play-circle', !isPlayingState);
    gif.style.opacity = isPlayingState ? '1' : '0';
    document.body.classList.toggle('is-playing', isPlayingState);
    document.body.classList.toggle('is-paused', !isPlayingState);
};

const updateSongList = () => {
    songItems.forEach((element, i) => {
        const img = element.getElementsByTagName('img')[0];
        const title = element.getElementsByClassName('songName')[0];
        const playIcon = element.getElementsByClassName('songItemPlay')[0];

        img.src = songs[i].coverPath;
        title.innerText = songs[i].songName;

        playIcon.classList.remove('fa-pause-circle', 'is-active');
        playIcon.classList.add('fa-play-circle');

        if (i === songIndex) {
            playIcon.classList.remove('fa-play-circle');
            playIcon.classList.add('fa-pause-circle', 'is-active');
        }
    });
};

const updateNowPlaying = () => {
    const currentSong = songs[songIndex];
    masterSongName.innerText = currentSong.songName;

    if (songBanner) {
        songBanner.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('${currentSong.coverPath}')`;
    }

    updateSongList();
};

const loadSong = async (index, autoPlay = false) => {
    songIndex = (index + songs.length) % songs.length;
    const song = songs[songIndex];
    audioElement.src = song.filePath;
    audioElement.currentTime = 0;
    audioElement.load();
    updateNowPlaying();

    if (autoPlay) {
        try {
            await audioElement.play();
        } catch (error) {
            console.log('Playback blocked until user interaction');
        }
    }
};

const playCurrentSong = async () => {
    try {
        await audioElement.play();
        setPlayState(true);
    } catch (error) {
        console.log('Playback blocked until user interaction');
        setPlayState(false);
    }
};

const pauseCurrentSong = () => {
    audioElement.pause();
    setPlayState(false);
};

songItems.forEach((element, i) => {
    const img = element.getElementsByTagName('img')[0];
    const title = element.getElementsByClassName('songName')[0];
    const icon = element.getElementsByClassName('songItemPlay')[0];

    img.src = songs[i].coverPath;
    title.innerText = songs[i].songName;
    icon.id = String(i);

    icon.addEventListener('click', async (event) => {
        event.stopPropagation();
        const clickedIndex = Number(icon.id);

        if (songIndex === clickedIndex && !audioElement.paused) {
            pauseCurrentSong();
            updateSongList();
            return;
        }

        await loadSong(clickedIndex, true);
        updateSongList();
    });
});

masterPlay.addEventListener('click', async () => {
    if (audioElement.paused) {
        await playCurrentSong();
    } else {
        pauseCurrentSong();
    }
});

audioElement.addEventListener('play', () => {
    setPlayState(true);
    updateSongList();
});

audioElement.addEventListener('pause', () => {
    setPlayState(false);
    updateSongList();
});

audioElement.addEventListener('timeupdate', () => {
    if (!audioElement.duration || !Number.isFinite(audioElement.duration)) return;
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    myProgressBar.value = progress;
});

myProgressBar.addEventListener('input', () => {
    if (!audioElement.duration || !Number.isFinite(audioElement.duration)) return;
    audioElement.currentTime = (myProgressBar.value / 100) * audioElement.duration;
});

audioElement.addEventListener('ended', () => {
    if (isLooping) {
        audioElement.currentTime = 0;
        playCurrentSong();
        return;
    }

    loadSong(songIndex + 1, true);
});

document.getElementById('next').addEventListener('click', async () => {
    await loadSong(songIndex + 1, true);
    updateSongList();
});

document.getElementById('previous').addEventListener('click', async () => {
    await loadSong(songIndex - 1, true);
    updateSongList();
});

loopBtn.addEventListener('click', () => {
    isLooping = !isLooping;
    loopBtn.classList.toggle('loop-active', isLooping);
    audioElement.loop = isLooping;
});

(async () => {
    await loadSong(0);
    updateSongList();
})();