//CRUD create read update delete

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectId

const connectionURL = 'mongodb://127.0.0.1:27017'
const databseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect!')
    }

    const db = client.db(databseName)

    // db.collection('users').findOne({name: 'shahbaz khan'}, (error, user) => {
    //     if(error){
    //         return console.log('No user found!')
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({name: 'shahbaz khan'}).count((error, users) => {
    //    console.log(users)
    //     console.log(count(users))
    // })

    // db.collection('tasks').find({completed: 1}).toArray((error, task) => {
    //     console.log(task)
    // })

   

    // db.collection('tasks').findOne({completed: '0'},(error, task) => {
    //     console.log(task)
    // })

   // db.collection.countDocuments('users').find({name: 'shahbaz khan'})
    

    //db.collection('users').findOne({name:'shahbaz'})

    // db.collection('users').insertOne({
    //     name: 'shahbaz khan 2',
    //     age: 23
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert one')
    //     }

    //     console.log(result)
    // })
    //console.log('Connected correctly!')

    // db.collection('users').insertMany([
    //     {
    //         name: 'Andrew',
    //         age: 27
    //     }, {
    //         name: 'Mead',
    //         age: 28
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert many data!')
    //     }

    //     console.log(result.insertedCount)
    //     console.log(result.insertedIds)

    // })

    // db.collection('tasks').insertMany([
    //     {
    //         task: 'weather',
    //         completed: 1
    //     }, {
    //         task: 'API Call',
    //         completed: 1
    //     }, {
    //         task: 'CRUD',
    //         completed: 0
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to multiple insert!')
    //     }

    //     console.log(result.acknowledged)
    //     console.log(result.insertedCount)
    // })

    
    // db.collection('users').updateMany({
    //     age: 23
    // }, {
    //     $set: {
    //         age: 22,
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('users').deleteOne({
        age: 28
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    db.collection('tasks').deleteMany({
        completed: 1
    }).then((result) => {
        console.log(result)
    }).catch((error) => (
        console.log(error)
    ))


})

