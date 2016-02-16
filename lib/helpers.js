var Promise = require('bluebird');
var knex = require('../db/knex');

function Authors() {
  return knex('authors');
}

function Books(){
  return knex('books');
}

function Authors_Books() {
  return knex('authors_books');
}

function prepIds(ids) {
  return ids.filter(function (id) {
    return id !== '';
  })
}

function flattenArray(array) {
  return array.reduce(function (a, b) {
    return a.concat(b)
  }, []);
}

function insertIntoAuthorsBooks(bookIds, table, authorId) {
  bookIds = prepIds(bookIds);
  return Promise.all(bookIds.map(function (book_id) {
    book_id = Number(book_id)
    return table().insert({
      book_id: book_id,
      author_id: authorId
    })
  }))
}

function getAuthorBooks(author) {
  return Authors_Books().where('author_id', author.id).then(function (records) {
    return Promise.all(records.map(function (record) {
      return Books().where('id', record.book_id)
    })
  ).then(function (results) {
    return flattenArray(results);
    });
  })
}

function getBookAuthors(book) {
  return Authors_Books().where('book_id', book.id).then(function (records) {
    return Promise.all(records.map(function (record) {
      return Authors().where('id', record.author_id)
    })
    ).then(function (results) {
      return flattenArray(results);
    });
  })
}



module.exports = {
  prepIds: prepIds,
  flattenArray: flattenArray,
  insertIntoAuthorsBooks: insertIntoAuthorsBooks,
  getAuthorBooks: getAuthorBooks,
  getBookAuthors: getBookAuthors
}
