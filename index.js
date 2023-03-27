const config=require('./config/constants')
const path=require('path')
require('dotenv').config()

const PORT=config.PORT;
const originUrl=config.origin_url

const io=require('socket.io')(PORT,{
    cors:{
        origin:originUrl
    }
});

let users=[];

const addUser=(userId, socketId)=>{
    !users.some(user=>user.userId===userId) &&
       users.push({userId, socketId});
}

const removeUser=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId)
}

const getUser=(userId)=>{
    let user= users.find(user=>user.userId===userId);
    return user;
}

const getUsersId=()=>{
    return users.map(user=>user.userId);
}

io.on("connection", (socket)=>{
    console.log("A user is connected");
    
    socket.on("addUser", userId=>{
        console.log("addUser")
         userId && addUser(userId, socket.id);
         const usersId=getUsersId();
         io.emit('getUsers', usersId)
    });

    socket.on("sendMessage", ({senderId, recieverId, text})=>{
          const user=getUser(recieverId);
          user && io.to(user.socketId).emit("getMessage", {
            senderId,
            recieverId,
            text
          })
    })

    socket.on('newNotification', ({recieverId})=>{
        const user=getUser(recieverId);
        user && io.to(user.socketId).emit('getNotifications', {})
    })


    socket.on('disconnect', ()=>{
        console.log("A user is disconnected")
        removeUser(socket.id);
        io.emit('getUsers', users)
    })

})