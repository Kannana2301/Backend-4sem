const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/posts', (req, res) => {
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading posts file');
        const posts = JSON.parse(data);
        res.render('home', { posts });
    });
});

app.get('/post', (req, res) => {
    const postId = req.query.id;
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading posts file');
        const posts = JSON.parse(data);
        const post = posts.find(p => p.id == postId);
        if (!post) return res.status(404).send('Post not found');
        res.render('post', { post });
    });
});

app.get('/add-post', (req, res) => {
    res.render('addPost');
});

app.post('/add-post', (req, res) => {
    const { title, content } = req.body;
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading posts file');
        let posts = JSON.parse(data);
        const newPost = { id: posts.length + 1, title, content };
        posts.push(newPost);
        fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving post');
            res.redirect('/posts');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
