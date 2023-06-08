import path from 'path'
import  express from 'express'
import mysql from 'mysql';
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
        (`SELECT judul 
          FROM music JOIN isiPlaylist ON music.id_musik = isiPlaylist.id_musik 
          WHERE id_playlist = 1  `, (err, result) => {
            if(err){
                reject(err);
            } else{
                resolve(result);
            }
        });
    });
};

app.get('/login',async (req,res) =>{
    res.render('login')
});
app.get('/signup',async (req,res) =>{
    res.render('signup')
});
app.get('/HomePage',async (req,res) =>{
    res.render('HomePage')
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

app.post('/login',async (req,res) =>{
    const conn = await dbConnect()
    const { username, password } = req.body;
    if(username.length > 0 && password.length > 0){
        const dataUser = await getUser(conn, username, password)
        if(dataUser.length > 0){
            res.render('HomePage')
        }
        else{
            res.render('login')
        }
    }
});

