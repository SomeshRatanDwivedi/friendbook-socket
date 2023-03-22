const io=require('socket.io')(8900,{
    cors:{
        origin:"https://friendbook-rsch.onrender.com"
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

    socket.on('disconnect', ()=>{
        console.log("A user is disconnected")
        removeUser(socket.id);
        io.emit('getUsers', users)
    })

})