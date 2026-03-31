const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");

const sessionOption = {
    secret: "mysupersecretkey",   // encryption key
    resave: false,
    saveUninitialized: true,
}
// session middleware
app.use(session(sessionOption));

app.get("/register", (req, res) => {
    let { username="Ajay", password } = req.query;//default hai ajay
    if (username && password) {
        console.log(`username: ${username}, password: ${password}`);
        req.session.username = username;
        req.session.password = password;
        console.log(req.session.username);
        res.send("Registration successful! for `" + username + "`");
    }
    else {
        res.send("Please provide username and password");
    }
});
app.get("/hello", (req, res) => {
    res.send("Hello, World from " + req.session.username);
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
