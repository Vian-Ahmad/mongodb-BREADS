var express = require('express');
const { ObjectId } = require('mongodb')
var router = express.Router();

/* GET users listing. */
module.exports = function (db) {
  const User = db.collection('users')

  router.get('/', async (req, res, next) => {
    const data = await User.find().toArray()
    try {
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findOne({ _id: new ObjectId(id) })
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  })

  router.post('/', async (req, res, next) => {
    try {
      const { name, phone } = req.body
      const user = await User.insertOne({ name: name, phone: phone })
      const data = await User.find({ _id: new ObjectId(user.insertedId) }).toArray()
      res.status(201).json(data)
    } catch (err) {
      res.status(500).json({ err })
    }
  })

  router.put('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const { name, phone } = req.body
      const user = await User.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { name: name, phone: phone } }, { returnDocument: 'after' })
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }

  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findOneAndDelete({ _id: new ObjectId(id) })
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  })

  return router

}
