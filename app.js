// 1. YOUR SONGS DATABASE CONTAINER
// Add your newest songs at the very top of this array list to keep them featured first
const tracksData = [
    {
        id: 1,
        title: "Track Title One",
        file: "music/track1.mp3",
        cover: "assets/cover-art/track1.jpg",
        date: "Latest Release"
    },
    {
        id: 2,
        title: "Track Title Two",
        file: "music/track2.mp3",
        cover: "assets/cover-art/track2.jpg",
        date: "Single"
    },
    {
        id: 3,
        title: "Track Title Three",
        file: "music/track3.mp3",
        cover: "assets/cover-art/track3.jpg",
        date: "Single"
    }
];

// 2. ELEMENT SELECTORS
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playerTitle = document.getElementById('player-title');
const playerCover = document.getElementById('player-cover');
const tracksListContainer = document.getElementById('tracks-list');

let currentTrackIndex = null;
let isPlaying = false;

// 3. GENERATE POPULAR RELEASES LIST INTERACTIVE UI
function loadTracks() {
    tracksListContainer.innerHTML = "";
    tracksData.forEach((track, index) => {
        const row = document.createElement('div');
        row.classList.add('track-row');
        row.innerHTML = `
            <div class="track-left">
                <img src="${track.cover}" alt="Cover" class="track-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'><rect width=\'40\' height=\'40\' fill=\'%23222\'/></svg>'">
                <div class="track-meta">
                    <h4>${track.title}</h4>
                    <span>${track.date}</span>
                </div>
            </div>
            <div class="track-play-indicator">▶</div>
        `;
        row.addEventListener('click', () => selectTrack(index));
        tracksListContainer.appendChild(row);
    });
}

// 4. PLAYER FUNCTIONALITY
function selectTrack(index) {
    currentTrackIndex = index;
    const track = tracksData[index];
    
    audio.src = track.file;
    playerTitle.textContent = track.title;
    playerCover.src = track.cover;
    playerCover.style.display = 'block';
    
    // Handle image broken link placeholders gracefully
    playerCover.onerror = function() {
        this.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><rect width='50' height='50' fill='%23222'/></svg>";
    };

    playTrack();
}

function playTrack() {
    isPlaying = true;
    audio.play();
    playBtn.textContent = "⏸";
}

function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playBtn.textContent = "▶";
}

// Play/Pause Action Button
playBtn.addEventListener('click', () => {
    if (currentTrackIndex === null) {
        selectTrack(0); // Play first track if nothing is loaded yet
        return;
    }
    if (isPlaying) { pauseTrack(); } else { playTrack(); }
});

// Update Progress Bar & Timing
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

// Scrubbing through timeline
progressBar.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

// Reset when finished
audio.addEventListener('ended', () => {
    pauseTrack();
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
});

// Helper: Convert Seconds to 0:00 structure
function formatTime(secs) {
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Initialize on Load
loadTracks();
if(currentTrackIndex === null) { playerCover.style.display = 'none'; }
