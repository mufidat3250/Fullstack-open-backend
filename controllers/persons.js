
const Persons = require("../models/persons")

const getInfo =  (request, response, next) => {
    const currentDate = new Date().toLocaleString()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    Persons.find({})
        .then((persons) => {
            response.send(`<div>
    <p>Phonebooss has info for ${persons.length}</p>
    <p>${currentDate} ${timeZone}</p>
    </div>`)
        })
        .catch((error) => next(error))
}
const getPersons =  (request, response, next) => {
    Persons.find({})
        .then((persons) => {
            response.json(persons)
        })
        .catch((error) => {
            next(error)
        })
}
const getPerson = (request, response, next) => {
    Persons.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => {
            next(error)
        })
}

const deletePerson = (request, response, next) => {
    Persons.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => {
            logger.error(error)
            next(error)
        })
}
const createPerson = (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).send({
            error: "Name or number is missing",
        })
    }
    const person = new Persons({
        name: body.name,
        number: body.number,
    })
    person
        .save()
        .then((savedNote) => {
            response.json(savedNote)
        })
        .catch((error) => next(error))


}

const updatePerson = (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Persons.findByIdAndUpdate(request.params.id, person, {
        new: true,
        runValidators: true,
        context: "quary",
    })
        .then((updatePerson) => {
            response.json(updatePerson)
        })
        .catch((error) => next(error))
}

module.exports = {
    getInfo, getPersons, getPerson, deletePerson, createPerson, updatePerson 
}

