import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL environment variable is not defined");
}
const pub = new Redis(redisUrl, { tls: { rejectUnauthorized: false }})
const sub = new Redis(redisUrl, { tls: { rejectUnauthorized: false }})



/**
 * Service class for handling the Socket.IO server.
 */
class SocketService {
  private _io: Server;

  constructor() {
    console.log("Initializing socket service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      }
    });

    this.initializeSubscriptions();
  }

  private async initializeSubscriptions() {
    await sub.subscribe("MESSAGES");
  }

  /**
   * Initialize the listeners for the Socket.IO server.
   */
  public initListeners() {
    console.log("Initializing socket listeners...");
    const io = this.io;

    try {
      io.on("connect", async (socket) => {
        console.log("New socket connection", socket.id);
        socket.on("event:message", async ({message}:{message:string})=>{
          await pub.publish("MESSAGES", JSON.stringify({message:message, socketId: socket.id}))        
        })
  
        // collect all socket id and push it to redis
        pub.sadd("SOCKETS", socket.id)
  
        // get all active sockets if new connection added
        const allActiveSockets = await pub.smembers("SOCKETS")
        io.emit("event:sockets", allActiveSockets);
  
        socket.on("disconnect", () => {
          pub.srem("SOCKETS", socket.id)
          console.log("Socket disconnected", socket.id);
        });
      });
  
      sub.on("message", (channel, message) => {
        const msg = JSON.parse(message).message;
        const socketId = JSON.parse(message).socketId;
        if(channel === "MESSAGES"){
          io.emit("event:message", {message: msg, socketId: socketId})
        }
      });
      
    } catch (error) {
      console.log("Error in socket connection", error);
    }
  }

  /**
   * Getter for the Socket.IO server instance.
   * 
   * @returns {SocketIO.Server} The Socket.IO server instance.
   */
  get io() {
    return this._io;
  }
}

export default SocketService;