require('dotenv').config()
const express = require("express");
const Persons = require('./models/persons')
const morgan = require("morgan");
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();

//json perser
app.use(express.json());
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))



const generateId = () => {
  return Math.floor(Math.random() * 256);
};


const date = new Date();
app.get("/info", (request, response) => {
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  response.send(`<div>
    <p>Phonebooss has info for ${persons.length}</p>
    <p>${currentDate} ${timeZone}</p>
    </div>`);
});



app.get("/api/persons", (request, response) => {
  Persons.find({}).then((persons)=> {
    response.json(persons)
  })
});

app.get("/api/persons/:id", (request, response) => {

  Persons.findById(request.params.id).then((person)=> {
    response.json(person)
  })
});
app.delete("/api/persons/:id", (request, response) => {
  // let id = Number(request.params.id);
  // persons = persons.filter((person) => person.id !== id);
  // response.status(204).end();
  Persons.findByIdAndDelete(request.params.id).then((person)=> {
    response.status(204).end()
  })
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log({body})
    if(!body.name || !body.number){
      return response.status(400).json({
        error: "Name or number is missing"
      })
    }
    const person = new Persons({
        name: body.name,
        number: body.number
      })
      person.save().then((savedNote)=> {
        console.log(savedNote)
        response.json(savedNote)
      })

    
  // let personObject = persons.find((person) => person.name === body.name);
  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "Name or Nummber missing",
  //   });
  // } else if (personObject) {
  //   return response.status(400).json({
  //     error: "Name already exist, Name must be unique",
  //   });
  // } else {
  //   const newPerson = {
  //     name: body.name,
  //     number: body.number,
  //     id: generateId(),
  //   };
  //   persons = persons.concat(newPerson);
  //   response.json(persons);
  // }
});

console.log({Persons})

const PORT = process.env.PORT;
app.listen(3001, () => {
  console.log(`Server is running on port ${PORT}`);
});

