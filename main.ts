class Cell {
    static none :number = 0;
    static black:number = 1;
    static white:number = 2;
    color: number;
    constructor() {
        this.color = Cell.none;
    }
    // 反転する
    flip() {
        this.color = (this.color === Cell.black ? Cell.white : Cell.black);
    }
    // 色が逆の石を求める
    reverse() {
        if (this.color === Cell.black) return Cell.white;
        if (this.color === Cell.white) return Cell.black;
        return Cell.none;
    }
    // 石を置く
    set(color: number) {
        this.color = color;
    }
    // 色を求める
    get() {
        return this.color;
    }
}

class State {
    static height: number = 8;
    static width : number = 8;
    board: Cell[][];
    // 初期化
    constructor() {
        // 何も置かれていないボードを用意
        this.board = new Array(State.height);
        for (let i = 0; i < State.height; i++) {
            this.board[i] = new Array(State.width);
            for (let j = 0; j < State.width; j++) {
                this.board[i][j] = new Cell();
            }
        }
        // 真ん中に白黒を 2 つずつ置く
        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                this.board[State.height / 2 - i][State.width / 2 - j].set((i+j)%2 == 0 ? Cell.black : Cell.white);
            }
        }
    }
    // 描画する
    // 返り値は void
    draw() {
        // ボードの中身を数値化してホイ
        let numBoard: number[][] = new Array(State.height);
        for (let i = 0; i < State.height; ++i) {
            numBoard[i] = new Array(State.width);
            for (let j = 0; j < State.width; ++j) {
                numBoard[i][j] = this.board[i][j].color;
            }
        }
        console.log(numBoard);
    }
    // 石を置いてどういう状態になるかを見る
    // 少なくとも一枚裏返しているなら true, そうでないなら false を返す
    // color: 石の色, y, x: 石を置く場所
    move(cell: Cell, y: number, x: number) {
        // 既に石が置かれてるところだったら無理
        if (this.board[y][x].get() != Cell.none) return false;
        // color と反対の石の色
        const rColor : number = cell.reverse();
        // 周辺 8 方向
        const dx : number[] = [1, 1, 0, -1, -1, -1, 0, 1];
        const dy : number[] = [0, -1, -1, -1, 0, 1, 1, 1];
        let result: boolean = false;
        // 8 方向それぞれについて調べる
        for (let k = 0; k < 8; k++) {
            // 反転する予定の石の数
            let reverseNum : number = 0;
            // 裏返るか
            let isReversed : boolean = false;
            let cy : number = y + dy[k], cx : number = x + dx[k];
            while (cy >= 0 && cy < State.height && cx >= 0 && cx < State.width) {
                // 反対の色の場合は探索を継続
                if (this.board[cy][cx].get() === rColor) {
                    ++reverseNum;
                    cy += dy[k];
                    cx += dx[k];
                }
                // 同じ色の場合はそれまでの間で裏返すことになる
                else if (this.board[cy][cx].get() === cell.get()) {
                    isReversed = true;
                    break;
                }
                // 何もないところがあったら裏返らない
                else {
                    isReversed = false;
                    break;
                }
            }
            isReversed = (isReversed && (reverseNum > 0));
            result = (result || isReversed);
            // もし裏返る場合はひっくり返す
            if (isReversed) {
                cy = y + dy[k], cx = x + dx[k];
                while (true) {
                    if (this.board[cy][cx].get() === cell.get()) {
                        break;
                    }
                    if (this.board[cy][cx].get() === rColor) {
                        this.board[cy][cx].set(cell.get());
                        cy += dy[k];
                        cx += dx[k];
                    }
                }
            }
        }
        if (result) {
            this.board[y][x].set(cell.get());
        }
        return result;
    }
    // どこかに石をおけるか判定する
    canMove(cell: Cell) {
        for (let i = 0; i < State.height; ++i) {
            for (let j = 0; j < State.width; ++j) {
                if (this.canMoveInPos(cell, i, j)) return true;
            }
        }
        return false;
    }
    // コピーを作る
    clone() {
        let result : State = new State();
        for (let i = 0; i < State.height; ++i) {
            for (let j = 0; j < State.width; ++j) {
                result.board[i][j] = this.board[i][j];
            }
        }
        return result;
    }
    // 石を置けるか判定する
    // ほとんど上と同じ
    private canMoveInPos(cell: Cell, y: number, x: number) {
        // color と反対の石の色
        const rColor : number = cell.reverse();
        // 周辺 8 方向
        const dx : number[] = [1, 1, 0, -1, -1, -1, 0, 1];
        const dy : number[] = [0, -1, -1, -1, 0, 1, 1, 1];
        // 8 方向それぞれについて調べる
        for (let k = 0; k < 8; k++) {
            // 反転する予定の石の数
            let reverseNum : number = 0;
            // 裏返るか
            let isReversed : boolean = false;
            let cy : number = y + dy[k], cx : number = x + dx[k];
            while (cy >= 0 && cy < State.height && cx >= 0 && cx < State.width) {
                // 反対の色の場合は探索を継続
                if (this.board[cy][cx].get() === rColor) {
                    ++reverseNum;
                    cy += dy[k];
                    cx += dx[k];
                }
                // 同じ色の場合はそれまでの間で裏返すことになる
                else if (this.board[cy][cx].get() === cell.get()) {
                    isReversed = true;
                    break;
                }
                // 何もないところがあったら裏返らない
                else {
                    isReversed = false;
                    break;
                }
            }
            isReversed = (isReversed && (reverseNum > 0));
            if (isReversed) {
                return true;
            }
        }
        return false;
    }
}

const state = new State();
const white = new Cell();
const black = new Cell();
white.set(Cell.white);
black.set(Cell.black);
state.move(black, 4, 2);
state.move(white, 5, 2);
state.move(black, 6, 2);
state.move(white, 4, 1);
state.draw();