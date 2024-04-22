const dgram = require("node:dgram")
const dnspacket = require("dns-packet")

const db = {
    'piyushgarg.dev':{
        type:'A',
        data:'1.2.3.4'
    },
    "blog.piyushgarg.dev":{
        type:'CNAME',
        data:'hashnode.network'
    },
    "vedant.dev":{
        type:'A',
        data:'1.1.1.1'
    }
}

console.log("Hi from node");

const socket =dgram.createSocket('udp4');

socket.on('message',(msg,rinfo)=>{
    const incomingMessage = dnspacket.decode(msg);
    console.log("Incoming message msg :- ",incomingMessage.questions,rinfo)
    const ipFromDb = db[incomingMessage.questions[0].name]

    const ansPacket = dnspacket.encode({
        type:'response',
        id:incomingMessage.id,
        flags:dnspacket.AUTHORITATIVE_ANSWER,
        questions:incomingMessage.questions,
        answers:[
            {
                type:ipFromDb.type,
                class:'IN',
                name:incomingMessage.questions[0].name,
                data:ipFromDb.data
            }
        ]
    })

    socket.send(ansPacket,rinfo.port,rinfo.address)

})
socket.bind(53,()=>console.log("Server is running on port 53"))