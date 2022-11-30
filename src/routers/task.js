const express = require('express')
const Task = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')

//GET /task?completed=true
//GET /task?limit=10&skip=20
//GET /task?sortBy=createdAt:desc
router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }

    try{
        //const task = await Task.find({owner: req.user._id})
        //await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        
        res.status(200).send(req.user.tasks)
        //res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    
    // Task.find({}).then((task) => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })

})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})


        if(!task) {
            return res.status(400).send()
        }
        res.send(task)

    }catch(e){
        res.status(500).send(e)
    }

    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         return res.status(400).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})



router.patch('/tasks/:id', auth,async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates:'})
    }

    try{
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
       // const task = await Task.findById(req.params.id)
        

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators:true})

        if(!task){
            return res.status(404).send(task)
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save() 
        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }

})



router.delete('/tasks/:id', auth,async (req, res) => {
    try{
        //const dltTask = await Task.findByIdAndDelete(req.params.id)
        const dltTask = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if(!dltTask){
            return res.status(404).send({error : 'Invalid Id!'})
        }

        
        res.status(200).send("Deleted Successfully")

    }catch (e){
        res.status(400).send(e)
    }
})



router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(200).send(task)

    }catch(e){
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

module.exports = router