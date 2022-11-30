const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
   // useCreateIndex: true
})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if(!validator.isEmail(value)){
//                 throw new Error('EMail is invalid!')
//             }
//         }
//     },
//     password: {
//         type : String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Password cannot contain "password" ')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0){
//                 throw new Error('Age must be a positive number!')
//             }
//         }
//     }
// })

// const me = new User({
//     name: '   Shahbaz  ',
//     email: ' KHAN@gmail.com',
//     age: 23,
//     password: 'Pass123'

// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error', error)
// })


// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true,

//     },
//     completed: {
//         type: Boolean,
//         default: false,
//     }
// })

// const task = new Task({
//     description: 'Python2',
    
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })