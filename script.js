const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";

// Search by Song or artist
async function searchSong(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);

  const data = await res.json();

  showData(data);
}

// show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (song) => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}"
      data-song-title="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join("")}
    </ul>
   `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ""
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ""
      }
     `;
  } else {
    more.innerHTML = "";
  }
}

// get Prev and Next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);

  const data = await res.json();

  showData(data);
}
// get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);

  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>`;

  more.innerHTML = "";
}

// event listeners
form.addEventListener("submit", (e) => {
  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("please type a search term");
  } else {
    searchSong(searchTerm);
  }

  e.preventDefault();
});

// get lyrics buytton click

result.addEventListener("click", (e) => {
  const clikedEl = e.target;

  if (clikedEl.tagName === "BUTTON") {
    const artist = clikedEl.getAttribute("data-artist");
    const songTitle = clikedEl.getAttribute("data-song-title");

    getLyrics(artist, songTitle);
  }
});
