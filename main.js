var Cell = /** @class */ (function () {
    function Cell() {
        this.color = Cell.none;
    }
    // 反転する
    Cell.prototype.flip = function () {
        this.color = (this.color === Cell.black ? Cell.white : Cell.black);
    };
    // 色が逆の石を求める
    Cell.prototype.reverse = function () {
        if (this.color === Cell.black)
            return Cell.white;
        if (this.color === Cell.white)
            return Cell.black;
        return Cell.none;
    };
    // 石を置く
    Cell.prototype.set = function (color) {
        this.color = color;
    };
    // 色を求める
    Cell.prototype.get = function () {
        return this.color;
    };
    Cell.none = 0;
    Cell.black = 1;
    Cell.white = 2;
    return Cell;
}());
var State = /** @class */ (function () {
    // 初期化
    function State() {
        // 何も置かれていないボードを用意
        this.board = new Array(State.height);
        for (var i = 0; i < State.height; i++) {
            this.board[i] = new Array(State.width);
            for (var j = 0; j < State.width; j++) {
                this.board[i][j] = new Cell();
            }
        }
        // 真ん中に白黒を 2 つずつ置く
        for (var i = 0; i <= 1; i++) {
            for (var j = 0; j <= 1; j++) {
                this.board[State.height / 2 - i][State.width / 2 - j].set((i + j) % 2 == 0 ? Cell.black : Cell.white);
            }
        }
    }
    // 描画する
    // 返り値は void
    State.prototype.draw = function () {
        // ボードの中身を数値化してホイ
        var numBoard = new Array(State.height);
        for (var i = 0; i < State.height; ++i) {
            numBoard[i] = new Array(State.width);
            for (var j = 0; j < State.width; ++j) {
                numBoard[i][j] = this.board[i][j].color;
            }
        }
        console.log(numBoard);
    };
    // 石を置いてどういう状態になるかを見る
    // 少なくとも一枚裏返しているなら true, そうでないなら false を返す
    // color: 石の色, y, x: 石を置く場所
    State.prototype.move = function (cell, y, x) {
        // 既に石が置かれてるところだったら無理
        if (this.board[y][x].get() != Cell.none)
            return false;
        // color と反対の石の色
        var rColor = cell.reverse();
        // 周辺 8 方向
        var dx = [1, 1, 0, -1, -1, -1, 0, 1];
        var dy = [0, -1, -1, -1, 0, 1, 1, 1];
        var result = false;
        // 8 方向それぞれについて調べる
        for (var k = 0; k < 8; k++) {
            // 反転する予定の石の数
            var reverseNum = 0;
            // 裏返るか
            var isReversed = false;
            var cy = y + dy[k], cx = x + dx[k];
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
    };
    // どこかに石をおけるか判定する
    State.prototype.canMove = function (cell) {
        for (var i = 0; i < State.height; ++i) {
            for (var j = 0; j < State.width; ++j) {
                if (this.canMoveInPos(cell, i, j))
                    return true;
            }
        }
        return false;
    };
    // コピーを作る
    State.prototype.clone = function () {
        var result = new State();
        for (var i = 0; i < State.height; ++i) {
            for (var j = 0; j < State.width; ++j) {
                result.board[i][j] = this.board[i][j];
            }
        }
        return result;
    };
    // 石を置けるか判定する
    // ほとんど上と同じ
    State.prototype.canMoveInPos = function (cell, y, x) {
        // 既に石が置かれてるところだったら無理
        if (this.board[y][x].get() != Cell.none)
            return false;
        // color と反対の石の色
        var rColor = cell.reverse();
        // 周辺 8 方向
        var dx = [1, 1, 0, -1, -1, -1, 0, 1];
        var dy = [0, -1, -1, -1, 0, 1, 1, 1];
        // 8 方向それぞれについて調べる
        for (var k = 0; k < 8; k++) {
            // 反転する予定の石の数
            var reverseNum = 0;
            // 裏返るか
            var isReversed = false;
            var cy = y + dy[k], cx = x + dx[k];
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
    };
    State.height = 8;
    State.width = 8;
    return State;
}());
var BoardCell = /** @class */ (function () {
    function BoardCell(parent, y, x) {
        // セルの設定
        this.backgroundElem = document.createElement("div");
        this.backgroundElem.classList.add("backgroundCell");
        this.backgroundElem.style.height = BoardCell.cellHeight + "px";
        this.backgroundElem.style.width = BoardCell.cellWidth + "px";
        this.backgroundElem.style.border = BoardCell.cellBorder + "px solid white";
        this.backgroundElem.style.top = (BoardCell.cellHeight + BoardCell.cellBorder) * y + BoardCell.cellBorder + "px";
        this.backgroundElem.style.left = (BoardCell.cellWidth + BoardCell.cellBorder) * x + BoardCell.cellBorder + "px";
        this.backgroundElem.style.backgroundColor = BoardCell.backgroundColor;
        // 石の色の設定
        this.elem = document.createElement("div");
        this.elem.classList.add("gameCell");
        this.elem.style.height = BoardCell.cellRadius * 2 + "px";
        this.elem.style.width = BoardCell.cellRadius * 2 + "px";
        this.elem.style.top = (BoardCell.cellHeight / 2 - BoardCell.cellBorder - BoardCell.cellRadius) + "px";
        this.elem.style.left = (BoardCell.cellWidth / 2 - BoardCell.cellBorder - BoardCell.cellRadius) + "px";
        this.elem.style.backgroundColor = BoardCell.backgroundColor;
        this.backgroundElem.appendChild(this.elem);
        parent.appendChild(this.backgroundElem);
    }
    // 石の色を変える
    BoardCell.prototype.setColor = function (y, x, cell) {
        var color = BoardCell.backgroundColor;
        if (cell.get() === Cell.black) {
            color = BoardCell.blackColor;
        }
        else if (cell.get() === Cell.white) {
            color = BoardCell.whiteColor;
        }
        this.elem.style.backgroundColor = color;
    };
    // 枠の色を変える
    BoardCell.prototype.changeBorderColor = function (color) {
        this.backgroundElem.style.border = BoardCell.cellBorder + "px solid " + color;
    };
    BoardCell.cellHeight = 50;
    BoardCell.cellWidth = 50;
    BoardCell.cellBorder = 1.5;
    BoardCell.cellRadius = 20;
    BoardCell.backgroundColor = "green";
    BoardCell.whiteColor = "white";
    BoardCell.blackColor = "black";
    return BoardCell;
}());
var Board = /** @class */ (function () {
    function Board() {
        this.parent = document.getElementById("gameBoard");
        this.parent.style.height = (BoardCell.cellHeight + BoardCell.cellBorder) * State.height + BoardCell.cellBorder + "px";
        this.parent.style.width = (BoardCell.cellWidth + BoardCell.cellBorder) * State.width + BoardCell.cellBorder + "px";
        this.state = new State();
        this.cellBoard = new Array(State.height);
        for (var i = 0; i < State.height; ++i) {
            this.cellBoard[i] = new Array(State.width);
            for (var j = 0; j < State.width; ++j) {
                this.cellBoard[i][j] = new BoardCell(this.parent, i, j);
            }
        }
    }
    // 石の色と場所を決めたらひっくり返していただく
    // 動かせたら true, 動かせなかったら false
    Board.prototype.move = function (cell, y, x) {
        return this.state.move(cell, y, x);
    };
    // 描画する
    Board.prototype.draw = function () {
        for (var i = 0; i < State.height; ++i) {
            for (var j = 0; j < State.width; ++j) {
                this.cellBoard[i][j].setColor(i, j, this.state.board[i][j]);
            }
        }
    };
    // 指定された石の色でどこかに置けるか確認する
    Board.prototype.canMove = function (cell) {
        return this.state.canMove(cell);
    };
    // 指定された石の色で特定の位置に置けるか確認する
    Board.prototype.canMoveInPos = function (cell, y, x) {
        return this.state.canMoveInPos(cell, y, x);
    };
    return Board;
}());
var Player = /** @class */ (function () {
    function Player(color, board) {
        this.cell = new Cell();
        if (color === "white") {
            this.cell.set(Cell.white);
        }
        else if (color === "black") {
            this.cell.set(Cell.black);
        }
        else {
            console.error("player's color is set invalidly.");
        }
        this.board = board;
    }
    // 石を置けるか判定する
    Player.prototype.canMove = function () {
        return this.board.canMove(this.cell);
    };
    // 特定の位置に石が置けるか判定する
    Player.prototype.canMoveInPos = function (y, x) {
        return this.board.canMoveInPos(this.cell, y, x);
    };
    // 石を置く
    // valid な置き方なら true, そうでないなら false
    Player.prototype.move = function (y, x) {
        return this.board.move(this.cell, y, x);
    };
    return Player;
}());
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.board = new Board();
        this.players = new Array(2);
        this.players[0] = new Player("black", this.board);
        this.players[1] = new Player("white", this.board);
        this.turn = 0;
        this.board.parent.addEventListener("click", function (e) {
            _this.clickEvent(e);
        });
        this.board.parent.addEventListener("mouseover", function (e) {
            _this.mouseoverEvent(e);
        });
        this.board.parent.addEventListener("mouseout", function (e) {
            _this.mouseoutEvent();
        });
        this.draw();
    }
    // 試合終了か判定
    Game.prototype.isFinished = function () {
        return !this.players[0].canMove() && !this.players[1].canMove();
    };
    // 指定の人が石を置く
    // 正しく置けたら true そうでなかったら false
    Game.prototype.move = function (y, x) {
        var result = this.players[this.turn].move(y, x);
        if (this.isFinished()) {
            this.draw(true);
            return true;
        }
        if (result) {
            this.turn = this.nextPlayer();
        }
        this.draw();
        return result;
    };
    Game.prototype.draw = function (isFinished) {
        if (isFinished === void 0) { isFinished = false; }
        // ボードの描画
        this.board.draw();
        // 得点の描画
        var white = 0, black = 0;
        for (var i = 0; i < State.height; ++i) {
            for (var j = 0; j < State.width; ++j) {
                if (this.board.state.board[i][j].get() === Cell.white)
                    ++white;
                else if (this.board.state.board[i][j].get() === Cell.black)
                    ++black;
            }
        }
        var blackDisplay = document.getElementById("blackDisplay");
        var whiteDisplay = document.getElementById("whiteDisplay");
        blackDisplay.textContent = "" + black;
        whiteDisplay.textContent = "" + white;
        if (isFinished) {
            blackDisplay.style.border = "3px solid red";
            whiteDisplay.style.border = "3px solid red";
        }
        else {
            if (this.turn === 0) {
                blackDisplay.style.border = "3px solid red";
                whiteDisplay.style.border = "3px solid black";
            }
            else {
                blackDisplay.style.border = "3px solid black";
                whiteDisplay.style.border = "3px solid red";
            }
        }
    };
    // 次に石を置く player が 0 か 1 か判定
    Game.prototype.nextPlayer = function () {
        var next = (this.turn ^ 1);
        if (this.players[next].canMove()) {
            return next;
        }
        else {
            return this.turn;
        }
    };
    Game.prototype.clickEvent = function (e) {
        var target_rect = e.currentTarget.getBoundingClientRect();
        var _a = this.getPos(e.clientY, e.clientX, target_rect.top, target_rect.left), y = _a[0], x = _a[1];
        this.move(y, x);
    };
    Game.prototype.mouseoverEvent = function (e) {
        var target_rect = e.currentTarget.getBoundingClientRect();
        var _a = this.getPos(e.clientY, e.clientX, target_rect.top, target_rect.left), y = _a[0], x = _a[1];
        for (var i = 0; i < State.height; ++i) {
            for (var j = 0; j < State.width; ++j) {
                if (i === y && j === x && this.players[this.turn].canMoveInPos(y, x)) {
                    this.board.cellBoard[i][j].changeBorderColor("red");
                }
                else {
                    this.board.cellBoard[i][j].changeBorderColor("white");
                }
            }
        }
    };
    Game.prototype.mouseoutEvent = function () {
        for (var i = 0; i < State.height; ++i) {
            for (var j = 0; j < State.width; ++j) {
                this.board.cellBoard[i][j].changeBorderColor("white");
            }
        }
    };
    Game.prototype.getPos = function (clientY, clientX, offsetY, offsetX) {
        var y = clientY - offsetY;
        var x = clientX - offsetX;
        y = Math.floor(y / (BoardCell.cellHeight + BoardCell.cellBorder));
        x = Math.floor(x / (BoardCell.cellWidth + BoardCell.cellBorder));
        y = Math.min(y, State.height - 1);
        x = Math.min(x, State.width - 1);
        return [y, x];
    };
    return Game;
}());
var game = new Game();
