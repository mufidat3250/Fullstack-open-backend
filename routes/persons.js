const router = require('express').Router()
const {getPersons, getInfo, getPerson, deletePerson, createPerson, updatePerson} = require('../controllers/persons')
 router.get("/info", getInfo)

router.get("/", getPersons)


router.get("/:id", getPerson)

router.delete("/:id", deletePerson)

router.post("/", createPerson)

router.put("/:id", updatePerson)

module.exports = router