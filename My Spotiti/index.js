import path from 'path'
import  express from 'express'
import mysql from 'mysql';
import session from 'express-session';
import { render } from 'ejs';

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
            (`SELECT nama
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
        (`SELECT nama
          FROM genre `, (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        });
    });
};

const getSong= conn => {
    return new Promise((resolve, reject) => {
        conn.query
        (`SELECT judul, artis , durasi
          FROM music `, (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        });
    });
};

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
    console.log(searchBarS);
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
    if(searchBar != undefined && searchBar.length){
        dataPlaylist = await sPLaylist(conn, searchBar)
    }
    console.log(searchBar);
    res.render('MemberPlaylist', { dataPlaylist, nama, searchBar });
    
});

app.get('/MemberGenre',async (req,res) =>{
    const conn = await dbConnect()
    const nama = req.session.name; 
    let dataGenre = await getGenre(conn)
    const searchBarG = req.query.search
    if(searchBarG != undefined && searchBarG.length){
        dataGenre = await sGenre(conn, searchBarG)
    }
    res.render('MemberGenre', { dataGenre, nama, searchBarG });
    
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

