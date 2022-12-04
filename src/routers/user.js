const express = require('express')
const app = express()
const multer = require('multer')
const auth = require('../middleware/auth')
const User = require('../models/users')
const router = new express.Router()
const sharp = require('sharp')
const { exists } = require('../models/tasks')

const bodyParser=require("body-parser");

app.use(express.json())

router.use(bodyParser.urlencoded({extended:true}));
// router.get('/test', (req, res) => {
//     res.send('From a new File')
// })


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('authcookie',token,{secure: false})
        //res.status(201).send({user, token})
        res.redirect('/task')
    }catch (e){
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
        
    // })
})

router.post('/users/login', async (req, res) => {
    try{
        
        
        const user  = await User.findByCredentials(req.body.email, req.body.password)

       
        const token = await user.generateAuthToken()
        res.cookie('authcookie',token,{secure: false})
        
        // const task_list = await client.get("/task");
        // console.log(task_list)
        res.redirect('/task')
        
        //res.send({user, token})

    }catch (e){
       // res.status(400).send(e)
       res.render('login', {
        // title: 'Weather',
        // name: 'Shahbaz Khan'
     })
    }
})


//POSTMAN
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()

        res.send()

    }catch(e){
        res.status(500).send(e)
    }
})

//BROWSER

router.get('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()

        //res.send()
        res.clearCookie('authcookie');
        res.redirect('/')

    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []
        console.log(req.user.tokens)

        await req.user.save()
        res.send('Successfully logout from all device')
    }catch(e){
        res.status(500).send('Something went wrong, pls try again')
    }
})

// router.get('/users/cookie', async(req,res)=>{
//     console.log(req.cookies.authcookie)
//     res.send(req.cookies.authcookie)
// })

router.get('/users/me', auth, async (req, res) => {
    //console.log(req.user.avatar)
    //res.send(req.user)
   // res.set('Content-Type','image/jpg')
    //res.send(req.user.avatar)
    res.render('editprofile',{
        profile:req.user,
        profile_avatar: req.user.avatar
    })

    // try{
    //    const users = await User.find({})
    //    res.send(users)
    // }catch(e){
    //     res.status(500).send()
    // }
    
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(400).send()
        }

        res.send(user)

    }catch (e){
        res.status(500).send(e)
    }

    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(400).send()
    //     }

    //     res.send(user)

    // }).catch((e) => {
    //     res.status(500).send(e)
    // })

    //console.log(req.params)
})


//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/avatars");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      req.user.avatar = file.originalname
      cb(null, file.originalname);

    }
  });

// const multerConfig = multer({
//     dest: 'public/avatars',
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb){
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             return cb(new Error('Upload only jpg, jpeg, png file'))
//         }

//         cb(undefined, true)
//     }
// })

//Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    //fileFilter: multerConfig,
  });

router.post('/users_update/me', auth, upload.single("avatar"), async(req, res) => {
    const allowedUpdates = ['name','age','email','password','avatar']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updated!'})
    }

    try{
        
        //const user = await User.findById(req.params.id)
        //console.log(req.file)
        updates.forEach((update) => req.user[update] = req.body[update])
        
        //req.user.avatar = req.file.originalname
        
        await req.user.save()
        

       // const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
        //req.user.avatar = buffer
        //req.user.avatar = req.file.buffer
        //await req.user.save()
       
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new :true, runValidators: true})

        // if(!user){
        //     return res.status(404).send()
        // }

        //res.send(req.user)
        res.redirect('/task')
    }catch (e){
        res.status(400).send(e)
    }
    
})

router.delete('/users_dlt/me', auth ,async(req, res) => {
    try{

    //    const dlt = await User.findByIdAndDelete(req.user._id)
    //     if(!dlt){
    //         return res.status(404).send({error:'Invalid Id!'})
    //     }

            await req.user.remove()

        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})




// router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
//      const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
//      req.user.avatar = buffer
//     //req.user.avatar = req.file.buffer
//      await req.user.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })

router.delete('/users/me/avatar2', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/jpg')
        res.send(user.avatar)

    } catch(e){
        res.status(400).send()
    }
})



module.exports = router