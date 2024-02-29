require("dotenv").config();
const express = require("express");
const Persons = require("./models/persons");
const morgan = require("morgan");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();

const requestLogger = () => {
  return morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  });
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    response.status("400").send({
      error: "Malformed Id",
    });
  }
  next(error);
};
//json perser

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(requestLogger());

//id generated from the back end
// const generateId = () => {
//   return Math.floor(Math.random() * 256);
// };

const date = new Date();
app.get("/info", (request, response, next) => {
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  Persons.find({}).then((persons)=> {
    response.send(`<div>
    <p>Phonebooss has info for ${persons.length}</p>
    <p>${currentDate} ${timeZone}</p>
    </div>`);
  }).catch((error)=> next(error))
});

app.get("/api/persons", (request, response, next) => {
  Persons.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  Persons.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});
app.delete("/api/persons/:id", (request, response, next) => {
  Persons.findByIdAndDelete(request.params.id)
    .then((person) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).send({
      error: "Name or number is missing",
    });
  }
  const person = new Persons({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));

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

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Persons.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatePerson) => {
      response.json(updatePerson);
    })
    .catch((error) => next(error));
});

console.log({ Persons });

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(3001, () => {
  console.log(`Server is running on port ${PORT}`);
});
