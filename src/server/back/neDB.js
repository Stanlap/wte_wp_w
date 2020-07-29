const Datastore = require('nedb-promises')
const usersDB = Datastore.create('./db.db')
const bcrypt = require('bcryptjs');

module.exports.usersDB = usersDB;
// const salt = bcrypt.genSaltSync(10);

// const userDB = {
//     id: 1,
//     email: 'st1@st',
//     password: bcrypt.hashSync('123', salt)

// }

// usersDB.insert(userDB)
// .then(function(docs) {
//     console.log('New user has created');
// })
// .catch(function(error) {});


// usersDB.findOne({ email: 'st1@st'})
// .then(function(doc) {
//  su = bcrypt.compareSync("123", doc.password);    
//     console.log(su);
//   })
//   .catch(function(error) {})
