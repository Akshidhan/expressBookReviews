const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(isValid(username)){
            users.push({"username": username, "password": password});
            return res.status(200).json("User successfully registered!");
        } else {
            return res.status(404).json("Username not valid!");
        }
    } else {
        return res.status(404).json("The username and/or password are blank");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((bookList) => {
            res.send(JSON.stringify(bookList));
        })
        .catch((err) => {
            res.status(500).json({ message: "Error retrieving books." });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let getBooks = new Promise((resolve, reject) => {
        resolve(books[isbn]);
    });

    getBooks
        .then((bookList) => {
            res.send(bookList);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error retrieving books." });
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    const matchedBooks = Object.entries(books).filter(([id, book]) => {
        return book.author === author;
    });

    let getBooks = new Promise((resolve, reject) => {
        resolve(matchedBooks);
    });

    getBooks
        .then((bookList) => {
            res.send(bookList);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error retrieving books." });
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const matchedBooks = Object.entries(books).filter(([id, book]) => {
      return book.title === title;
    });
  
    let getBooks = new Promise((resolve, reject) => {
        resolve(matchedBooks);
    });

    getBooks
        .then((bookList) => {
            res.send(bookList);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error retrieving books." });
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
