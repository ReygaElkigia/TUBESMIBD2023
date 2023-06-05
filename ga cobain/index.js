import path from 'path'
import  Express from 'express'

const port = 8080;
const app = Express();
app.listen(port, ()=>{
    console.log(`gasta bau memek ${port} is ready`)
})

app.set('view engine', 'ejs')
app.use(Express.static(path.resolve('public')));

app.get('/login',async (req,res) =>{
    res.render('login')
});

app.get('/HomePage',async (req,res) =>{
    res.render('HomePage')
});