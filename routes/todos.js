var express = require('express')
const { ObjectId } = require('mongodb')
var router = express.Router()

module.exports = function (db) {
    const User = db.collection('users')
    const Todo = db.collection('todos')

    router.get('/', async (req, res, next) => {
        const data = await Todo.find().toArray()
        try {
            const { page = 1, limit = 15, title, startdate, enddate, complete, sortMode, sortBy = '_id', executor } = req.query
            const params = {}
            const sort = {}
            sort[sortBy] = sortMode
            const offset = (page - 1) * limit

            if (title) {
                params['title'] = new RegExp(title, 'i')
            }

            if (startdate && enddate) {
                params['deadline'] = {
                    $gte: new Date(startdate),
                    $lte: new Date(enddate)
                }
            } else if (startdate) {
                params['deadline'] = { $gte: new Date(startdate) }
            } else if (enddate) {
                params['deadline'] = { $lte: new Date(enddate) }
            }

            if (complete) {
                params['complete'] = JSON.parse(complete)
            }

            if (executor) {
                params['executor'] = new ObjectId(executor)
            }

            const total = await Todo.count(params)
            const pages = Math.ceil(total / limit)

            const todos = await Todo.find(params).sort(sort).limit(Number(limit)).skip(offset).toArray()
            res.json({ data: todos, limit: Number(limit), page, pages, total });
        } catch (err) {
            res.status(500).json({ err })
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const id = req.params.id
            const todo = await Todo.findOne({ _id: new ObjectId(id) })
            res.status(200).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.post('/', async (req, res) => {
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

    router.put('/:id', async (req, res) => {
        try {
            const id = req.params.id
            const { title, deadline, complete } = req.body
            const todo = await Todo.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title: title, deadline: new Date(deadline), complete: JSON.parse(complete) } }, { returnDocument: 'after' })
            res.status(201).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.delete('/:id', async (req, res) => {
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