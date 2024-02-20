const express = require('express')
const path = require('path')
const app = express();
const router = require('./routes/user');
const { default: mongoose } = require('mongoose');
const http = require('http')
const { Server } = require("socket.io");

mongoose.connect(process.env.MONGO_URL).then((req,res)=>{
    console.log("mongo")
}).catch((err)=>{
    console.log("error")
})

app.use(express.static(path.resolve('./public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/',router)
app.set("view engine","ejs")
app.set("views","./views")
app.get('/',(req,res)=>{
    return res.render('home')
})


const myserver = http.createServer(app)
const io = new Server(myserver)
io.on('connection', (socket) => {
    console.log("socket connected")
    console.log(socket.id)
    socket.on("joinroom", (data) => {
        const roomno = data.roomno;
        const message = data.message;
        if (roomno.trim() !== "") {
            socket.join(roomno)
            io.to(roomno).emit("message", { message: message, id: socket.id })
        }
        else {
            io.sockets.emit("message", { message: message, id: socket.id });
        }

    })

    socket.on("exitRoom", (data) => {
        const roomno = data.roomno;
        if (roomno && roomno.trim() !== "") {
            socket.leave(roomno);
            console.log(`User ${socket.id} left room ${roomno}`);
        }
    });

    socket.on("message", (data) => {
        const roomno = data.roomno;
        const message = data.message;
        if (roomno && roomno.trim() !== "") {
            io.to(roomno).emit("message", { message: message, id: socket.id });
        } else {
            io.sockets.emit("message", { message: message, id: socket.id });
        }

    })


    socket.on("disconnect", () => {
        console.log("socket disconnected")
    })



})
const port = process.env.PORT || 8000;
myserver.listen(port,()=>{
    console.log("connect")
})