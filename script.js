const contentSections = document.getElementById('content-sections');
const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const progressBar = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.curr-time');
const totalTimeEl = document.querySelector('.total-time');
const volumeRange = document.querySelector('.volume-range');
const posterImage = document.querySelector('.poster img');
const songTitle = document.getElementById('song');
const songInfo = document.getElementById('songinfo');
const createPlaylistButton = document.getElementById('create-playlist-btn');
const playlistList = document.getElementById('playlistList');
const accountIcon = document.getElementById('icon');
const exploreButton = document.getElementById('explore');
const accountModal = document.getElementById('accountModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const accountClose = document.getElementById('accountClose');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');

const libraryData = [
  { title: 'Your Library', icon: './Assests/library_icon.png' }
];

const sections = [
  {
    title: 'Recently played',
    items: [
      {
        img: './Assests/card1img.jpeg',
        title: 'Top 50 - Global',
        info: 'Your daily updates of the most played tracks...',
        audio: './Assests/song.mp3'
      }
    ]
  },
  {
    title: 'Trending now near you',
    items: [
      {
        img: './Assests/card2img.jpeg',
        title: 'Mahiye Jinna Sona',
        info: 'Darshan Raval',
        audio: './Assests/song.mp3'
      },
      {
        img: './Assests/card7.jpeg',
        title: 'Sajni',
        info: 'Arijit Singh, Ram Sampath',
        audio: './Assests/song.mp3'
      },
      {
        img: './Assests/Screenshot_28-3-2025_25640_www.bing.com.jpeg',
        title: 'Lover',
        info: 'Tylor Swift, Shawn Mendes',
        audio: './Assests/song.mp3'
      },
      {
        img: './Assests/card9.img.jpeg',
        title: 'Tum ho',
        info: 'Mohit Chauhan, Mithoon',
        audio: './Assests/song.mp3'
      },
      {
        img: './Assests/card12.jpeg',
        title: 'Tere hawale',
        info: 'Arijit Singh, Pritam, Shilpa Rao ',
        audio: './Assests/song.mp3'
      }
    ]
  },
  {
    title: 'Featured Charts',
    items: [
      {
        img: './Assests/card5img.jpeg',
        title: 'Top Songs Global',
        info: 'Your daily updates of the most played tracks...',
        audio: './Assests/song.mp3'
      },
      {
        img: './Assests/card6img.jpeg',
        title: 'Top Songs India',
        info: 'Your daily updates of the most played tracks...',
        audio: './Assests/song.mp3'
      },
      {
        img: './Assests/card1img.jpeg',
        title: 'Top 50 - Global',
        info: 'Your daily updates of the most played tracks...',
        audio: './Assests/song.mp3'
      }
    ]
  }
];

const playableTracks = [];
sections.forEach(section => {
  section.items.forEach(item => {
    if (item.audio) {
      item.trackIndex = playableTracks.length;
      item.title = item.title.trim();
      item.info = item.info.trim();
      playableTracks.push(item);
    }
  });
});

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function attachCardListeners() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    const titleEl = card.querySelector('.card-title');
    if (!titleEl) return;
    const title = titleEl.textContent.trim();
    const track = playableTracks.find(t => t.title.trim() === title);
    if (!track) return;

    card.addEventListener('click', () => {
      currentTrackIndex = track.trackIndex;
      loadTrack(currentTrackIndex);
      audio.play().catch(() => {});
      setActiveCard(currentTrackIndex);
    });

    // Add "+" button if not already there
    if (!card.querySelector('.add-to-playlist')) {
      const addBtn = document.createElement('button');
      addBtn.className = 'add-to-playlist';
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
      addBtn.title = 'Add to playlist';
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToPlaylist(track);
      });
      card.appendChild(addBtn);
    }
  });
}

function setActiveCard(index) {
  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('.card-title').textContent;
    const track = playableTracks.find(t => t.title === title);
    card.classList.toggle('active', track && track.trackIndex === index);
  });
}

