            //.======.
            //| INRI |
            //|      |
  //          |      |
  // .========'      '========.
  // |   _      xxxx      _   |
  // |  /_;-.__ / _\  _.-;_\  |
  // |     `-._`'`_/'`.-'     |
  // '========.`\   /`========'
  //          | |  / |
  //          |/-.(  |
            //|\_._\ |
            //| \ \`;|
            //|  > |/|
            //| / // |
            //| |//  |
            //| \(\  |  BEWARE THE GOD CLASS
            //|  ``  |
            //|      |
            //|      |
            //|      |
            //|      |
//\\jgs _  _\\| \//  |//_   _ \// _
// ^ `^`^ ^`` `^ ^` ``^^`  `^^` `^ `^

function Game(){


  this.throwsLeft = 21;
  this.framesPlayed = 0;
  this.totalScore = 0;

  this.currentFrameScores=[]
  this.bonusArray=[]
  this.results=[]
  this.bonusHandler = new BonusHandler();
  this.frameTerminator = new FrameTerminator();
  this.score = 0
  this.frameTotals =[]


  this.updateCurrentFrameScores=function(){
    this.currentFrameScores.push(this.score);
  }


  this.throwBall = function(score){
    this.score=score
    this.currentFramesPlayed=this.framesPlayed

    if (this.throwsLeft>0){
      this.updateCurrentFrameScores();
      this.applyBonusPointsIfRequired();

      this.logFrameScores()

      if(this.isBonus()){
        this.activateBonus();
      }
      if(this.isFrameOver()){

        if(!this.isBonus()){
          this.updateCurrentTotal();
        }
        this.resetCurrentFrameScores();
        //Update frames at the end of the frame over check for correct referencing
        this.incrementFrameNumber();
      }
      this.updateThrowsLeft();
    }

  }

  this.incrementFrameNumber = function(){
    this.framesPlayed +=1
  }

  this.logFrameScores=function(){

    (this.currentFrameScores[0]) ? throw1Score = this.currentFrameScores[0] : throw1Score = 0 ;
    (this.currentFrameScores[1]) ? throw2Score = this.currentFrameScores[1] : throw2Score = 0 ;
    (this.currentFrameScores[2]) ? throw3Score = this.currentFrameScores[2] : throw3Score = 0 ;

    this.results[this.currentFramesPlayed]={
      throw1: throw1Score,
      throw2: throw2Score,
      throw3: throw3Score,
      bonus: 0}
  }

  this.updateCurrentTotal = function(){
    frameScore = this.results[this.currentFramesPlayed].throw1 + this.results[this.framesPlayed].throw2;
    this.totalScore += frameScore;
  }

  this.resetCurrentFrameScores=function(){
    this.currentFrameScores=[]
  }

  this.updateThrowsLeft = function(){
    if(!this.isInFrame10()){
      if(this.isStrikeRound()){
        this.throwsLeft-=2;
      }
      else if (this.throwsLeft > 2){
        this.throwsLeft -= 1;
      }else if (this.throwsLeft == 2){
        this.throwsLeft -= 2;
      }
    }else{
      if(this.throwsLeft==2 && !this.isBonus()){
        this.throwsLeft -=2;
      }else{
        this.throwsLeft -=1;
      }
    }
  }

  this.isBonus = function(){
    //HAS SWITCH FOR FINAL THROW
    if(!this.throwsLeft<=2){
      throw1 = this.results[this.currentFramesPlayed].throw1
      if (throw1 == 10){
        return true
      }
      throw2 = this.results[this.currentFramesPlayed].throw2
      return (throw1+throw2==10)
      
    }else{
      return false
    }

  }

//FRAME TERMINATOR EXTRACTION

  this.isFrameOver=function(){
    endOfRegularFrame = this.isEndOfRegularFrame();
    if(!this.isInFrame10()){
      notFirstThrow = this.isNotFirstThrow();
      strikeRound = this.isStrikeRound();
      return ((notFirstThrow && endOfRegularFrame)||strikeRound);
    }else{
      endOfGameThrow=this.isEndOfGameThrow();
      return((endOfRegularFrame&& !this.isBonus())||endOfGameThrow);
    }
  }


  this.isInFrame10 = function(){
    return (this.currentFramesPlayed >= 9)
  }
  this.isNotFirstThrow = function(){
    return (this.throwsLeft < 21);
  }

  this.isEndOfRegularFrame = function(){
    return (this.throwsLeft % 2 == 0);
  }

  this.isStrikeRound= function(){
    return (this.score == 10);
  }
  this.isEndOfGameThrow = function(){
    return (this.throwsLeft == 1);
  }

  //BONUS HANDLER CLASS INTERACTIONS

  this.updateBonusHandlerState = function(){
    inputs = {score: this.score,
    results: this.results,
    framesPlayed: this.currentFramesPlayed,
    isStrikeRound: this.isStrikeRound(),
    totalScore: this.totalScore
    }
    this.bonusHandler.updatePlayState(inputs)
  }

  this.applyBonusPointsIfRequired = function(){
    this.updateBonusHandlerState();
    this.results = this.bonusHandler.updateBonusPointsIfRequired()
    this.totalScore = this.bonusHandler.totalScore;
  }


  this.activateBonus=function(){
    if(this.isStrikeRound()){
      this.bonusHandler.activateStrikeBonus();
    }else{
      this.bonusHandler.activateSpareBonus();
    }
  }
}
