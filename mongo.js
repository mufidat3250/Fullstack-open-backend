require('dotenv').config()
const mongoose = require('mongoose')

// const {argv} = require('process')
// if(process.argv.length < 3){
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = argv[2]
const url = `mongodb+srv://mufidah:iyanu3250@cluster0.be3ep0l.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

mongoose.set('strictQuery', false)
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

// phonebookSchema.set('toJSON', {
//   transform: (document, returedObject) => {
//       returedObject.id = returedObject._id.toString()
//       delete returedObject._id
//       delete returedObject.__v
//   }
// })

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Phonebook = mongoose.model('Person', phonebookSchema)

// const phonebook = new Phonebook({
//   name: argv[3],
//   number: argv[4]
// })

// phonebook.save().then((result)=> {
//   console.log(`Added ${result.name} ${result.number} to phonebook`)
//   mongoose.connection.close()
// })


Phonebook.find({}).then((person)=> {
  console.log(person)
  mongoose.connection.close()
})


