class canvas_front {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bgLayer = new FullscreenCanvas(canvas);
    this.mainLayer = new FullscreenCanvas(canvas);
    this.shapeLayer = new FullscreenCanvas(canvas, true);
    this.STEP_LENGTH = 1;
    this.CELL_SIZE = 10;
    this.BORDER_WIDTH = 2;
    this.MAX_FONT_SIZE = 500;
    this.MAX_ELECTRONS = 100;
    this.CELL_DISTANCE = this.CELL_SIZE + this.BORDER_WIDTH;
    this.CELL_REPAINT_INTERVAL = [300, 500];
    this.BG_COLOR = '#1d2227';
    this.BORDER_COLOR = '#13191f';
    this.CELL_HIGHLIGHT = '#328bf6';
    this.ELECTRON_COLOR = '#00b07c';
    this.FONT_COLOR = '#ff5353';
    this.FONT_FAMILY = 'Helvetica, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuan Yi Micro Hei", sans-serif';
    this.DPR = window.devicePixelRatio || 1;
    this.ACTIVE_ELECTRONS = [];
    this.PINNED_CELLS = [];
    this.MOVE_TRAILS = [
      [0, 1], // down
      [0, -1], // up
      [1, 0], // right
      [-1, 0], // left
    ].map(([x, y]) => [x * this.CELL_DISTANCE, y * this.CELL_DISTANCE]);
    this.END_POINTS_OFFSET = [
      [0, 0], // left top
      [0, 1], // left bottom
      [1, 0], // right top
      [1, 1], // right bottom
    ].map(([x, y]) => [
      x * this.CELL_DISTANCE - this.BORDER_WIDTH / 2,
      y * this.CELL_DISTANCE - this.BORDER_WIDTH / 2,
    ]);
    this.shape = {
      lastText: '',
      lastMatrix: null,
      renderID: undefined,
      isAlive: false,
      electronOptions: {
        speed: 2,
        color: this.FONT_COLOR,
        lifeTime: this.randomInt(300, 500),
      },
      cellOptions: {
        background: this.FONT_COLOR,
        electronCount: this.randomInt(1, 4),
        electronOptions: {
          speed: 2,
          color: this.FONT_COLOR,
          lifeTime: this.randomInt(300, 500),
        },
      },
      explodeOptions: {
        electronOptions: {
          speed: 2,
          color: this.FONT_COLOR,
          lifeTime: this.randomInt(500, 1500),
        },
      },
    };
  }

  init() {
    if (this.shape.isAlive) {
      return;
    }
    this.bgLayer.onResize(this.drawGrid.bind(this));
    this.mainLayer.onResize(this.prepaint.bind(this));
    this.shapeLayer.onResize(() => {
      if (this.shape.lastText) {
        this.print(this.shape.lastText);
      }
    });
    this.prepaint();
    this.render();
    this.unbindEvents = this.handlePointer();
    this.shape.isAlive = true;
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  clear() {
    const {
      lastMatrix,
    } = this.shape;

    this.shape.lastText = '';
    this.shape.lastMatrix = null;
    this.PINNED_CELLS.length = 0;

    if (lastMatrix) {
      this.explode(lastMatrix);
    }
  }

  destroy() {
    if (!this.shape.isAlive) {
      return;
    }

    this.bgLayer.remove();
    this.mainLayer.remove();
    this.shapeLayer.remove();

    this.unbindEvents();

    cancelAnimationFrame(this.shape.renderID);

    this.ACTIVE_ELECTRONS.length = this.PINNED_CELLS.length = 0;
    this.shape.lastMatrix = null;
    this.shape.lastText = '';
    this.shape.isAlive = false;
  }

  getTextMatrix(
    text,
    {
      fontWeight = 'bold',
      fontFamily = this.FONT_FAMILY,
    } = {},
  ) {
    const {
      width,
      height,
    } = this.shapeLayer;

    this.shapeLayer.repaint((ctx) => {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${fontWeight} ${this.MAX_FONT_SIZE}px ${fontFamily}`;

      const scale = width / ctx.measureText(text).width;
      const fontSize = Math.min(this.MAX_FONT_SIZE, this.MAX_FONT_SIZE * scale * 0.8);

      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

      ctx.fillText(text, width / 2, height / 2);
    });

    const pixels = this.shapeLayer.context.getImageData(0, 0, width, height).data;
    const matrix = [];

    for (let i = 0; i < height; i += this.CELL_DISTANCE) {
      for (let j = 0; j < width; j += this.CELL_DISTANCE) {
        const alpha = pixels[(j + i * width) * 4 + 3];

        if (alpha > 0) {
          matrix.push([
            Math.floor(i / this.CELL_DISTANCE),
            Math.floor(j / this.CELL_DISTANCE),
          ]);
        }
      }
    }

    return matrix;
  }

  print(text, options) {
    const isBlank = !!this.shape.lastText;

    this.clear();

    if (text !== 0 && !text) {
      if (isBlank) {
        this.spiral({
          reverse: true,
          lifeTime: 500,
          electronCount: 2,
        });
      }

      return;
    }

    this.spiral();

    this.shape.lastText = text;

    const matrix = this.shape.lastMatrix = _.shuffle(this.getTextMatrix(text, options));

    matrix.forEach(([i, j]) => {
      const cell = new Cell(i, j, this.shape.cellOptions);

      cell.scheduleUpdate(200);
      cell.pin();
    });
  }

  spiral({
    radius,
    increment = 0,
    reverse = false,
    lifeTime = 250,
    electronCount = 1,
    forceElectrons = true,
  } = {}) {
    const {
      width,
      height,
    } = this.mainLayer;

    const cols = Math.floor(width / this.CELL_DISTANCE);
    const rows = Math.floor(height / this.CELL_DISTANCE);

    const ox = Math.floor(cols / 2);
    const oy = Math.floor(rows / 2);

    let cnt = 1;
    let deg = _.random(360);
    let r = radius === undefined ? Math.floor(Math.min(cols, rows) / 3) : radius;

    const step = reverse ? 15 : -15;
    const max = Math.abs(360 / step);

    while (cnt <= max) {
      const i = oy + Math.floor(r * Math.sin(deg / 180 * Math.PI));
      const j = ox + Math.floor(r * Math.cos(deg / 180 * Math.PI));

      const cell = new Cell(i, j, {
        electronCount,
        forceElectrons,
        background: this.CELL_HIGHLIGHT,
        electronOptions: {
          lifeTime,
          speed: 3,
          color: this.CELL_HIGHLIGHT,
        },
      });

      cell.delay(cnt * 16);

      cnt++;
      deg += step;
      r += increment;
    }
  }

  explode(matrix) {
    this.stripOld();

    if (matrix) {
      const { length } = matrix;

      const max = Math.min(
        50,
        _.random(Math.floor(length / 20), Math.floor(length / 10)),
      );

      for (let idx = 0; idx < max; idx++) {
        const [i, j] = matrix[idx];

        const cell = new Cell(i, j, this.shape.explodeOptions);

        cell.paintNextTo(this.mainLayer);
      }
    } else {
      const max = _.random(10, 20);

      for (let idx = 0; idx < max; idx++) {
        this.createRandomCell(this.shape.explodeOptions);
      }
    }
  }

  stripOld(limit = 1000) {
    const now = Date.now();

    for (let i = 0, max = this.ACTIVE_ELECTRONS.length; i < max; i++) {
      const e = this.ACTIVE_ELECTRONS[i];

      if (e.expireAt - now < limit) {
        this.ACTIVE_ELECTRONS.splice(i, 1);

        i--;
        max--;
      }
    }
  }

  createRandomCell(options = {}) {
    if (this.ACTIVE_ELECTRONS.length >= this.MAX_ELECTRONS) return;

    const { width, height } = this.mainLayer;

    const cell = new Cell(
      _.random(height / this.CELL_DISTANCE),
      _.random(width / this.CELL_DISTANCE),
      options,
    );

    cell.paintNextTo(this.mainLayer);
  }

  drawGrid() {
    this.bgLayer.paint((ctx, { width, height }) => {
      ctx.fillStyle = this.BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = this.BORDER_COLOR;

      for (let h = this.CELL_SIZE; h < height; h += this.CELL_DISTANCE) {
        ctx.fillRect(0, h, width, this.BORDER_WIDTH);
      }

      for (let w = this.CELL_SIZE; w < width; w += this.CELL_DISTANCE) {
        ctx.fillRect(w, 0, this.BORDER_WIDTH, height);
      }
    });
  }

  iterateItemsIn(list) {
    const now = Date.now();

    for (let i = 0, max = list.length; i < max; i++) {
      const item = list[i];

      if (now >= item.expireAt) {
        list.splice(i, 1);
        i--;
        max--;
      } else {
        item.paintNextTo(this.mainLayer);
      }
    }
  }

  drawItems() {
    this.iterateItemsIn(this.PINNED_CELLS);
    this.iterateItemsIn(this.ACTIVE_ELECTRONS);
  }

  activateRandom() {
    const now = Date.now();

    if (now < this.nextRandomAt) {
      return;
    }

    this.nextRandomAt = now + _.random(300, 1000);

    this.createRandomCell();
  }

  handlePointer() {
    let lastCell = [];
    let touchRecords = {};

    const isSameCell = (i, j) => {
      const [li, lj] = lastCell;

      lastCell = [i, j];

      return i === li && j === lj;
    };

    const print = (isMove, { clientX, clientY }) => {
      const i = Math.floor(clientY / this.CELL_DISTANCE);
      const j = Math.floor(clientX / this.CELL_DISTANCE);

      if (isMove && isSameCell(i, j)) {
        return;
      }

      const cell = new Cell(i, j, {
        background: this.CELL_HIGHLIGHT,
        forceElectrons: true,
        electronCount: isMove ? 2 : 4,
        electronOptions: {
          speed: 3,
          lifeTime: isMove ? 500 : 1000,
          color: this.CELL_HIGHLIGHT,
        },
      });

      cell.paintNextTo(this.mainLayer);
    };

    const handlers = {
      touchend({ changedTouches }) {
        if (changedTouches) {
          Array.from(changedTouches).forEach(({ identifier }) => {
            delete touchRecords[identifier];
          });
        } else {
          touchRecords = {};
        }
      },
    };

    const filterTouches = (touchList) => {
      return Array.from(touchList).filter(({ identifier, clientX, clientY }) => {
        const rec = touchRecords[identifier];
        touchRecords[identifier] = { clientX, clientY };

        return !rec || clientX !== rec.clientX || clientY !== rec.clientY;
      });
    };

    [
      'mousedown',
      'touchstart',
      'mousemove',
      'touchmove',
    ].forEach(name => {
      const isMove = /move/.test(name);
      const isTouch = /touch/.test(name);

      const fn = print.bind(null, isMove);

      handlers[name] = function handler(evt) {
        if (isTouch) {
          filterTouches(evt.touches).forEach(fn);
        } else {
          fn(evt);
        }
      };
    });

    const events = Object.keys(handlers);

    events.forEach(name => {
      document.addEventListener(name, handlers[name]);
    });

    return () => {
      events.forEach(name => {
        document.removeEventListener(name, handlers[name]);
      });
    };
  }

  prepaint() {
    this.drawGrid();

    this.mainLayer.paint((ctx, { width, height }) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
    });

    this.mainLayer.blendBackground(this.bgLayer.canvas, 0.9);
  }

  render() {
    this.mainLayer.blendBackground(this.bgLayer.canvas);

    this.drawItems();
    this.activateRandom();

    this.shape.renderID = requestAnimationFrame(() => this.render());
  }

  queue() {
    const text = 'BBAE';

    let i = 0;
    const max = text.length;

    const run = () => {
      if (i >= max) return;

      this.print(text.slice(0, ++i));
      this.timer = setTimeout(run, 1e3 + i);
    };

    run();
  }

  countdown() {
    const arr = _.range(3, 0, -1);

    let i = 0;
    const max = arr.length;

    const run = () => {
      if (i >= max) {
        this.clear();
        return this.galaxy();
      }

      this.print(arr[i++]);
      setTimeout(run, 1e3 + i);
    };

    run();
  }

  galaxy() {
    this.spiral({
      radius: 0,
      increment: 1,
      lifeTime: 100,
      electronCount: 1,
    });

    this.timer = setTimeout(() => this.galaxy(), 16);
  }

  ring() {
    this.spiral();

    this.timer = setTimeout(() => this.ring(), 16);}}