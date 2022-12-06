const express = require('express')
const Task = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')
const { count } = require('../models/tasks')

//GET /task?completed=true
//GET /task?limit=10&skip=20
//GET /task?sortBy=createdAt:desc
router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.description){
        match.description = {'$regex': new RegExp(req.query.description) , $options: "?i" }
       // match.description = {$caseSensitive: false}
        
        
    }
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }

    try{
        const count_total_task = await Task.find({owner: req.user._id})
        //await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: 4,//parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

      
        if(count_total_task.length%2 != 0){
            count_task = (count_total_task.length + 1)/ 4
        }else{
            count_task = count_total_task.length / 4
        }
        
        res.render('task', {
             task_list: req.user.tasks,
             name: 'Shahbaz Khan',
             profile_avatar: req.user.avatar,
             //next : parseInt(req.query.skip) + 2,
             //prev : parseInt(req.query.skip) - 2,
             task_count : count_task
         })
        
        //res.status(200).send(req.user.tasks) new updated
        //res.status(200).send(task)  old one
    }catch(e){
        res.status(500).send(e)
    }
    
    // Task.find({}).then((task) => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })

})

router.get('/task/add', auth, (req, res) => {
    res.render('addtask',{
        profile_avatar: req.user.avatar
    })
})

router.get('/task/edit', auth, (req, res) => {
    res.render('edittask')
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})


        if(!task) {
            return res.status(400).send()
        }
        //res.send(task)
        res.render('edittask', {
            task_data: task,
            name: 'Shahbaz Khan',
            profile_avatar: req.user.avatar
        })

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


//FOR BROWSER CUSTOM UPDATE TASK

router.post('/tasks/:id', auth,async(req, res) => {
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
        //res.status(200).send(task)
        //req.flash("success", "Your message");
        res.redirect('/task')

    }catch(e){
        res.status(400).send(e)
    }

})

//FOR POSTMAN UPDATE TASK
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




//VIEW TASK

router.get('/view/:id', auth, async (req, res) => {
    const _id = req.params.id

    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})


        if(!task) {
            return res.status(400).send()
        }
        //res.send(task)
        res.render('viewtask', {
            task_data: task,
            name: 'Shahbaz Khan',
            profile_avatar: req.user.avatar
        })

    }catch(e){
        res.status(500).send(e)
    }

})



//DELETE FOR POSTMAN
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

//DELETE TASK FOR BROWSER
router.get('/delete/:id', auth,async (req, res) => {
    try{
        //const dltTask = await Task.findByIdAndDelete(req.params.id)
        const dltTask = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if(!dltTask){
            return res.status(404).send({error : 'Invalid Id!'})
        }

        
        //res.status(200).send("Deleted Successfully")
        res.redirect('/task')
        // res.render('task', {
        //     task_data: task,
        //     name: 'Shahbaz Khan'
        // })

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
        //res.status(200).send(task)
        res.redirect('/task')

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