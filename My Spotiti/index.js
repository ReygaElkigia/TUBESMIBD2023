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
        (`SELECT playlist.nama
          FROM playlist JOIN user ON playlist.id_user = user.id
           `, (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        });
    });
};


const getProfile = conn => {
    return new Promise((resolve, reject) => {
        conn.query
        (`SELECT nama
          FROM user 
          WHERE username = '${username}'`, 
          (err, result) => {
            if(err){
                reject(err);
            } else{
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
    var nama = req.session.name;
    res.render('HomePage', {nama})
    console.log(nama)
});
app.get('/homepage-admin',async (req,res) =>{
    res.render('homepage-admin')
});
app.get('/homepage-pimpinan',async (req,res) =>{
    res.render('homepage-pimpinan')
});
app.get('/MemberPlaylist',async (req,res) =>{
    const conn = await dbConnect()
    let dataPlaylist = await getPlaylist(conn)
    res.render('MemberPlaylist', {dataPlaylist})
});
app.get('/MemberGenre',async (req,res) =>{
    res.render('MemberGenre')
});
app.get('/Membership',async (req,res) =>{
    res.render('Membership')
});
<<<<<<< Updated upstream
app.get('/admin-displayMusic',async (req,res) =>{
    res.render('admin-displayMusic')
});
app.get('/admin-displayMusic.ejs',async (req,res) =>{
    res.render('admin-displayMusic')
});
=======
app.get('/LanjutanMembership',async (req,res) =>{
    res.render('LanjutanMembership')
});
app.get('/Lanjutan2Membership',async (req,res) =>{
    res.render('Lanjutan2Membership')
});

>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======


>>>>>>> Stashed changes
