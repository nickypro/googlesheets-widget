const express = require('express');
const path = require('path');
const app = express();
const config = require('./config/sheets.json')

const getLibraryBooks = require('./functions/getLibraryBooks')

const now = () => new Date().getHours() + ":" + new Date().getMinutes();	 

/* use Express */
app.use(express.static(path.join(__dirname, 'build')));

//test connection works
app.get('/ping', (req, res) => {
 return res.send( new Date() );
});

/* get library books from google sheets */
app.get('/api/books', async (req, res) => {
  console.log(now(), "Getting Books")
  let books = await getLibraryBooks(config)
  res.send(books)
})

//send the react app to normal pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/:page', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(process.env.PORT || 80);