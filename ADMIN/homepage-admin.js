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
