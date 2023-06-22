import path, { parse } from 'path'
import express from 'express'
import mysql from 'mysql';
import session from 'express-session';
import { render } from 'ejs';
import { get } from 'http';
import e from 'express';

const pool = mysql.createPool({
  user: 'root',
  password: '',
  database: 'tubes_spotiti',
  host: 'localhost'
});


const port = 8080;


const app = express();
app.listen(port, () => {
  console.log(`Port ${port} is ready`)
})

const durasi = 1000 * 60 * 60 * 1;

app.use(session({
  secret: 'secret',
  resave: true,
  cookie: { maxAge: durasi },
  saveUninitialized: true
}));


app.set('view engine', 'ejs')
app.use(express.static(path.resolve('public')));
app.use(express.urlencoded({ extended: true }));

const dbConnect = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

const getUser = (conn, username, password) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getPlaylist = conn => {
  return new Promise((resolve, reject) => {
    conn.query
      (`SELECT *
          FROM playlist 
           `, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const getMyPlaylist = (conn, idU) => {
  return new Promise((resolve, reject) => {
    console.log(idU + "r")
    conn.query
      (`SELECT *
        FROM playlist 
        WHERE id_playlist = '${idU}' `, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const getGenre = conn => {
  return new Promise((resolve, reject) => {
    conn.query
      (`SELECT *
          FROM genre
          LIMIT 3 `, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const getSubGenre = (conn, idG) => {
  return new Promise((resolve, reject) => {
    conn.query
      (`SELECT sub_genre.nama, sub_genre.id_subG
      FROM sub_genre JOIN genre ON sub_genre.id_genre = genre.id_genre
      WHERE genre.id_genre = '${idG}' `, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const getIsiSubGenre = (conn, idSG) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT music.judul, music.artis, music.durasi
      from music
      inner join sub_genre ON
      music.id_subG= sub_genre.id_subG     
      WHERE sub_genre.id_subG  = '${idSG}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};


const getSong = conn => {
  return new Promise((resolve, reject) => {
    conn.query
      (`SELECT judul, artis , durasi
          FROM music 
          LIMIT 5`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};

const getArtis =(conn, jdl) => {
  return new Promise((resolve, reject) => {
    conn.query
      (`SELECT *
          FROM music 
          WHERE judul = '${jdl}' `, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  });
};


const cekMembership = (conn, idU) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT *
      from user JOIN membership ON user.id = membership.id_user
      WHERE '${idU}' = membership.id_user`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getMembership = (conn, getType, getTglMulai, getTglAkhir, idU) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO membership (subscription, tanggal_mulai, tanggal_akhir, id_user)
       VALUE ('${getType}','${getTglMulai}', '${getTglAkhir}', '${idU}') `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};






const getIsiPlaylist = (conn, idP) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT music.judul, music.artis, music.durasi
      from music
      inner join isiplaylist ON
      music.id_musik = isiplaylist.id_musik
      inner join playlist ON
      isiplaylist.id_playlist = playlist.id_playlist
      WHERE playlist.id_playlist = '${idP}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

function getValue(event) {
  var getNama = event.target.getAttribute("getNama");
  console.log(getNama);
  // Gunakan nilai atribut untuk skrip lainnya di sini
}

const sPLaylist = (conn, searchBar) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT nama FROM playlist WHERE nama = '${searchBar}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sGenre = (conn, searchBarG) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT nama FROM genre WHERE nama = '${searchBarG}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sSubGenre = (conn, searchBarSG) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT nama FROM sub_genre WHERE nama = '${searchBarSG}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sSong = (conn, searchBarS) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT judul, artis, durasi FROM music WHERE judul = '${searchBarS}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sSongP = (conn, searchBarI) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT music.judul, music.artis, music.durasi
      from music
      inner join isiplaylist ON
      music.id_musik = isiplaylist.id_musik
      inner join playlist ON
      isiplaylist.id_playlist = playlist.id_playlist
      WHERE music.judul = '${searchBarI}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


app.get('/login', async (req, res) => {
  res.render('login')
});
app.get('/signup', async (req, res) => {
  res.render('signup')
});



app.get('/HomePage', async (req, res) => {
  const conn = await dbConnect();
  var nama = req.session.name;
  const idU = req.session.idU
  let dataSong = await getSong(conn);
  const searchBarS = req.query.search
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = await getArtis(conn, jdl)
  const statusMember = await cekMembership(conn, idU)
  let status = "";
  if (statusMember.length > 0) {
    status = "Membership"
  }
  else {
    status = "nonMembership"

  }
  if (searchBarS != undefined && searchBarS.length) {
    dataSong = await sSong(conn, searchBarS)
  }
  conn.release()
  res.render('HomePage', { dataSong, nama, searchBarS, status, ats });

});

app.get('/homepage-admin', async (req, res) => {
  res.render('homepage-admin')
});
app.get('/homepage-pimpinan', async (req, res) => {
  res.render('homepage-pimpinan')
});

app.get('/MemberPlaylist', async (req, res) => {
  const conn = await dbConnect();
  const nama = req.session.name; // Definisikan variabel 'nama' di sini
  let dataPlaylist = await getPlaylist(conn);
  const searchBar = req.query.search
  const idP = req.query.idP
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = await getArtis(conn, jdl)
  if (searchBar != undefined && searchBar.length) {
    dataPlaylist = await sPLaylist(conn, searchBar)
  }
  conn.release()
  res.render('MemberPlaylist', { dataPlaylist, nama, searchBar, idP, ats });

});

app.get('/isiPlaylist', async (req, res) => {
  const conn = await dbConnect()
  const idP = req.query.idP
  const nama = req.session.name;
  let dataIsiPlaylist = await getIsiPlaylist(conn, idP)
  const searchBarI = req.query.search
  console.log(dataIsiPlaylist)
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = await getArtis(conn, jdl)
  if (searchBarI != undefined && searchBarI.length) {
    dataIsiPlaylist = await sSongP(conn, searchBarI)
  }
  conn.release()
  res.render('isiPlaylist', { dataIsiPlaylist, nama, searchBarI, idP,ats });

});



app.get('/MemberGenre', async (req, res) => {
  const conn = await dbConnect()
  const nama = req.session.name;
  let dataGenre = await getGenre(conn)
  const searchBarG = req.query.search
  const idG = req.query.idG
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = await getArtis(conn, jdl)
  if (searchBarG != undefined && searchBarG.length) {
    dataGenre = await sGenre(conn, searchBarG)
  }
  conn.release()
  res.render('MemberGenre', { dataGenre, nama, searchBarG, idG,ats });

});

app.get('/subGenre', async (req, res) => {
  const conn = await dbConnect()
  const idG = req.query.idG
  const nama = req.session.name;
  let dataSubGenre = await getSubGenre(conn, idG)
  const searchBarSG = req.query.search
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = await getArtis(conn, jdl)
  if (searchBarSG != undefined && searchBarSG.length) {
    dataSubGenre = await sSubGenre(conn, searchBarSG)
  }
  conn.release()
  res.render('subGenre', { dataSubGenre, nama, searchBarSG, idG, ats });

});

app.get('/isiSubGenre', async (req, res) => {
  const conn = await dbConnect()
  const idSG = req.query.idSG
  const nama = req.session.name;
  let dataIsiSubGenre = await getIsiSubGenre(conn, idSG)
  const searchBarI = req.query.search
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = await getArtis(conn, jdl)
  if (searchBarI != undefined && searchBarI.length) {
    dataIsiSubGenre = await sSongP(conn, searchBarI)
  }
  conn.release()
  res.render('isiSubGenre', { dataIsiSubGenre, nama, searchBarI, idSG, ats });

});


app.get('/LikedSong', async (req, res) => {
  const conn = await dbConnect();
  const nama = req.session.name; // Definisikan variabel 'nama' di sini

  const searchBar = req.query.search
  const idP = req.query.idP
  const idU = req.session.idU
  let dataLikedSong = await getSong(conn, idU);
  console.log(nama)
  console.log(idU)
  if (searchBar != undefined && searchBar.length) {
    dataLikedSong = await sPLaylist(conn, searchBar)
  }
  conn.release()
  res.render('LikedSong', { dataLikedSong, nama, searchBar, idP, idU });

});

app.get('/MyPlaylist', async (req, res) => {
  const conn = await dbConnect();
  const nama = req.session.name; // Definisikan variabel 'nama' di sini

  const searchBar = req.query.search
  const idP = req.query.idP
  const idU = req.session.idU
  let dataMyPlaylist = await getMyPlaylist(conn, idU);
  console.log(nama)
  console.log(idU)
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = await getArtis(conn, jdl)
  if (searchBar != undefined && searchBar.length) {
    dataMyPlaylist = await sPLaylist(conn, searchBar)
  }
  conn.release()
  res.render('MyPlaylist', { dataMyPlaylist, nama, searchBar, idP, idU, ats });

});


app.get('/Membership', async (req, res) => {
  res.render('Membership')
});

app.get('/LanjutanMembership', async (req, res) => {
  res.render('lanjutanMembership')
});
app.get('/Lanjutan2Membership', async (req, res) => {
  res.render('Lanjutan2Membership')
});

app.get('/admin-displayMusic', async (req, res) => {
  res.render('admin-displayMusic')
});
app.get('/admin-displayMusic.ejs', async (req, res) => {
  res.render('admin-displayMusic')
});
app.get('/TambahGenre', async (req, res) => {
  res.render('TambahGenre')
});






app.post('/login', async (req, res) => {
  const conn = await dbConnect()
  const { username, password } = req.body;
  if (username.length > 0 && password.length > 0) {
    const dataUser = await getUser(conn, username, password)
    if (dataUser.length > 0) {
      req.session.name = dataUser[0].nama;
      req.session.idU = dataUser[0].id;
      req.session.role = dataUser[0].role
      var nama = req.session.name;
      const idU = req.session.idU
      const role = req.session.role
      const jdl = "Drown"
      const ats = await getArtis(conn, jdl)
      console.log(role)
      let dataSong = await getSong(conn);
      const searchBarS = ""
      const statusMember = await cekMembership(conn, idU)
      let status = "";
      if (statusMember.length > 0) {
        status = "Membership"
      }
      else {
        status = "nonMembership"
      }
      conn.release()

      if(role == "member"){
        res.render('HomePage', {dataSong, nama, searchBarS, status, ats })
      }
      else if(role == "admin"){
        res.render('homepage-admin')
      }
      else{
        res.render('homepage-pimpinan')
      }
      

    }
    else {
      res.render('login')
    }
  }
});

app.post('/admin-displayMusic', async (req, res) => {
  const conn = await dbConnect();

  try {
    const { musicTitle } = req.body;

    if (musicTitle) {
      await conn.query(`INSERT INTO music (title) VALUES ('${musicTitle}')`);
      res.redirect('/admin-displayMusic');
    } else {
      res.status(400).send('Invalid music title');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    conn.release();
  }
});

app.post('/signup', async (req, res) => {
  const conn = await dbConnect();
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (username.length > 0 && password.length > 0) {
    // Cek apakah username sudah digunakan sebelumnya
    const existingUser = await getUser(conn, username, password);

    if (existingUser.length > 0) {
      res.send('Username sudah digunakan. Silakan gunakan username lain.');
    } else {
      // Insert data user baru ke dalam database
      conn.query(
        `INSERT INTO user (username, password, nama, email, role) VALUES ('${username}', '${password}', '${name}', '${email}', 'member')`,
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error saat memasukkan data ke database');
          } else {
            res.redirect('/login');
          }
        }
      );
    }
  } else {
    res.status(400).send('Invalid username or password');
  }
});


app.get('/buyMembership/:getType', async (req, res) => {
  const conn = await dbConnect();
  const idU = req.session.idU
  const { getType } = req.params
  const date = new Date()
  let day = date.getDate().toString().padStart(2, '0'); // Mendapatkan hari (1-31)
  let month = date.getMonth() + 1; // Mendapatkan bulan (0-11), tambahkan 1 karena bulan dihitung mulai dari 0
  let year = date.getFullYear()
  console.log(date)
  console.log(day)
  console.log(getType)
  let jdl = req.query.jdl
  if(jdl == undefined){
    jdl ="Drown"
  }
  const ats = "BMTH"
  // if (day < 10) {
  //   day = "0" + day
  // }

  // if (month < 10) {
  //   month = "0" + month
  // }

  let tglAwal = year + "-" + month + "-" + day
  let tglAkhir = ""
  console.log(tglAwal)
  // const kuda = await getMembership(conn,getType, getTglMulai, getTglAkhir, idU)
  if (getType == '1month') {
    let monthFinal = parseInt(month) + 1
    date.setMonth(monthFinal - 1)
    console.log(date)
    console.log(monthFinal)
    day = date.getDate(date)
    month = date.getMonth(date) + 1
    year = date.getFullYear(date)

    tglAkhir = year + "-" + month + "-" + day
  }

  if (getType == '3month') {

    let monthFinal = parseInt(month) + 3
    date.setMonth(monthFinal - 1)
    console.log(date)
    console.log(monthFinal)
    day = date.getDate(date)
    month = date.getMonth(date) + 1
    year = date.getFullYear(date)

    tglAkhir = year + "-" + month + "-" + day
  }

  if (getType == '6month') {

    let monthFinal = parseInt(month) + 6
    date.setMonth(monthFinal - 1)
    console.log(date)
    console.log(monthFinal)
    day = date.getDate(date)
    month = date.getMonth(date) + 1
    year = date.getFullYear(date)

    tglAkhir = year + "-" + month + "-" + day
  }

  if (getType == '1year') {

    let yearFinal = parseInt(year) + 1
    date.setFullYear(yearFinal - 1)
    console.log(date)
    console.log(yearFinal)
    day = date.getDate(date)
    month = date.getMonth(date) + 1
    year = date.getFullYear(date) + 1

    tglAkhir = year + "-" + month + "-" + day
  }

  console.log(tglAkhir)
  
  const inputN = await getMembership(conn, getType, tglAwal, tglAkhir, idU);
  res.redirect('/HomePage')
});

app.post('/TambahGenre', async (req, res) => {
  try {
    const conn = await dbConnect();
    const name = req.body.name;
    console.log(name);
    conn.query(
      `INSERT INTO genre (nama) VALUES ('${name}')`, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error while inserting data into the database');
      } else {
        res.redirect('/TambahGenre');
      }
    });
  } catch (err) {
    
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});



app.post('/TambahSubGenre', async (req, res) => {
  try {
    const conn = await dbConnect();
    const name = req.body.name;
    const genre = req.body.genre;

    const query = `INSERT INTO sub_genre (nama, id_genre) VALUES ('${name}', ${genre})`;

    conn.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error while inserting data into the database');
      } else {
        res.redirect('/TambahSubGenre');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});


const getListGenre = conn => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM genre', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
app.get('/TambahSubGenre', async (req, res) => {
  try {
    const conn = await dbConnect();
    const nama = req.session.name;
    const dataListGenre = await getListGenre(conn);

    console.log(dataListGenre); // Cetak dataListGenre untuk memeriksa datanya

    const selectedValue = req.query.genre;
    console.log(selectedValue + "asda");
    res.render('TambahSubGenre', { dataListGenre, nama });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});
app.get('/TambahMusic', async (req, res) => {
  try {
    const conn = await dbConnect();
    const nama = req.session.name;
    const dataListSubGenre = await getListSubGenre(conn);

    console.log(dataListSubGenre); // Cetak dataListSubGenre untuk memeriksa datanya

    res.render('TambahMusic', { dataListSubGenre, nama });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});

const getListSubGenre = conn => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM sub_genre', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

app.post('/TambahMusic', async (req, res) => {
  try {
    const conn = await dbConnect();
    const judul = req.body.judul;
    const artis = req.body.artis;
    const durasi = req.body.durasi;
    const subgenre = req.body.subgenre;
    console.log(subgenre + "asdasd")
    const query = `INSERT INTO music (judul, artis, durasi, id_subG) VALUES ('${judul}', '${artis}', '${durasi}', ${subgenre})`;

    conn.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error while inserting data into the database');
      } else {
        res.redirect('/TambahMusic');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to the database');
  }
});

const getMemberships = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM membership', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

app.get('/monthly-pimpinan', async (req, res) => {
  const conn = await dbConnect();

  try {
    const Membership = await getMemberships(conn);
    res.render('monthly-pimpinan', { Membership });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    conn.release();
  }
});

const getPlaybackTransaction = (conn) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT user.nama, music.judul, genre.nama as genrename, sub_genre.nama as sub_genrename
    FROM playback_transaction
    JOIN music ON playback_transaction.id_musik = music.id_musik
    JOIN sub_genre ON music.id_subG = sub_genre.id_subG
    JOIN genre ON sub_genre.id_genre = genre.id_genre
    JOIN user ON playback_transaction.id_user = user.id`;

    conn.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

app.get('/music-playback', async (req, res) => {
  const conn = await dbConnect();

  try {
    const playback_transaction = await getPlaybackTransaction(conn);
    console.log(playback_transaction)
    res.render('music-playback', { playback_transaction });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    conn.release();
  }
});

const getStatisticSong = (conn) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT  music.judul, COUNT (playback_transaction.id_musik) as totalplay
    FROM playback_transaction
    JOIN music ON playback_transaction.id_musik = music.id_musik
    GROUP BY music.judul
    ORDER BY totalplay DESC
    LIMIT 5`;
    
    conn.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


app.get('/playback_transaction_status_song', async (req, res) => {
  const conn = await dbConnect();

  try {
    const getSong = await getStatisticSong(conn);
    console.log(getSong)
    res.render('playback_transaction_status_song', {  getSong });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    conn.release();
  }
});

const getStatisticSubGenre = (conn) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT  sub_genre.nama, COUNT (playback_transaction.id_musik) as totalplay
    FROM playback_transaction
    JOIN music ON playback_transaction.id_musik = music.id_musik
    JOIN sub_genre ON music.id_subG= sub_genre.id_subG
    GROUP BY sub_genre.nama
    ORDER BY totalplay DESC
    LIMIT 5`;
    
    conn.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

app.get('/playback_transaction_status_subgenre', async (req, res) => {
  const conn = await dbConnect();

  try {
    const getSubGenre = await getStatisticSubGenre(conn);
    console.log(getSubGenre)
    res.render('playback_transaction_status_subgenre', {  getSubGenre });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    conn.release();
  }
});

const getStatisticGenre = (conn) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT genre.nama, COUNT (playback_transaction.id_musik) as totalplay
    FROM playback_transaction
    JOIN music ON playback_transaction.id_musik = music.id_musik
    JOIN sub_genre ON music.id_subG= sub_genre.id_subG
    JOIN genre ON sub_genre.id_genre = genre.id_genre
    GROUP BY genre.nama
    ORDER BY totalplay DESC
    LIMIT 5`;
    
    conn.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

app.get('/playback_transaction_status_genre', async (req, res) => {
  const conn = await dbConnect();

  try {
    const getGenre = await getStatisticGenre(conn);
    console.log(getGenre)
    res.render('playback_transaction_status_genre', {  getGenre });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    conn.release();
  }
});