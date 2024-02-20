const User = require('../models/user')
const Admin = require('../models/admin')
const Notice = require('../models/notice')
const Issue = require('../models/issues')
const path = require('path')
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const multer = require('multer')
const Project = require('../models/project')


const secret = "pritiranjansamal"

router.use(cookieparser())

function setuser(admin) {
    const payload = {
        email: admin.email,
        password: admin.password
    }
    const token = jwt.sign(payload, secret)
    return token;
}


function getuser(token) {
    return jwt.verify(token, secret)
}


router.post('/usersignup', async (req, res) => {
    const { fname, lname, email, password, phoneno, address } = req.body;
    if (!req.body) {
        console.log("field empty")
    }
    const user = await User.create({ fname, lname, email, password, phoneno, address })
    return res.render('userlogin');
})




router.post('/userlogin', async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        console.log("empty")
        return res.render('userlogin', {
            error: "no email or password entered "
        })
    }
    const users = await User.findOne({ email, password });
    if (!users) {
        console.log("no user")
        return res.render('userlogin', {
            error: "no such user found "
        })
    }
    const token = setuser(users, secret);
    const name = `${users.fname} ${users.lname}`
    const emai = users.email
    const pass = users.password
    const phone = users.phoneno
    const addres = users.address
    res.cookie('uid', token);
    const notice = await Notice.find({}).sort({ createdAt: -1 })
    return res.render('userdash', {
        notice,
        users,
        name,
        emai,
        pass,
        phone,
        addres
    })
})
router.get('/userdash', async (req, res) => {
    const token = req.cookies?.uid;
    const user = getuser(token, secret)
    const users = await User.findOne({ email: user.email })
    const name = `${users.fname} ${users.lname}`
    const emai = users.email
    const pass = users.password
    const phone = users.phoneno
    const addres = users.address
    res.cookie('uid', token);
    const notice = await Notice.find({}).sort({ createdAt: -1 })
    return res.render('userdash', {
        notice,
        users,
        name,
        emai,
        pass,
        phone,
        addres
    })
})


router.get('/userlogin', async (req, res) => {
    return res.render('userlogin')
})
router.get('/usersignup', async (req, res) => {
    return res.render('usersignup')
})
router.get('/adminlogin', async (req, res) => {
    return res.render('adminlogin')
})
router.get('/adminsignup', async (req, res) => {
    return res.render('adminsignup')
})

router.get('/edituserdetailbyuser/:name', async (req, res) => {
    const fname = req.params.name;
    return res.render('edituserdetailbyuser', {
        fname
    })
})


router.post('/edituserdetailbyuser/:name', async (req, res) => {
    const namet = req.params.name;
    const { fname, lname, password, phoneno, address } = req.body;
    const token = req.cookies?.uid;
    if (!token) {
        console.log("No user present");
        return res.redirect('/userlogin');
    }
    const user = getuser(token, secret);
    const random = await User.findOne({ email: user.email });
    const id = random._id
    const update = await User.updateOne({ fname: namet }, { $set: { fname, lname, password, phoneno, address } })
    const users = await User.findOne({ _id: id })

    const name = `${users.fname} ${users.lname}`
    const emai = users.email
    const pass = users.password
    const phone = users.phoneno
    const addres = users.address
    return res.render('userdash', {
        users,
        name,
        emai,
        pass,
        phone,
        addres

    })
})


router.get('/edituserdetail/:name', async (req, res) => {
    const fname = req.params.name;
    return res.render('edituserdetail', {
        fname
    })
})


router.get('/viewuserdetail/:name', async (req, res) => {
    const namee = req.params.name;
    const users = await User.findOne({ fname: namee })
    const name = `${users.fname} ${users.lname}`
    const emai = users.email
    const pass = users.password
    const phone = users.phoneno
    const addres = users.address
    const notice = await Notice.find({}).sort({ createdAt: -1 })
    return res.render('viewuserdetail', {
        notice,
        users,
        name,
        emai,
        pass,
        phone,
        addres
    })

})

