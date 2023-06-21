import path from 'path'
import  express from 'express'
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
app.listen(port, ()=>{
    console.log(`Port ${port} is ready`)
})

const durasi = 1000 * 60 * 60 * 1;

app.use(session({
    secret: 'secret',
    resave: true,
    cookie: {maxAge : durasi},
    saveUninitialized: true
}));


app.set('view engine', 'ejs')
app.use(express.static(path.resolve('public')));
app.use(express.urlencoded({extended: true}));

const dbConnect = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if(err){
                reject(err);
            } else{
                resolve(conn);
            }
        });
    });
};

const getUser = (conn, username, password) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`, (err, result) => {
            if(err){
                reject(err);
            } else{
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
  

const getGenre = conn => {
    return new Promise((resolve, reject) => {
        conn.query
        (`SELECT *
          FROM genre `, (err, result) => {
            if(err){
                reject(err);
            } else{
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
          if(err){
              reject(err);
          } else{
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


const getSong= conn => {
    return new Promise((resolve, reject) => {
        conn.query
        (`SELECT judul, artis , durasi
          FROM music 
          LIMIT 5`, (err, result) => {
            if(err){
                reject(err);
            } else{
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

const getMembership = (conn,getType, getTglMulai, getTglAkhir, idU) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO membership (subscription, tanggal_awal, tanggal_akhir, id_user)
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

const sPLaylist= (conn, searchBar) => {
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

const sGenre= (conn, searchBarG) => {
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

const sSubGenre= (conn, searchBarSG) => {
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

const sSong= (conn, searchBarS) => {
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

const sSongP= (conn, searchBarI) => {
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


app.get('/login',async (req,res) =>{
    const conn = await dbConnect()
    var nama = req.session.name
    res.render('login')
});
app.get('/signup',async (req,res) =>{
    res.render('signup')
});
app.get('/HomePage',async (req,res) =>{
    const conn = await dbConnect();
    var nama = req.session.name;
    let dataSong = await getSong(conn);
    const searchBarS = req.query.search
    if(searchBarS != undefined && searchBarS.length){
        dataSong= await sSong(conn, searchBarS)
    }
    
    res.render('HomePage', { dataSong, nama, searchBarS });
    
});

app.get('/homepage-admin',async (req,res) =>{
    res.render('homepage-admin')
});
app.get('/homepage-pimpinan',async (req,res) =>{
    res.render('homepage-pimpinan')
});

app.get('/MemberPlaylist', async (req, res) => {
    const conn = await dbConnect();
    const nama = req.session.name; // Definisikan variabel 'nama' di sini
    let dataPlaylist = await getPlaylist(conn);
    const searchBar = req.query.search
    const idP = req.query.idP
    if(searchBar != undefined && searchBar.length){
        dataPlaylist = await sPLaylist(conn, searchBar)
    }

    res.render('MemberPlaylist', { dataPlaylist, nama, searchBar,idP });
    
});

app.get('/isiPlaylist',async (req,res) =>{
  const conn = await dbConnect()
  const idP = req.query.idP
  const nama = req.session.name; 
  let dataIsiPlaylist = await getIsiPlaylist(conn, idP)
  const searchBarI = req.query.search
  console.log(dataIsiPlaylist)
  if(searchBarI != undefined && searchBarI.length){
      dataIsiPlaylist = await sSongP(conn, searchBarI)
  }
  
  res.render('isiPlaylist', { dataIsiPlaylist, nama, searchBarI,idP});
  
});



app.get('/MemberGenre',async (req,res) =>{
    const conn = await dbConnect()
    const nama = req.session.name; 
    let dataGenre = await getGenre(conn)
    const searchBarG = req.query.search
    const idG = req.query.idG
    if(searchBarG != undefined && searchBarG.length){
        dataGenre = await sGenre(conn, searchBarG)
    }
    res.render('MemberGenre', { dataGenre, nama, searchBarG, idG });
    
});

app.get('/subGenre',async (req,res) =>{
  const conn = await dbConnect()
  const idG = req.query.idG
  const nama = req.session.name; 
  let dataSubGenre = await getSubGenre(conn, idG)
  const searchBarSG = req.query.search
  if(searchBarSG != undefined && searchBarSG.length){
    dataSubGenre = await sSubGenre(conn, searchBarSG)
  }
  
  res.render('subGenre', { dataSubGenre, nama, searchBarSG,idG});
  
});

app.get('/isiSubGenre',async (req,res) =>{
  const conn = await dbConnect()
  const idSG = req.query.idSG
  const nama = req.session.name; 
  let dataIsiSubGenre = await getIsiSubGenre(conn, idSG)
  const searchBarI = req.query.search
  if(searchBarI != undefined && searchBarI.length){
    dataIsiSubGenre = await sSongP(conn, searchBarI)
  }
  
  res.render('isiSubGenre', { dataIsiSubGenre, nama, searchBarI,idSG});
  
});


app.get('/Membership',async (req,res) =>{
    res.render('Membership')
});

app.get('/LanjutanMembership',async (req,res) =>{
    res.render('lanjutanMembership')
});
app.get('/Lanjutan2Membership',async (req,res) =>{
    res.render('Lanjutan2Membership')
});

app.get('/admin-displayMusic',async (req,res) =>{
    res.render('admin-displayMusic')
});
app.get('/admin-displayMusic.ejs',async (req,res) =>{
    res.render('admin-displayMusic')
});
 





app.post('/login',async (req,res) =>{
    const conn = await dbConnect()
    const { username, password } = req.body;
    if(username.length > 0 && password.length > 0){
        const dataUser = await getUser(conn, username, password)
        if(dataUser.length > 0){
            req.session.name = dataUser[0].nama;
            req.session.idU = dataUser[0].id;
            res.redirect('/HomePage')
        }
        else{
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
  const getMyMusicData = (conn) => {
    return new Promise((resolve, reject) => {
      conn.query('SELECT * FROM my_music_data', (err, result) => {
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
      const myMusicData = await getMyMusicData(conn);
      res.render('music-playback', { myMusicData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      conn.release();
    }
  });
    const getMusicData = (conn) => {
    return new Promise((resolve, reject) => {
      conn.query('SELECT * FROM music_data', (err, result) => {
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
      const musicData = await getMusicData(conn);
      res.render('monthly-pimpinan', { musicData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      conn.release();
    }
  });
  app.get('/playback-graph-transaction', async (req, res) => {
    const conn = await dbConnect();
    try {
      const musicData = await getMusicData(conn);
      res.render('playback-graph-transaction', { musicData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      conn.release();
    }
  });
  app.get('/playback-graph-topsong', async (req, res) => {
    const conn = await dbConnect();
    try {
      const myMusicData = await getMyMusicData(conn);
      res.render('playback-graph-topsong', { myMusicData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      conn.release();
    }
  });
  app.get('/playback-graph-topgenre', async (req, res) => {
    const conn = await dbConnect();
    try {
      const myMusicData = await getMyMusicData(conn);
      res.render('playback-graph-topgenre', { myMusicData });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      conn.release();
    }
  });
  app.get('/playback-graph-topsubgenre', async (req, res) => {
    const conn = await dbConnect();
    try {
      const myMusicData = await getMyMusicData(conn);
      res.render('playback-graph-topsubgenre', { myMusicData });
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
          `INSERT INTO user (username, password, name, email) VALUES ('${username}', '${password}', '${name}', '${email}')`,
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
    const idU = req.session.id
    const {getType} = req.params
    const date = new Date()
    let day = date.getDate(); // Mendapatkan hari (1-31)
    let month = date.getMonth() + 1; // Mendapatkan bulan (0-11), tambahkan 1 karena bulan dihitung mulai dari 0
    let year = date.getFullYear()

    if(day < 10){
      day = "0" + day
    }

    if(month < 10){
      month = "0" + month
    }

    const tglAwal = year + "-" + month + "-" + day 
    // const kuda = await getMembership(conn,getType, getTglMulai, getTglAkhir, idU)
    if(getType == '1month'){
      
       
      
      console.log(tglAwal)
    }
    
    
  });



