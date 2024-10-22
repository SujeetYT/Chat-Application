import { Server } from "socket.io";
import Redis from "ioredis";

const redisCredentials = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,  
}
const pub = new Redis(redisCredentials)
const sub = new Redis(redisCredentials)



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

    sub.subscribe("MESSAGES");
  }

  /**
   * Initialize the listeners for the Socket.IO server.
   */
  public initListeners() {
    console.log("Initializing socket listeners...");
    const io = this.io;

    io.on("connect", (socket) => {
      console.log("New socket connection", socket.id);
      socket.on("event:message", async ({message}:{message:string})=>{
        await pub.publish("MESSAGES", JSON.stringify({message:message}))        
      })
    });

    sub.on("message", (channel, message) => {
      if(channel === "MESSAGES"){
        io.emit("event:message", {message: JSON.parse(message).message})
      }
    });
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