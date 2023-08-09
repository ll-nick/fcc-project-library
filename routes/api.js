/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config();
const DBWrapper = require('../db-wrapper');

let dbWrapper = new DBWrapper(process.env.MONGO_URI);

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        let books = await dbWrapper.getAllBooksCommentCount()

        res.json(books)
      } catch (err) {
        res.send(err.message)
      }
    })

    .post(async (req, res) => {
      let title = req.body.title

      try {
        let newBook = await dbWrapper.saveNewBook(title);

        res.json({
          _id: newBook._id,
          title: newBook.title
        });
      } catch (err) {
        res.send(err.message);
      }
    })

    .delete(async (req, res) => {
      try {
        await dbWrapper.deleteAllBooks();

        res.send('complete delete successful');
      } catch (err) {
        res.send(err.message);
      }
    });


  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;

      try {
        let book = await dbWrapper.getBook(bookid);

        res.json(book);
      } catch (err) {
        res.send(err.message);
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      try {
        let updatedBook = await dbWrapper.addComment(bookid, comment)

        res.json(updatedBook)
      } catch (err) {
        res.send(err.message)
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;

      try {
        await dbWrapper.deleteBook(bookid)

        res.send('delete successful')
      } catch (err) {
        res.send(err.message)
      }
    });

};
