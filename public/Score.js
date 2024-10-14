import { sendEvent } from './Socket.js';
import scoredetails from './assets/stage.json' with { type: "json" }
import itemdetails from './assets/item.json' with { type: "json" }

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stage = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.01 * scoredetails.data[this.stage].scorePerSecond;
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) >= scoredetails.data[this.stage].score) {
      sendEvent(11, { currentStage: scoredetails.data[this.stage].id, targetStage: scoredetails.data[this.stage].id + 1 });
      this.stage++;
      console.log(this.stage);
    }
  }

  getItem(itemScore) {
    let realScore = 0;
    if (itemScore > itemdetails.data[this.stage].score) {
      realScore = itemdetails.data[this.stage].score;
    } else {
      realScore= itemScore;
    }
    console.log('현재 스테이지 아이템 점수' + itemdetails.data[this.stage].score);
    console.log('실제' + realScore);
    this.score += realScore;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
