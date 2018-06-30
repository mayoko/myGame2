import * as http from 'http';
import * as sio from 'socket.io';

class Server {
    // 対戦する人達の socket を覚えておく
    sockets : sio.Socket[];
    constructor() {
        this.sockets = [];
        const server = http.createServer((request, response) => {
            response.end();
        });
        server.listen(8000);
        const io = sio.listen(server);
        io.sockets.on("connection", (socket) => {
            this.actionToConnect(socket);
            socket.on("move", (data) => {
                io.sockets.emit("broadcast", data);
            });
        });
    }
    private actionToConnect(socket: sio.Socket) {
        console.log(`connected! id: ${socket.id}`);
        // とりあえず観戦とかそういうのはなしなので二人以上入ったらその人にはさいならしてもらう
        if (this.sockets.length >= 2) {
            return;
        }
        this.sockets.push(socket);
        if (this.sockets.length === 2) {
            console.log("info: two player connect");
            // 人数が二人になったらそれぞれの player の白黒を決定して通知
            const id: number = Math.floor(Math.random() * 2);
            this.sockets[id].emit("colorInfo", "black");
            this.sockets[id^1].emit("colorInfo", "white");
        }
    }
}

const server = new Server();