function loadTrack(index) {
  const track = playableTracks[index];
  if (!track) return;

  songTitle.textContent = track.title;
  songInfo.textContent = track.info;
  posterImage.src = track.img || './Assests/album.jpeg';
  audio.src = track.audio;
  audio.load();
  progressBar.value = 0;
  currentTimeEl.textContent = '00:00';
  totalTimeEl.textContent = '0:00';
  isPlaying = false;
  updatePlayButton();
}

function updatePlayButton() {
  playButton.classList.toggle('playing', isPlaying);
}

function togglePlay() {
  if (audio.paused) {
    audio.play().catch(() => {
      console.warn('Audio playback blocked or source is not available.');
    });
  } else {
    audio.pause();
  }
}

function nextTrack() {
  if (isShuffle) {
    currentTrackIndex = Math.floor(Math.random() * playableTracks.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playableTracks.length;
  }
  loadTrack(currentTrackIndex);
  audio.play().catch(() => {});
  setActiveCard(currentTrackIndex);
}

function previousTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playableTracks.length) % playableTracks.length;
  loadTrack(currentTrackIndex);
  audio.play().catch(() => {});
  setActiveCard(currentTrackIndex);
}

playButton.addEventListener('click', togglePlay);
previousButton.addEventListener('click', previousTrack);
nextButton.addEventListener('click', nextTrack);
shuffleButton.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleButton.classList.toggle('active', isShuffle);
});
repeatButton.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatButton.classList.toggle('active', isRepeat);
});

const playlists = [];

function createPlaylist(name) {
  if (!name) {
    // Show input field for playlist name
    showPlaylistInput();
    return;
  }
  const playlist = { name: name, songs: [] };
  playlists.push(playlist);
  renderPlaylist(playlist);
  removePlaylistInput();
}

function showPlaylistInput() {
  // Remove any existing input
  const existingInput = playlistList.querySelector('.playlist-input-container');
  if (existingInput) existingInput.remove();
  
  const inputContainer = document.createElement('div');
  inputContainer.className = 'playlist-input-container';
  
  const label = document.createElement('label');
  label.className = 'playlist-input-label';
  label.textContent = '+ New Playlist';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter playlist name...';
  input.className = 'playlist-input';
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'playlist-buttons';
  
  const createBtn = document.createElement('button');
  createBtn.innerHTML = '<i class="fas fa-check"></i>Create';
  createBtn.className = 'playlist-create-btn';
  
  const cancelBtn = document.createElement('button');
  cancelBtn.innerHTML = '<i class="fas fa-times"></i>Cancel';
  cancelBtn.className = 'playlist-cancel-btn';
  
  createBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (name) {
      createPlaylist(name);
    } else {
      alert('Please enter a playlist name');
    }
  });
  
  cancelBtn.addEventListener('click', () => {
    removePlaylistInput();
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const name = input.value.trim();
      if (name) {
        createPlaylist(name);
      }
    }
  });
  
  buttonsContainer.appendChild(createBtn);
  buttonsContainer.appendChild(cancelBtn);
  inputContainer.appendChild(label);
  inputContainer.appendChild(input);
  inputContainer.appendChild(buttonsContainer);
  playlistList.appendChild(inputContainer);
  
  input.focus();
}

function removePlaylistInput() {
  const existingInput = playlistList.querySelector('.playlist-input-container');
  if (existingInput) existingInput.remove();
}

function renderPlaylist(playlist) {
  const playlistItem = document.createElement('div');
  playlistItem.className = 'playlist-item';
  playlistItem.textContent = playlist.name;
  playlistItem.addEventListener('click', () => {
    showPlaylistSongs(playlist);
  });
  playlistList.appendChild(playlistItem);
}

