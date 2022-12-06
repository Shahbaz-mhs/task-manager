const express = require('express')
require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const auth = require('./middleware/auth')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const favicon = require('express-favicon');
const helpers = require('handlebars-helpers')();


const bodyParser=require("body-parser");
const hbs = require('hbs')
const path = require('path')

const app = express()
app.use(cookieParser())
const port = process.env.PORT

//MONGODB_URL=mongodb://127.0.0.1:27017/task-mnager-api
//MONGODB_URL=mongodb+srv://taskapp:taskapp@cluster0.dm16nxa.mongodb.net/?retryWrites=true&w=majority
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





//Define Paths for Express Config
const publicDirectoryPath = path.join(__dirname, '../public')
const ViewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup Habndlebars engine and views loaction
app.set('view engine', 'hbs')
app.set('views', ViewsPath)

hbs.registerPartials(partialsPath)



//Setup Static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use("/favicon.ico", express.static('images/task_logo.png'));

const jwt = require('jsonwebtoken')


hbs.registerHelper('if_equal', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
});

hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


hbs.registerHelper('formatDate', function(dateString) {
    return new hbs.SafeString(
        moment(dateString).format("MMM D").toUpperCase()
    );
});

hbs.registerHelper("prettifyDate", function(timestamp) {
    var curr_date = timestamp.getDate();
    var curr_month = timestamp.getMonth();
    curr_month++;
    var curr_year = timestamp.getFullYear();
    var hours = (timestamp.getHours() + 11) % 12 + 1;
    var min = timestamp.getMinutes();
    result = curr_year + "/" + curr_month + "/" + curr_date + " T " + hours + ":" + min;
    return result;
});

hbs.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 1; i <= n; ++i)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper("incby2", function(value, lim)
{
    // if(value == 3){
    //     return 4;
    // }

    // if(value == 2){
    //     return parseInt(value);
    // }else{
        const temp = parseInt(value) * lim;
        return temp - lim;
        // if (value%2 == 0){
        //     return parseInt(value) + 2;
        // }
		// else{
        //     return parseInt(value) + 3;
        // }
        
   // }
    
});




// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'}, 'thisismynewcource', {expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcource')
//     console.log(data)
// }

// myFunction()


app.get('',(req, res) => {
    res.render('login', {
       // title: 'Weather',
       // name: 'Shahbaz Khan'
    })
})





// app.post('/users/login2', async (req, res) => {
//     try{
//         console.log(req.body)
        
//         // const user  = await User.findByCredentials(req.body.email, req.body.password)
       
//         // const token = await user.generateAuthToken()
//         // res.send({user, token})

//     }catch (e){
//         res.status(400).send(e)
//     }
// })

// const upload = multer({
//     dest: 'images',
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word document'))
//         }
//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res)=>{
//     res.send()
// })



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