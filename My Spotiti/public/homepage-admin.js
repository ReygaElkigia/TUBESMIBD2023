// Fungsi untuk menambahkan genre
function addGenre() {
  var genreInput = document.getElementById("genre-input");
  var genreList = document.getElementById("genre-list");

  var genreName = genreInput.value;
  var listItem = document.createElement("li");
  listItem.textContent = genreName;

  // Tambahkan tombol delete
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function() {
    listItem.remove();
  };
  listItem.appendChild(deleteButton);

  genreList.appendChild(listItem);

  // Reset input
  genreInput.value = "";
}

// Fungsi untuk menambahkan sub-genre
function addSubgenre() {
  var subgenreInput = document.getElementById("subgenre-input");
  var genreSelect = document.getElementById("genre-select");
  var subgenreList = document.getElementById("subgenre-list");

  var subgenreName = subgenreInput.value;
  var selectedGenre = genreSelect.value;

  var listItem = document.createElement("li");
  listItem.textContent = subgenreName + " (Genre: " + selectedGenre + ")";

  // Tambahkan tombol delete
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function() {
    listItem.remove();
  };
  listItem.appendChild(deleteButton);

  subgenreList.appendChild(listItem);

  // Reset input
  subgenreInput.value = "";
}

// Fungsi untuk menambahkan musik
function addMusic() {
  var musicInput = document.getElementById("music-input");
  var genreSelect = document.getElementById("genre-select");
  var subgenreSelect = document.getElementById("subgenre-select");
  var musicList = document.getElementById("music-list");

  var musicTitle = musicInput.value;
  var selectedGenre = genreSelect.value;
  var selectedSubgenre = subgenreSelect.value;

  var listItem = document.createElement("li");
  listItem.textContent = musicTitle + " (Genre: " + selectedGenre + ", Sub-Genre: " + selectedSubgenre + ")";

  // Tambahkan tombol delete
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function() {
    listItem.remove();
  };
  listItem.appendChild(deleteButton);

  musicList.appendChild(listItem);

  // Reset input
  musicInput.value = "";
}
function saveData() {
  var genreData = [];
  var genreList = document.getElementById("genre-list").getElementsByTagName("li");
  for (var i = 0; i < genreList.length; i++) {
    genreData.push(genreList[i].textContent);
  }

  var subgenreData = [];
  var subgenreList = document.getElementById("subgenre-list").getElementsByTagName("li");
  for (var j = 0; j < subgenreList.length; j++) {
    subgenreData.push(subgenreList[j].textContent);
  }

  var musicData = [];
  var musicList = document.getElementById("music-list").getElementsByTagName("li");
  for (var k = 0; k < musicList.length; k++) {
    musicData.push(musicList[k].textContent);
  }

  // Simpan data ke local storage
  localStorage.setItem("genreData", JSON.stringify(genreData));
  localStorage.setItem("subgenreData", JSON.stringify(subgenreData));
  localStorage.setItem("musicData", JSON.stringify(musicData));

  alert("Data berhasil disimpan!");
}

function addGenre() {
  var genreInput = document.getElementById("genre-input");
  var genreName = genreInput.value.trim();

  if (genreName !== "") {
    var genreList = document.getElementById("genre-list");

    var listItem = document.createElement("li");
    listItem.textContent = genreName;

    genreList.appendChild(listItem);

    genreInput.value = "";
  }
}

function addSubgenre() {
  var subgenreInput = document.getElementById("subgenre-input");
  var subgenreName = subgenreInput.value.trim();
  var genreSelect = document.getElementById("genre-select");
  var selectedGenre = genreSelect.value;

  if (subgenreName !== "") {
    var subgenreList = document.getElementById("subgenre-list");

    var listItem = document.createElement("li");
    listItem.textContent = "Sub-Genre: " + subgenreName + " (" + selectedGenre + ")";

    subgenreList.appendChild(listItem);

    subgenreInput.value = "";
  }
}

function addMusic() {
  var musicInput = document.getElementById("music-input");
  var musicTitle = musicInput.value.trim();
  var genreSelect = document.getElementById("genre-select");
  var subgenreSelect = document.getElementById("subgenre-select");
  var selectedGenre = genreSelect.value;
  var selectedSubgenre = subgenreSelect.value;

  if (musicTitle !== "") {
    var musicList = document.getElementById("music-list");

    var listItem = document.createElement("li");
    listItem.textContent = "Music: " + musicTitle + " (" + selectedGenre + ", " + selectedSubgenre + ")";

    musicList.appendChild(listItem);

    musicInput.value = "";
  }
}

function populateDropdowns() {
  var genreData = JSON.parse(localStorage.getItem("genreData")) || [];
  var subgenreData = JSON.parse(localStorage.getItem("subgenreData")) || [];

  var genreSelect = document.getElementById("genre-select");
  var subgenreSelect = document.getElementById("subgenre-select");

  // Menghapus semua opsi yang ada sebelumnya
  while (genreSelect.firstChild) {
    genreSelect.removeChild(genreSelect.firstChild);
  }

  while (subgenreSelect.firstChild) {
    subgenreSelect.removeChild(subgenreSelect.firstChild);
  }

  // Menambahkan opsi genre
  genreData.forEach(function (genre) {
    var option = document.createElement("option");
    option.textContent = genre;
    genreSelect.appendChild(option);
  });

  // Menambahkan opsi subgenre
  subgenreData.forEach(function (subgenre) {
    var option = document.createElement("option");
    option.textContent = subgenre;
    subgenreSelect.appendChild(option);
  });
}

// Panggil fungsi populateDropdowns saat halaman dimuat
window.onload = populateDropdowns;