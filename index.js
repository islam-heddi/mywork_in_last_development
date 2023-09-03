const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const IndexMyElement = (arr , element) => {
    var index = 0;
    while(arr[0].email != undefined ){
        if(arr[index].email == element) return index;
        index ++;
    }
    return -1;
}

const FindEmail = (arr, email) => {
    var index = 0;
    while(arr[index].email != undefined) {
        if(arr[index].email == email) return true;
        index++;
    }
    return false;
}

/*app.get('/api/users/random', (req, res) => {
    const randomPub = news[Math.floor(Math.random() * news.length)];

    return res.status(200).json({
        randomPub
    })
});*/

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.get('/users', cors(), (req, res, next) => {
    res.send(users);
});

let rawdata = fs.readFileSync('./db/users.json');
const users = JSON.parse(rawdata);
// console.log(users);

let rawdata1 = fs.readFileSync('./db/news.json');
const news = JSON.parse(rawdata1);

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"public")));

const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.render("index");
});

app.get('/login', (req,res) => {
    res.render("login");
});

app.get('/register', (req,res) => {
    res.render("register");
});

app.post('/register', (req,res) => {
    const {username , password , email} = req.body;
    users.push({
        username,
        password,
        email
    });
    console.log(users);
    res.redirect("/login");
});

var email_index = 0;
var username = users[email_index].username;
app.get('/main', (req,res) => {
    res.render("main", {
        name : users[email_index].username,
        data : news
    });
});

app.get('/wrong', (req,res) => {
    res.send("please fill the all");
});

app.post('/login', (req,res) => {
    const {email , password} = req.body;
    if(email == "" || password == ""){
       return res.redirect("/wrong");
    }else{
        const IsExisted = FindEmail(users, email);
        console.log("is Existed : " + IsExisted);
        const index = IndexMyElement(users,email);
        console.log("email index : "+index);
        if(IsExisted && password == users[index].password) {
            email_index = index;
            username = users[index].name;
            res.redirect("main");
        }else{
            res.redirect("login");
        }
    }
    
}); 

app.post('/main',(req,res) => {
    const { news_post } = req.body;
    const publish = news_post;
    let name = username;
    news.push({
        name,
        publish
    });
    console.log(news);
    res.redirect('/main');
});

app.listen(PORT, () => {
    console.log(`Your server is running on ${PORT}`);
});