router.post('/edituserdetail/:name', async (req, res) => {
    const name = req.params.name;
    const { fname, lname, email, password, phoneno, address } = req.body;
    const updated = await User.updateOne({ fname: name }, { $set: { fname, lname, email, password, phoneno, address } })
    const token = req.cookies?.uid;
    if (!token) {
        console.log("No user present");
        return res.redirect('/adminlogin');
    }
    const users = await User.find({});

    const admi = getuser(token, secret)
    const admindetails = await Admin.findOne({ email: admi.email, password: admi.password })
    const adminname = `${admindetails.fname} ${admindetails.lname}`
    const count = await Issue.find({}).count({})
    return res.render('dashboard', {
        name: adminname,
        email: admindetails.email,
        phoneno: admindetails.phoneno,
        address: admindetails.address,
        users, count
    })
})

router.get('/deleteuser/:name', async (req, res) => {
    try {
        const name = req.params.name;
        console.log(name);


        const token = req.cookies?.uid;
        if (!token) {
            console.log("No user present");
            return res.redirect('/adminlogin');
        }
        const result = await User.deleteOne({ fname: name });
        const users = await User.find({});

        const admi = getuser(token, secret)
        const admindetails = await Admin.findOne({ email: admi.email, password: admi.password })
        const adminname = `${admindetails.fname} ${admindetails.lname}`
        const count = await Issue.find({}).count({})
        return res.render('dashboard', {
            name: adminname,
            email: admindetails.email,
            phoneno: admindetails.phoneno,
            address: admindetails.address,
            users, count
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).send("An error occurred while deleting the user");
    }
});



router.post('/adminsignup', async (req, res) => {
    const { fname, lname, email, password, phoneno, address } = req.body;
    if (!req.body) {
        console.log("field empty")
    }
    const admin = await Admin.create({ fname, lname, email, password, phoneno, address })
    return res.render('adminlogin')
})





router.post('/adminpage', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("empty")
        return res.render('adminlogin', {
            error: "no email or password entered "
        })
    }
    const admin = await Admin.findOne({ email, password });
    if (!admin) {
        console.log("no user")
        return res.render('adminlogin', {
            error: "no such user found "
        })
    }

    const token = setuser(admin, secret);
    res.cookie('uid', token);
    const admi = getuser(token, secret)
    const admindetails = await Admin.findOne({ email: admi.email, password: admi.password })
    const adminname = `${admindetails.fname} ${admindetails.lname}`
    const users = await User.find({})
    const count = await Issue.find({}).count({})
    return res.render('dashboard', {

        name: adminname,
        email: admindetails.email,
        phoneno: admindetails.phoneno,
        address: admindetails.address,
        users, count
    })

})
router.get('/adminpage', async (req, res) => {
    const token = req.cookies?.uid
    const admi = getuser(token, secret)
    const admindetails = await Admin.findOne({ email: admi.email, password: admi.password })
    const adminname = `${admindetails.fname} ${admindetails.lname}`
    const users = await User.find({})
    const count = await Issue.find({}).count({})
    return res.render('dashboard', {

        name: adminname,
        email: admindetails.email,
        phoneno: admindetails.phoneno,
        address: admindetails.address,
        users,
        count
    })
})


router.get('/logout', (req, res) => {
    res.clearCookie('uid').render('home')
})



router.get('/addnotice', async (req, res) => {
    const notice = await Notice.find({}).sort({ createdAt: -1 })
    return res.render('addnotice', {
        notice
    })
})




router.post('/postnotice', async (req, res) => {
    try {
        const { heading, body } = req.body
        const notice = await Notice.create({ heading, body });
        const notices = await Notice.find({}).sort({ createdAt: -1 });
        return res.render('addnotice', {
            notice: notices,
            success: "Notice added successfully."
        });
    } catch (error) {

        console.error("Error while creating notice:", error);
        return res.status(500).send("Internal Server Error");
    }
});



router.get('/viewnotice/:heading', async (req, res) => {
    const head = req.params.heading
    const notice = await Notice.findOne({ heading: head })
    if (!notice) {
        console.log("no notice present ")
        res.render('addnotice')
    }
    const heading = notice.heading
    const body = notice.body
    res.render('viewnotice', {
        heading,
        body
    })
})

router.get('/viewnoticeuser/:heading', async (req, res) => {
    const head = req.params.heading
    const notice = await Notice.findOne({ heading: head })
    if (!notice) {
        console.log("no notice present ")
        res.render('addnotice')
    }
    const heading = notice.heading
    const body = notice.body
    return res.render('viewnoticeuser', {
        heading,
        body
    })
})

