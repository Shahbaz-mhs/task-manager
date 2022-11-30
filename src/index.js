const express = require('express')
require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const auth = require('./middleware/auth')
const multer = require('multer')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     console.log(req.method, req.path)
//     next()
// })

// app.use((req, res, next) => {
//     res.status(400).send('under go for maintainance')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'}, 'thisismynewcource', {expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcource')
//     console.log(data)
// }

// myFunction()

const upload = multer({
    dest: 'images',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document'))
        }
        cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res)=>{
    res.send()
})



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

//const Task = require('./models/tasks')
//const User = require('./models/users')

// const main = async () => {
//     const user = await User.findById('63844f3afdc95caf6752a28a')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()