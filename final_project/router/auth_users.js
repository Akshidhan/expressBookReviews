const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let checkUsername = users.filter((user) => user.username === username);

    if(checkUsername.length > 1){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username && !password){
        return res.status(404).json({message: "The username or password is blank!"});
    }
  
    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(404).send("Invalid credentials!");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "The ISBN number is invalid!" });
    }

    const username = req.session.authorization.username;
    const review = req.query.review;

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Book review has been added!" }); 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "The ISBN number is invalid!" });
    }

    const username = req.session.authorization.username;

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Book review has been deleted!" });
    } else {
        return res.status(404).json({ message: "No review found to delete for this user!" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
