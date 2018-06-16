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

class BoardCell {
    static cellHeight: number = 50;
    static cellWidth: number = 50;
    static cellBorder: number = 3;
    static cellRadius: number = 20;
    static backgroundColor: string = "green";
    static whiteColor: string = "white";
    static blackColor: string = "black";
    // 緑色のセル
    backgroundElem;
    // 白黒を扱う
    elem;
    constructor(parent, y: number, x: number) {
        // セルの設定
        this.backgroundElem = document.createElement("div");
        this.backgroundElem.classList.add("backgroundCell");
        this.backgroundElem.style.height = `${BoardCell.cellHeight}px`;
        this.backgroundElem.style.width = `${BoardCell.cellWidth}px`;
        this.backgroundElem.style.border = `${BoardCell.cellBorder}px`;
        this.backgroundElem.style.top = `${(BoardCell.cellHeight + BoardCell.cellBorder) * y + BoardCell.cellBorder}px`;
        this.backgroundElem.style.left = `${(BoardCell.cellWidth + BoardCell.cellBorder) * x + BoardCell.cellBorder}px`;
        this.backgroundElem.style.backgrroundColor = BoardCell.backgroundColor;

        // 石の色の設定
        this.elem = document.createElement("div");
        this.elem.classList.add("gameCell");
        this.elem.style.height = `${BoardCell.cellRadius*2}px`;
        this.elem.style.width = `${BoardCell.cellRadius*2}px`;
        //this.elem.style.top = `${(BoardCell.cellHeight + BoardCell.cellBorder) * y + BoardCell.cellBorder + (BoardCell.cellHeight / 2 - BoardCell.cellRadius)}px`;
        //this.elem.style.left = `${(BoardCell.cellWidth + BoardCell.cellBorder) * x + BoardCell.cellBorder + (BoardCell.cellWidth / 2 - BoardCell.cellRadius)}px`;
        this.elem.style.top = `${BoardCell.cellBorder + (BoardCell.cellHeight / 2 - BoardCell.cellRadius)}px`;
        this.elem.style.left = `${BoardCell.cellBorder + (BoardCell.cellWidth / 2 - BoardCell.cellRadius)}px`;
        this.elem.style.backgroundColor = BoardCell.backgroundColor;

        this.backgroundElem.appendChild(this.elem);
        parent.appendChild(this.backgroundElem);
    }
    // 石の色を変える
    setColor(y: number, x: number, cell: Cell) {
        let color : string = BoardCell.backgroundColor;
        if (cell.get() === Cell.black) {
            color = BoardCell.blackColor;
        } else if (cell.get() === Cell.white) {
            color = BoardCell.whiteColor;
        }
        this.elem.style.backgroundColor = color;
    }
}

class Board {
    state: State;
    cellBoard : BoardCell[][];
    parent;
    constructor() {
        this.parent = document.getElementById("gameBoard");
        this.parent.style.height = `${(BoardCell.cellHeight + BoardCell.cellBorder) * State.height + BoardCell.cellBorder}px`;
        this.parent.style.width = `${(BoardCell.cellWidth + BoardCell.cellBorder) * State.width + BoardCell.cellBorder}px`;
        this.state = new State();
        this.cellBoard = new Array(State.height);
        for (let i = 0; i < State.height; ++i) {
            this.cellBoard[i] = new Array(State.width);
            for (let j = 0; j < State.width; ++j) {
                this.cellBoard[i][j] = new BoardCell(this.parent, i, j);
            }
        }
    }
    // 石の色と場所を決めたらひっくり返していただく
    // 動かせたら true, 動かせなかったら false
    move(cell : Cell, y: number, x : number) {
        return this.state.move(cell, y, x);
    }
    // 描画する
    draw() {
        for (let i = 0; i < State.height; ++i) {
            for (let j = 0; j < State.width; ++j) {
                this.cellBoard[i][j].setColor(i, j, this.state.board[i][j]);
            }
        }
    }
}

const board = new Board();
board.draw();