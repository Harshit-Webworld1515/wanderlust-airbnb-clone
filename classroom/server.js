const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));gi


const sessionOption = {
    secret: "mysupersecretkey",   // encryption key
    resave: false,
    saveUninitialized: true,
}
// session middleware
app.use(session(sessionOption));
// flash middleware
app.use(flash());

app.get("/register", (req, res) => {
    let { username="Ajay", password } = req.query;//default hai ajay
    if (username && password) {
        console.log(`username: ${username}, password: ${password}`);
        req.session.username = username;
        req.session.password = password;
        console.log(req.session.username);
        console.log("Registration successful! for `" + username + "`");
        req.flash("success", "Registration successful!");
        res.redirect("/hello");
    }
    else {
        req.flash("error", "Please provide username and password");
        res.redirect("/hello");
    }
});
//3rd alternative way to flash message
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.get("/hello", (req, res) => {
    // console.log(req.flash("success"));
    // console.log(req.flash("error"));
    //2nd alternative way to flash message
    // res.locals.success = req.flash("success");
    // res.locals.error = req.flash("error");
    res.render("page.ejs", { username: req.session.username });
});

// app.get("/request-count", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You send request ${req.session.count} Times`);
// });
app.get("/test", (req, res) => {
    res.send("This is a test route");
});











// const cookieParser = require("cookie-parser");
// // ===============================================

// app.use(cookieParser("secretcode"));

// // ===============================================


// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "usa", {signed: true});
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// // ===============================================


// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.cookie("madeIn", "usa");
//     res.send("sent you some cookies!");
// });

// // ===============================================

// app.get("/greet", (req, res) => {
//     let { name = "anonymous" } = req.cookies;
//     res.send(`hello, ${name}`);
// });


// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, this is root!");
// });

// // ===============================================

app.use("/users", users);
app.use("/posts", posts);


// ===============================================

app.listen(3000, () => {
    console.log("server is listening to 3000");
});
