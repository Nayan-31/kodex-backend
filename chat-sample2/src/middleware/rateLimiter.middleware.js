const request = new Map()

const MAX_REQUEST = 10
const  WINDOW_MS = 60 * 1000

const rateLimiter = (req,res,next)=>{
    const ip = req.ip

    if(!request.has(ip)){
        request.set(ip , {
            count : 1 ,
            startTime : Date.now()
        })
            return next()
    }


const userData = request.get(ip)

if(Date.now() - userData.startTime() > WINDOW_MS){
    request.set(ip,{
        count : 1 , 
        startTime : Date.now()
    })
    return next()
}

if(userData.count >= MAX_REQUEST){
    return res.status(429).json({
        sucess: false,
        message : "too many requests"
    })
}

userData.count++

request.set(ip , userData)

next()
}