router.get('/adduser', (req, res) => {
    return res.render('adduser')
})

router.post('/adduser', async (req, res) => {
    const { fname, lname, email, password, phoneno, address } = req.body;
    if (!fname || !lname || !email || !password || !phoneno || !address) {
        return res.render('adduser', {
            error: 'please fill all the details'
        })
    }
    const user = await User.create({ fname, lname, email, phoneno, address, password })
    console.log('created sucess')
    const token = req.cookies?.uid
    const admi = getuser(token, secret)
    const admindetails = await Admin.findOne({ email: admi.email, password: admi.password })
    const adminname = `${admindetails.fname} ${admindetails.lname}`
    const users = await User.find({})
    const count = await Issue.find({}).count({})
    return res.render('dashboard', {
        name: adminname,
        email: admindetails.email,
        phoneno: admindetails.phoneno,
        address: admindetails.address,
        users,
        sucess: 'user created sucessfully ;',
        count
    })
})


router.get('/raiseissue/:fname', (req, res) => {
    const fname = req.params.fname
    return res.render('raiseissue', {
        fname
    })
})

router.post('/raiseissue/:fname', async (req, res) => {
    const fname = req.params.fname;
    const { issue, body } = req.body;
    const generate = await Issue.create({ user: fname, issue: issue, body: body })
    const token = req.cookies?.uid;
    const user = getuser(token, secret)
    const users = await User.findOne({ email: user.email })
    const name = `${users.fname} ${users.lname}`
    const emai = users.email
    const pass = users.password
    const phone = users.phoneno
    const addres = users.address
    res.cookie('uid', token);
    const notice = await Notice.find({}).sort({ createdAt: -1 })
    return res.render('userdash', {
        notice,
        users,
        name,
        emai,
        pass,
        phone,
        addres,
        message: 'issue raised sucessfully'
    })

})
router.get('/displayissue', async (req, res) => {
    const count = await Issue.find({}).count({})
    const issues = await Issue.find({}).sort({ createdAt: -1 })
    return res.render('displayissue', {
        count,
        issues
    })
})
router.get('/displayissue/:viewissue', async (req, res) => {
    const issue = req.params.viewissue
    const count = await Issue.find({}).count({})
    const issues = await Issue.find({}).sort({ createdAt: -1 })
    const viewedissue = await Issue.findOne({ issue })

    return res.render('displayissue', {
        count,
        issues,
        viewedissue
    })
})

router.get('/submitproject', (req, res) => {
    return res.render('submitproject')
})




const storage = multer.diskStorage({
    destination(req, file, cb) {
        return cb(null, path.resolve('./public/project'))
    }, filename(req, file, cb) {
        return cb(null, `${Date.now().toLocaleString()}-${file.originalname}`)
    }
})
const upload = multer({ storage })
router.post('/submitproject', upload.single("project"), async (req, res) => {
    
    console.log(req.file)
    const { topic, brief } = req.body;
    const project = await Project.create({ topic, brief,fileurl:`/project/${req.file.filename}`});
    console.log(req.file)
    const token = req.cookies?.uid;
    const user = getuser(token, secret)
    const users = await User.findOne({ email: user.email })
    const name = `${users.fname} ${users.lname}`
    const emai = users.email
    const pass = users.password
    const phone = users.phoneno
    const addres = users.address
    res.cookie('uid', token);
    const notice = await Notice.find({}).sort({ createdAt: -1 })
    return res.render('userdash', {
        notice,
        users,
        name,
        emai,
        pass,
        phone,
        addres,

        sucess: 'file uploaded sucess'
    })

})
router.get('/seepro',async(req,res)=>{
    const project  = await Project.find({}).sort({createdAt:-1})
    console.log(project)
    return res.render('seepro',{
        project
    })
})
router.get('/seepro/:topic',async(req,res)=>{
    const topic  = req.params.topic
    const project = await Project.findOne({topic})
    return res.render('projectbrief',{
        project
    })
})
router.get('/joinchatuser',(req,res)=>{
    return res.render('joinchatuser')
})
router.get('/joinchatadmin',async(req,res)=>{
    const count = await Issue.find({}).count({})
    return res.render('joinchatadmin',{
        count

    })
})
module.exports = router;