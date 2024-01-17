var express = require('express')
const { ObjectId } = require('mongodb')
var router = express.Router()

module.exports = function (db) {
    const User = db.collection('users')
    const Todo = db.collection('todos')

    router.get('/', async (req, res, next) => {
        const data = await Todo.find().toArray()
        try {
            res.status(200).json({ data });
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const todo = await Todo.findOne({ _id: new ObjectId(id) })
            res.status(200).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.post('/', async (req, res, next) => {
        try {
            const { title, executor } = req.body
            const oneDay = 24 * 60 * 60 * 1000
            const user = await User.findOne({ _id: new ObjectId(executor) })
            const todo = await Todo.insertOne({ title: title, complete: false, deadline: new Date(Date.now() + oneDay), executor: user._id })
            const data = await Todo.find({ _id: new ObjectId(todo.insertedId) }).toArray()
            res.status(201).json(data)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.put('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const { title, deadline, complete } = req.body
            const todo = await Todo.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title: title, deadline: new Date(deadline), complete: JSON.parse(complete) } }, { returnDocument: 'after' })
            res.status(201).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.delete('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const todo = await Todo.findOneAndDelete({ _id: new ObjectId(id) })
            res.status(200).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    return router
}