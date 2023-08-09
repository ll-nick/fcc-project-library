
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String] },
});

const Book = mongoose.model('Book', bookSchema);

class DBWrapper {

  constructor(uri) {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to database");
  }

  async saveNewBook(title) {

    if (!title) throw new Error('missing required field title')

    const newBook = new Book({
      title: title
    });

    await newBook.save();
    return newBook;

  }

  async getBook(id) {
    let book = await Book.findOne({ _id: id });
    if (!book) throw new Error('no book exists');

    return book;
  }

  async getAllBooksCommentCount() {
    let books = await Book.find();
    books = books.map((book) => ({
      _id: book._id,
      title: book.title,
      commentcount: book.comments.length
    }))

    return books
  }

  async addComment(id, comment) {
    if (!comment) throw new Error('missing required field comment');

    let updatedBook = await Book.findOneAndUpdate(
      { _id: id },
      { $push: { comments: comment } },
      { new: true }
    );
    if (!updatedBook) throw new Error('no book exists');

    return updatedBook;
  }

  async deleteBook(id) {
    let book = await Book.findOneAndDelete({ _id: id });
    if (!book) throw new Error('no book exists')
  }

  async deleteAllBooks() {
    await Book.deleteMany();
  }
}

module.exports = DBWrapper;