function showPlaylistSongs(playlist) {
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="sticky-nav">
      <div class="sticky-nav-icons">
        <img src="./Assests/backward_icon.png" class="left" id="backToHome">
        <img src="./Assests/forward_icon.png" class="hide">
      </div>
      <div class="sticky-nav-options">
        <button class="badge nav-item hide" id="explore">Explore premium</button>
        <button class="badge nav-item dark-badge" id="install"><i class="fa-regular fa-circle-down"></i> Install app</button>
        <i class="fa-regular fa-user nav-item" id="icon"></i>
      </div>
    </div>
    <h2>${playlist.name}</h2>
    <div class="cards-container" id="playlistSongs">
      ${playlist.songs.map(song => `
        <div class="card">
          <img src="${song.img}" class="card-img">
          <p class="card-title">${song.title}</p>
          <p class="card-info">${song.info}</p>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      <div class="line"></div>
    </div>
  `;
  attachCardListeners();
  document.getElementById('backToHome').addEventListener('click', () => {
    location.reload(); // Simple way to go back
  });
}

function addToPlaylist(song) {
  if (playlists.length === 0) {
    alert('Create a playlist first');
    return;
  }
  const playlistNames = playlists.map(p => p.name);
  const choice = prompt(`Choose playlist: ${playlistNames.join(', ')}`);
  const playlist = playlists.find(p => p.name === choice);
  if (playlist && !playlist.songs.find(s => s.title === song.title)) {
    playlist.songs.push(song);
    alert(`Added ${song.title} to ${playlist.name}`);
  }
}

createPlaylistButton.addEventListener('click', () => {
  createPlaylist();
});

function showPremium() {
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="sticky-nav">
      <div class="sticky-nav-icons">
        <img src="./Assests/backward_icon.png" class="left" id="backToHome">
        <img src="./Assests/forward_icon.png" class="hide">
      </div>
      <div class="sticky-nav-options">
        <button class="badge nav-item hide" id="explore">Explore premium</button>
        <button class="badge nav-item dark-badge" id="install"><i class="fa-regular fa-circle-down"></i> Install app</button>
        <i class="fa-regular fa-user nav-item" id="icon"></i>
      </div>
    </div>
    <div class="premium-container">
      <div class="premium-header">
        <h1>Upgrade to Premium</h1>
        <p>Enjoy ad-free music and unlimited skips</p>
      </div>
      <div class="premium-plans">
        <div class="plan">
          <h3>Individual Plan</h3>
          <div class="price">₹149<span>/month</span></div>
          <ul class="features">
            <li>✓ Ad-free listening</li>
            <li>✓ Unlimited skips</li>
            <li>✓ Offline download</li>
            <li>✓ High quality audio</li>
            <li>✓ Listen anywhere</li>
          </ul>
          <button class="premium-btn">Subscribe Now</button>
        </div>
        <div class="plan featured">
          <h3>Family Plan</h3>
          <div class="price">₹249<span>/month</span></div>
          <ul class="features">
            <li>✓ Up to 6 accounts</li>
            <li>✓ Ad-free listening</li>
            <li>✓ Unlimited skips</li>
            <li>✓ Offline download</li>
            <li>✓ High quality audio</li>
            <li>✓ Parental controls</li>
          </ul>
          <button class="premium-btn">Subscribe Now</button>
        </div>
        <div class="plan">
          <h3>Student Plan</h3>
          <div class="price">₹99<span>/month</span></div>
          <ul class="features">
            <li>✓ Ad-free listening</li>
            <li>✓ Unlimited skips</li>
            <li>✓ Offline download</li>
            <li>✓ High quality audio</li>
            <li>✓ Valid student ID required</li>
          </ul>
          <button class="premium-btn">Subscribe Now</button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="line"></div>
    </div>
  `;
  
  document.getElementById('backToHome').addEventListener('click', () => {
    location.reload();
  });
  
  const newAccountIcon = document.getElementById('icon');
  if (newAccountIcon) {
    newAccountIcon.addEventListener('click', openAccountModal);
  }
}

exploreButton.addEventListener('click', showPremium);

function openAccountModal() {
  if (accountIcon.classList.contains('logged-in')) {
    // If logged in, clicking name prompts logout
    if (confirm('Logout?')) {
      accountIcon.innerHTML = '<i class="fa-regular fa-user"></i>';
      accountIcon.classList.remove('logged-in');
      accountIcon.title = '';
    }
    return;
  }
  accountModal.classList.remove('hidden');
  showLoginForm();
}

function closeAccountModal() {
  accountModal.classList.add('hidden');
}

function showLoginForm() {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
}

function showSignupForm() {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
}

function updateAccountDisplay(name) {
  accountIcon.innerHTML = name;
  accountIcon.classList.add('logged-in');
  accountIcon.title = 'Click to logout';
}

accountIcon.addEventListener('click', openAccountModal);
accountClose.addEventListener('click', closeAccountModal);
modalBackdrop.addEventListener('click', closeAccountModal);
loginTab.addEventListener('click', showLoginForm);
signupTab.addEventListener('click', showSignupForm);

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const idValue = document.getElementById('loginId').value.trim();
  const passwordValue = document.getElementById('loginPassword').value;
  if (!idValue || !passwordValue) {
    alert('Please enter both id and password.');
    return;
  }
  alert(`Logged in as ${idValue}`);
  updateAccountDisplay(idValue);
  closeAccountModal();
});

signupForm.addEventListener('submit', event => {
  event.preventDefault();
  const nameValue = document.getElementById('signupName').value.trim();
  const phoneValue = document.getElementById('signupPhone').value.trim();
  const emailValue = document.getElementById('signupEmail').value.trim();
  const passwordValue = document.getElementById('signupPassword').value;
  if (!nameValue || !phoneValue || !emailValue || !passwordValue) {
    alert('Please complete all fields to sign up.');
    return;
  }
  alert(`Sign up completed for ${nameValue}`);
  updateAccountDisplay(nameValue);
  closeAccountModal();
});

audio.addEventListener('play', () => {
  isPlaying = true;
  updatePlayButton();
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayButton();
});

audio.addEventListener('loadedmetadata', () => {
  if (!Number.isNaN(audio.duration)) {
    totalTimeEl.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener('timeupdate', () => {
  if (!Number.isNaN(audio.duration)) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

progressBar.addEventListener('input', () => {
  if (!Number.isNaN(audio.duration)) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

volumeRange.addEventListener('input', () => {
  audio.volume = volumeRange.value / 100;
});

audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } else {
    nextTrack();
  }
});

const searchLink = document.getElementById('searchLink');
console.log('searchLink element:', searchLink);
if (searchLink) {
  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showSearch();
  });
}

function showSearch() {
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="sticky-nav">
      <div class="sticky-nav-icons">
        <img src="./Assests/backward_icon.png" class="left" id="backToHome">
        <img src="./Assests/forward_icon.png" class="hide">
      </div>
      <div class="sticky-nav-options">
        <button class="badge nav-item hide" id="explore">Explore premium</button>
        <button class="badge nav-item dark-badge" id="install"><i class="fa-regular fa-circle-down"></i> Install app</button>
        <i class="fa-regular fa-user nav-item" id="icon"></i>
      </div>
    </div>
    <div class="search-container">
      <input type="text" id="searchInput" placeholder="Search for songs, artists...">
    </div>
    <div id="searchResults"></div>
    <div class="footer">
      <div class="line"></div>
    </div>
  `;
  
  // Re-attach account icon listener
  const newAccountIcon = document.getElementById('icon');
  if (newAccountIcon) {
    newAccountIcon.addEventListener('click', openAccountModal);
  }
  
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = playableTracks.filter(track =>
      track.title.toLowerCase().includes(query) || track.info.toLowerCase().includes(query)
    );
    searchResults.innerHTML = `
      <div class="cards-container">
        ${filtered.map(track => `
          <div class="card">
            <img src="${track.img}" class="card-img">
            <p class="card-title">${track.title}</p>
            <p class="card-info">${track.info}</p>
          </div>
        `).join('')}
      </div>
    `;
    attachCardListeners();
  });
  document.getElementById('backToHome').addEventListener('click', () => {
    location.reload();
  });
}
