import * as http from 'http';
import * as sio from 'socket.io';

class Server {
    // 対戦する人達の socket を覚えておく
    sockets : sio.Socket[][];
    // それぞれの socket id の人がどの部屋にいるか
    socketId2roomId : Map<string, number>;
    // 部屋 id の最大値
    private static MAX_ROOM_ID: number = 50;
    constructor() {
        // server の初期化
        const server = http.createServer((request, response) => {
            response.end();
        });
        server.listen(8000);
        const io = sio.listen(server);
        // socket 周りの初期化
        this.sockets = new Array(Server.MAX_ROOM_ID);
        this.socketId2roomId = new Map<string, number>();
        for (let i = 0; i < Server.MAX_ROOM_ID; ++i) {
            this.sockets[i] = new Array();
        }
        // socket の挙動の記述
        io.sockets.on("connection", (socket) => {
            // コネクトした際の挙動
            this.actionToConnect(socket);
            // 部屋に enter した際の挙動
            socket.on("enter", (data) => {
                this.enterEvent(data, socket, io);
            });
            // client から手が差された際の挙動
            socket.on("move", (data) => {
                this.moveEvent(data, socket, io);
            });
            socket.on("disconnect", () => {
                this.disconnectEvent(socket, io);
            });
        });
    }
    private enterEvent(data, socket: sio.Socket, io: sio.Server) {
        // 送られたデータの確認
        const id: number = data[0];
        const name: string = data[1];
        // 既に 2 人入ってたらさいなら
        if (this.sockets[id].length > 2) {
            console.log("GOMENNA");
            return;
        }
        // room に追加
        this.sockets[id].push(socket);
        socket.join(id.toString());
        this.socketId2roomId.set(socket.id, id);
        // 部屋に入ったことを通知
        io.sockets.in(id.toString()).emit("addLog", `${name} さんが入室しました`)
        // 2 人になったら試合開始
        if (this.sockets[id].length === 2) {
            console.log(`info in room ${id}: two player connect`);
            // 人数が二人になったらそれぞれの player の白黒を決定して通知
            const turn: number = Math.floor(Math.random() * 2);
            this.sockets[id][turn].emit("colorInfo", "black");
            this.sockets[id][turn^1].emit("colorInfo", "white");
        }
    }
    private moveEvent(data, socket: sio.Socket, io: sio.Server) {
        console.log("moveEvent");
        const roomId: string = this.socketId2roomId.get(socket.id).toString();
        io.sockets.in(roomId).emit("broadcast", data);
    }
    private disconnectEvent(socket: sio.Socket, io: sio.Server) {
        console.log("disconnectEvent");
        // client に通知
        const roomId: string = this.socketId2roomId.get(socket.id).toString();
        io.sockets.in(roomId).emit("addLog", "対戦相手が退出しました");
        // server から情報を消す
        if (socket.id === this.sockets[roomId][0].id) {
            // 先頭を削除
            this.sockets[roomId].shift();
        } else {
            // 末尾を削除
            this.sockets[roomId].pop();
        }
    }
    private actionToConnect(socket: sio.Socket) {
        console.log(`connected! id: ${socket.id}`);
    }
}

const server = new Server();