// 定义弹球计数变量  
let count = 0; // 用于记录当前存在的彩球数量  
const para = document.querySelector('p'); // 获取页面中的 <p> 元素，用于动态显示剩余彩球数  
  
// 设置画布  
const canvas = document.querySelector('canvas'); // 获取页面中的 <canvas> 元素  
const ctx = canvas.getContext('2d'); // 获取 2D 渲染上下文，用于绘制图形  
canvas.width = window.innerWidth; // 设置画布宽度为浏览器窗口宽度  
canvas.height = window.innerHeight; // 设置画布高度为浏览器窗口高度  
  
// 生成随机数的函数  
function random(min, max) {  
  // 生成一个在 [min, max] 范围内的随机整数  
  return Math.floor(Math.random() * (max - min + 1)) + min;  
}  
  
// 生成随机颜色值的函数  
function randomColor() {  
  // 返回一个随机的 rgb 颜色字符串  
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;  
}  
  
// 定义 Shape 构造器，作为所有形状的基础类  
function Shape(x, y, velX, velY, exists) {  
  // 初始化形状的位置、速度、存在状态等属性  
  this.x = x; // 水平位置  
  this.y = y; // 垂直位置  
  this.velX = velX; // 水平速度  
  this.velY = velY; // 垂直速度  
  this.exists = exists; // 是否存在  
}  
  
// 定义 Ball 构造器，继承自 Shape  
function Ball(x, y, velX, velY, exists, color, size) {  
  // 调用 Shape 构造器初始化基础属性  
  Shape.call(this, x, y, velX, velY, exists);  
  // 初始化球的特有属性  
  this.color = color; // 颜色  
  this.size = size; // 尺寸  
}  
  
// 设置 Ball 的原型链，使其继承 Shape 的属性和方法  
Ball.prototype = Object.create(Shape.prototype);  
Ball.prototype.constructor = Ball;  
  
// 定义 Ball 的绘制方法  
Ball.prototype.draw = function() {  
  // 使用 ctx 绘制一个圆，表示球  
  ctx.beginPath();  
  ctx.fillStyle = this.color;  
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  
  ctx.fill();  
};  
  
// 定义 Ball 的更新方法，用于移动球并检测边界碰撞  
Ball.prototype.update = function() {  
  // 边界碰撞检测并反转速度  
  if (this.x + this.size > canvas.width || this.x - this.size < 0) {  
    this.velX = -this.velX;  
  }  
  if (this.y + this.size > canvas.height || this.y - this.size < 0) {  
    this.velY = -this.velY;  
  }  
  // 更新位置  
  this.x += this.velX;  
  this.y += this.velY;  
};  
  
// 定义 Ball 的碰撞检测方法，用于检测球之间的碰撞并改变颜色  
Ball.prototype.collisionDetect = function() {  
  // 遍历所有球，检测当前球是否与其他球碰撞  
  for (let j = 0; j < balls.length; j++) {  
    if (this !== balls[j] && balls[j].exists) {  
      // 计算两球之间的距离  
      const dx = this.x - balls[j].x;  
      const dy = this.y - balls[j].y;  
      const distance = Math.sqrt(dx * dx + dy * dy);  
      // 如果距离小于两球半径之和，则发生碰撞，改变颜色  
      if (distance < this.size + balls[j].size) {  
        balls[j].color = this.color = randomColor();  
      }  
    }  
  }  
};  
  
// 定义 EvilCircle 构造器，继承自 Shape  
function EvilCircle(x, y, exists) {  
  // 调用 Shape 构造器初始化基础属性，设置固定速度和存在状态  
  Shape.call(this, x, y, 20, 20, exists);  
  // 初始化 EvilCircle 的特有属性  
  this.color = 'white'; // 颜色  
  this.size = 10; // 尺寸  
}  
  
// 设置 EvilCircle 的原型链，使其继承 Shape 的属性和方法  
EvilCircle.prototype = Object.create(Shape.prototype);  
EvilCircle.prototype.constructor = EvilCircle;  
  
// 定义 EvilCircle 的绘制方法  
EvilCircle.prototype.draw = function() {  
  // 使用 ctx 绘制一个圆，表示 EvilCircle，但使用描边而不是填充  
  ctx.beginPath();  
  ctx.strokeStyle = this.color;  
  ctx.lineWidth = 3;  
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  
  ctx.stroke();  
};  
  
