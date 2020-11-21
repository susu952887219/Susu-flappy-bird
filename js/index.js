var bird={
  skyPosition : 0,
  skyStep : 2,
  birdTop : 220,
  birdStepY : 0,
  startColor : 'blue',
  startFlag : false,
  minTop : 0,
  maxTop : 570,

  //初始化函数
    init:function(){
      this.initData();
      this.animate();
      this.handle();

    },
    initData:function(){
      this.el=document.getElementById('game');
      this.oBird=this.el.getElementsByClassName('bird')[0];
      this.oStart=this.el.getElementsByClassName('start')[0];
      this.oScore=this.el.getElementsByClassName('score')[0];
      this.oMask=this.el.getElementsByClassName('mask')[0];
      this.oEnd=this.el.getElementsByClassName('end')[0];


    },
    //动画函数
    animate:function(){

      var count=0;
       //this===bird
      var self=this;

      this.timer=setInterval(function(){
         //this===window
        self.skyMove();
        //让定时器每运行10次再运行小鸟蹦的函数
        if(++ count % 10 === 0){
          if(self.startFlag){
            self.birdDrop();
          }
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
    },

    handle:function(){
      this.handleStart();

    },
    handleStart:function(){
      var self=this;
      this.oStart.onclick = function(){
        self.startFlag = true;
        self.oScore.style.display = 'block';
        self.oStart.style.display = 'none';
        self.skyStep = 5;
        self.oBird.style.left = 80 + 'px';

      }

    },
    //游戏结束
    failGame:function(){
      clearInterval(this.timer);
      this.oMask.style.display = 'block';
      this.oEnd.style.display = 'block';
      this.oScore.style.display = 'none';
      this.oBird.style.display = 'none';
    },
    
    
};





  
  
  
  
  