var bird={
  skyPosition : 0,
  skyStep : 2,
  birdTop : 220,
  birdStepY : 0,
  startColor : 'blue',
  startFlag : false,
  minTop : 0,
  maxTop : 570,
  pipeLength:7,
  pipeArr:[],
  pipeLastIndex : 6,
  score:0,

  //初始化函数
    init:function(){
      this.initData();
      this.animate();
      this.handle();

      if(sessionStorage.getItem('play')){
        this.start();
      }

    },
    initData:function(){
      this.el=document.getElementById('game');
      this.oBird=this.el.getElementsByClassName('bird')[0];
      this.oStart=this.el.getElementsByClassName('start')[0];
      this.oScore=this.el.getElementsByClassName('score')[0];
      this.oMask=this.el.getElementsByClassName('mask')[0];
      this.oEnd=this.el.getElementsByClassName('end')[0];
      this.oScore=this.el.getElementsByClassName('score')[0];
      this.oFinScore=this.oEnd.getElementsByClassName('fin-score')[0];
      this.oRankList=this.oEnd.getElementsByClassName('rank')[0];
      this.oRestart=this.oEnd.getElementsByClassName('restart')[0];
      this.scoreArr = this.getScore();

    },
    //取数据
    getScore:function(){
      var scoreArr = getLocal('score'); // 键值不存在，值为null
      return scoreArr ? scoreArr : [];
    },
    //动画函数
    animate:function(){

      var count=0;
       //this===bird
      var self=this;

      this.timer=setInterval(function(){
         //this===window
        self.skyMove();
        if(self.startFlag){
          self.birdDrop();
          self.pipeMove();
        }
        //让定时器每运行10次再运行小鸟蹦的函数
        if(++ count % 10 === 0){
          if(!self.startFlag) {//startFlag=false的时候执行下面函数
            self.birdJump();
            self.startBound();
          }
          
          self.birdFly(count);
        }
       },30);
    },
    //天空移动
    skyMove:function(){
      
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition+'px';//调整图片位置
    },
    //小鸟蹦
    birdJump:function(){
      
        this.birdTop=this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop +'px';//调整图片位置
    },
    //小鸟扇动翅膀
    birdFly:function(count){
      this.oBird.style.backgroundPositionX = count % 3 * -30 +'px';
    },
    //小鸟往下落
    birdDrop:function(){
      this.birdTop += ++this.birdStepY;
      this.oBird.style.top = this.birdTop + 'px'; 
      //小鸟碰撞检测
      this.judgeKnock();
      //加分
      this.addScore();
    },
    //柱子移动
    pipeMove:function(){
      for(var i = 0;i < this.pipeLength;i ++){
        var oUpPipe= this.pipeArr[i].up;
        var oDownPipe= this.pipeArr[i].down;

        //oddsetLeft取到的是数值，可以直接用来加减，而style.left取到的是带px单位的字符串，不能直接用来加减
        var x = oUpPipe.offsetLeft - this.skyStep;

        if(x < -52){
          //拿到最后一根柱子的left值
          var lastPipeLeft = this .pipeArr[this.pipeLastIndex].up.offsetLeft;
          //将最后一根柱子的left值加上柱子之间的距离300的和作为下一根柱子的left值
          oUpPipe.style.left = lastPipeLeft + 300 + 'px';
          oDownPipe.style.left = lastPipeLeft + 300 + 'px';
          this.pipeLastIndex = ++ this.pipeLastIndex % this.pipeLength;

          //重新设置高度
          // var upHeight = 50 + Math.random() *175;
          // var downHeight = 600 -150 -upHeight;
          // oUpPipe.style.height = upHeight + 'px';
          // oDownPipe.style.height = downHeight + 'px';
          // var pipeHeight = this.getPipeHeight();
          // oUpPipe.style.height = pipeHeight.up + 'px';
          // oDownPipe.style.height = pipeHeight.down + 'px';
          // console.log(oUpPipe.style.height);

          //底下代码没必要执行了，跳出循环，执行下次循环
          continue;
        }
        oUpPipe.style.left = x + 'px';
        //上下柱子的left值是一样的，下柱子可以直接用上柱子的left值
        oDownPipe.style.left = x + 'px';
        
      }
    },
    //求柱子的高度
    getPipeHeight:function(){
      var upHeight = 50 + Math.random() *175;
      var downHeight = 600 -150 -upHeight;
      return{
        up:upHeight,
        down:downHeight,
      }
    },
    //开始文字变化
    startBound:function(){

      var preColor=this.startColor;
      this.startColor = preColor === 'blue' ? 'white' : 'blue';
      this.oStart.classList.remove('start-' + preColor);//一个元素可能又多个类名，classList表示元素的类名列表
      this.oStart.classList.add('start-' + this.startColor);
    },
    judgeKnock:function(){
      this.judgeBoundary();
      this.judgePipe();
    },
    //边界碰撞检测
    judgeBoundary:function(){
      if(this.birdTop < this.minTop || this.birdTop > this.maxTop){
        this.failGame();
      }

    },
    //小鸟与柱子碰撞检测
    judgePipe:function(){

      var index = this.score % this.pipeLength;
      var pipeX = this.pipeArr[index].up.offsetLeft;
      var pipeY = this.pipeArr[index].y;
      var birdY = this.birdTop;
      //相遇的时候 左pipex=95 右pipe=13
      if((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])){
        this.failGame();

      }
    },
    addScore:function(){
      var index = this.score % this.pipeLength;
      var pipeX = this.pipeArr[index].up.offsetLeft;

      //当小鸟左侧与柱子右侧擦肩而过时，此时柱子的left为13，当小于13时，游戏没有结束表示小鸟与柱子没有发生碰撞，分数+1
      if(pipeX < 13){
        this.oScore.innerText = ++this.score;

      }

    },
    //点击事件
    handle:function(){
      this.handleStart();
      this.handClick();
      this.handleReStart();


    },
    //点击开始事件
    handleStart:function(){
      var self=this;
      this.oStart.onclick = this.start.bind(this);
    },
    start:function(){
      var self=this;
        self.startFlag = true;
        self.oScore.style.display = 'block';
        self.oStart.style.display = 'none';
        self.skyStep = 5;
        self.oBird.style.left = 80 + 'px';
        self.oBird.style.transition = 'none';

        //创建多对柱子
        for(var i = 0;i < self.pipeLength;i ++){
          self.createPipe(300 * (i + 1));
        }
    },
    handClick:function(){
      var self = this;
      this.el.onclick = function(e){
        if(!e.target.classList.contains('start')){//contains方法用来判断是否含有该类名
        self.birdStepY = -10;
        }
      }

    },
    //点击重新开始事件
    handleReStart:function(){
      this.oRestart.onclick = function(){
        sessionStorage.setItem('play',true)
        //让页面刷新
        window.location.reload();
        
      }


    },

    //创建柱子
    createPipe:function(x){
      //600-150=450/2=255
      //0 - 255 整数 
      //柱子最短不能短于50px
      //50 - （50 + （275 - 50=175)) 
      // var pipeHeight = this.getPipeHeight();
      // var upHeight = pipeHeight.up;
      // var downHeight = pipeHeight.down;
      var upHeight = 50 + Math.random() *175;
      var downHeight = 600 -150 -upHeight;

      var oUpPipe = createEle('div',['pipe','pipe-up'],{
        height: upHeight + 'px',
        left: x + 'px',

      });
      var oDownPipe = createEle('div',['pipe','pipe-bottom'],{
        height: downHeight + 'px',
        left: x + 'px',

      });
      //将创建的元素添加到父元素中去
      this.el.appendChild(oUpPipe);
      this.el.appendChild(oDownPipe);

      this.pipeArr.push({
        up:oUpPipe,
        down:oDownPipe,
        y:[upHeight,upHeight + 150],
      })


    },
    //存数据
    setScore:function(){
      this.scoreArr.push({
        score:this.score,
        //时间
        time:this.getDate(),
      })

      this.scoreArr.sort(function(a,b){
        return b.score - a.score;
      })

      setLocal('score',this.scoreArr);
    },
    //获取时间
    getDate:function(){
      var d = new Date();
      var year = d.getFullYear();
      var month = formatNum(d.getMonth() + 1);
      var day = formatNum(d.getDate());
      var hour = formatNum(d.getHours());
      var minute = formatNum(d. getMinutes());
      var second = formatNum(d.getSeconds());

      return `${year}.${month}.${day} ${hour}:${minute}:${second}`;

    },
    //游戏结束
    failGame:function(){
      clearInterval(this.timer);
      this.setScore();
      this.oMask.style.display = 'block';
      this.oEnd.style.display = 'block';
      this.oScore.style.display = 'none';
      this.oBird.style.display = 'none';
      this.oFinScore.innerText = this.score;
      this.renderRankList();
    },
    renderRankList:function(){
      var template = '';
      for(var i = 0;i < this.scoreArr.length && i < 8; i++){
        var degreeClass = '';
        switch (i) {
          case 0:
            degreeClass = 'first';
            break;
          case 1:
            degreeClass = 'second';
            break;
          case 2:
            degreeClass = 'third';
            break;
        }

        template +=`
          <li class='rank-item'>
            <span class="number ${degreeClass}">${i + 1}</span>
            <span class="score-item">${this.scoreArr[i].score}</span>
            <span class="time">${this.scoreArr[i].time}</span>
          </li>
        `;
      };
      this.oRankList.innerHTML = template;

    },
    
};





  
  
  
  
  