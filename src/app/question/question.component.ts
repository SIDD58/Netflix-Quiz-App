import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  questionList:any=[];
  currentQuestion:number=0;
  score:number=0;
  time:number=120;
  visited:boolean[]=[];
  progressValue:String="";
  answered:number=0;
  interval$:any;
  correctAnswer:number=0;
  incorrectAnswer:number=0;
  //
  quizCompleted:boolean=false;

  constructor(private questionService:QuestionService) { }

  ngOnInit(): void {
    this.getAllQuestions();
    this.initVisited();
    this.startCounter();
  }
  initVisited()
  {
    for(let i=0;i<this.questionList.length;i++)
    {
      this.visited.push(false);
    }
  }
  getAllQuestions()
  {
    this.questionService.getQuestionJson().subscribe((res)=>{
      this.questionList=res.questions;
    });
  }
  backward()
  {
    this.currentQuestion=this.currentQuestion-1;
  }
  forward()
  {
    this.currentQuestion=this.currentQuestion+1;
  }
  reset()
  {
    this.currentQuestion=0;
    this.score=0;
    //this.initVisited();
    // cannot reuse this because it pushes values
    for(let i=0;i<this.visited.length;i++)
    {
      this.visited[i]=false;
    }
    this.progressValue="0";
    this.answered=0;
    this.correctAnswer=0;
    this.incorrectAnswer=0;
    this.resetCounter();
  }
  //
  optionclicked(answer:boolean)
  {
    
    if(this.currentQuestion<this.questionList.length)
    {
      if(this.visited[this.currentQuestion]===true)
      {
        this.currentQuestion=this.currentQuestion+1;
        return;
      }
      if(answer===true)
    {
      this.score=this.score+10;
      this.correctAnswer++;
    }
    else
    {
      this.score=this.score-10;
      this.incorrectAnswer++;
    }
    this.answered=this.answered+1;
    this.progressValue=((this.answered/this.questionList.length)*100).toString();
    this.visited[this.currentQuestion]=true;
    this.currentQuestion=this.currentQuestion+1;
    if(this.answered===this.questionList.length)
    {
      this.quizCompleted=true; 
      this.stopCounter(); 
    }
    }
  }
  ////
  startCounter()
  {
    this.interval$=interval(1000).subscribe(()=>{
      this.time--;
      if(this.time===0)
      {
        this.interval$.unsubscribe();
        this.quizCompleted=true;
      }
    });

  }
  stopCounter()
  {
    this.interval$.unsubscribe();
    this.time=0;

  }
  resetCounter()
  {
    this.stopCounter();
    this.time=120;
    this.startCounter();

  }

}
