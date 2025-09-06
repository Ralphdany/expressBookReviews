const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user. Please provide username and password" });
})



// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    const getBooks = new Promise((resolve, reject) => {
        if (!books) {
            reject(new Error("No books found"))
        }
        resolve(books)
    })

    getBooks.then(bookList => {
        return res.status(200).json(bookList);
    }).catch(err => {
        return res.status(403).json({ message: err.message })
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;

    const getBookByISBN = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (!book) {
            reject(new Error("Book not found"));
        }
        resolve(book);
    });

    getBookByISBN
        .then(book => {
            return res.status(200).json(book);
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const authorBook = keys.find(key => books[key].author === author);
        if (!authorBook) {
            reject(new Error("No books found for this author"));
        }
        resolve(books[authorBook]);
    });

    getBooksByAuthor
        .then(book => {
            return res.status(200).json(book);
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});
// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const book = keys.find(key => books[key].title === title);
        if (!book) {
            reject(new Error("No books found with this title"));
        }
        resolve(books[book]);
    });

    getBooksByTitle
        .then(book => {
            return res.status(200).json(book);
        })
        .catch(error => {
            return res.status(404).json({ message: error.message });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const { isbn } = req.params
    const reviews = books[isbn].reviews

    return res.status(200).json(reviews);
});

module.exports.general = public_users;
