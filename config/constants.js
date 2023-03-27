const development={
    name:'development',
    origin_url: process.env.FRIEND_BOOK_DEVELOPMENT_ORIGIN_URL,
    port:process.env.PORT
}

const production={
    name:'production',
    origin_url: process.env.FRIEND_BOOK_DEVELOPMENT_ORIGIN_URL,
    port: process.env.PORT
}

module.exports=production