// 定义 EvilCircle 的边界检测方法  
EvilCircle.prototype.checkBounds = function() {  
  // 边界碰撞检测并调整位置，确保 EvilCircle 始终在画布内  
  if (this.x + this.size > canvas.width) {  
    this.x = canvas.width - this.size;  
  }  
  if (this.x - this.size < 0) {  
    this.x = this.size;  
  }  
  if (this.y + this.size > canvas.height) {  
    this.y = canvas.height - this.size;  
  }  
  if (this.y - this.size < 0) {  
    this.y = this.size;  
  }  
};  
  
// 定义 EvilCircle 的键盘控制方法  
EvilCircle.prototype.setControls = function() {  
  // 设置键盘事件监听器，根据按键调整 EvilCircle 的位置  
  window.onkeydown = (e) => {  
    switch (e.key) {  
      case 'a':  
      case 'A':  
      case 'ArrowLeft':  
        this.x -= 20;  
        break;  
      case 'd':  
      case 'D':  
      case 'ArrowRight':  
        this.x += 20;  
        break;  
      case 'w':  
      case 'W':  
      case 'ArrowUp':  
        this.y -= 20;  
        break;  
      case 's':  
      case 'S':  
      case 'ArrowDown':  
        this.y += 20;  
        break;  
    }  
  };  
};  
  
// 定义 EvilCircle 的碰撞检测方法，用于检测与球的碰撞并删除球  
EvilCircle.prototype.collisionDetect = function() {  
  // 遍历所有球，检测 EvilCircle 是否与球碰撞  
  for (let j = 0; j < balls.length; j++) {  
    if (balls[j].exists) {  
      // 计算 EvilCircle 与球之间的距离  
      const dx = this.x - balls[j].x;  
      const dy = this.y - balls[j].y;  
      const distance = Math.sqrt(dx * dx + dy * dy);  
      // 如果距离小于 EvilCircle 与球半径之和，则发生碰撞，删除球  
      if (distance < this.size + balls[j].size) {  
        balls[j].exists = false;  
        count--; // 更新剩余球数  
        para.textContent = `剩余彩球数：${count}`; // 更新页面显示  
      }  
    }  
  }  
};  
  
// 初始化球数组  
const balls = []; // 创建一个空数组用于存储球  
while (balls.length < 25) { // 循环生成 25 个球  
  const size = random(10, 20); // 随机生成球的尺寸  
  const ball = new Ball(  
    random(size, canvas.width - size), // 随机生成球的水平位置  
    random(size, canvas.height - size), // 随机生成球的垂直位置  
    random(-7, 7), // 随机生成球的水平速度  
    random(-7, 7), // 随机生成球的垂直速度  
    true, // 球存在  
    randomColor(), // 随机生成球的颜色  
    size // 球的尺寸  
  );  
  balls.push(ball); // 将球添加到数组中  
  count++; // 更新剩余球数  
  para.textContent = `剩余彩球数：${count}`; // 更新页面显示  
}  
  
// 创建 EvilCircle 实例并设置控制  
const evil = new EvilCircle(random(0, canvas.width), random(0, canvas.height), true); // 创建 EvilCircle 实例  
evil.setControls(); // 设置 EvilCircle 的键盘控制  
  
// 游戏主循环  
function loop() {  
  // 清屏，绘制一个半透明的黑色矩形覆盖整个画布  
  ctx.fillStyle = 'rgba(0,0,0,0.25)';  
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  
  for (let i = 0; i < balls.length; i++) {  
    if (balls[i].exists) {  
      balls[i].draw(); // 绘制球  
      balls[i].update(); // 更新球的位置  
      balls[i].collisionDetect(); // 检测球之间的碰撞  
    }  
  }  
  
  evil.draw(); // 绘制 EvilCircle  
  evil.checkBounds(); // 检测 EvilCircle 的边界  
  evil.collisionDetect(); // 检测 EvilCircle 与球的碰撞  
  
  requestAnimationFrame(loop); // 下一帧继续循环  
}  
  
loop(); // 开始游戏循环