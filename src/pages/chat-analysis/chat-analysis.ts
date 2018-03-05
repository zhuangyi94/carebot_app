import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { RequestsProvider } from '../../providers/requests/requests';
import * as moment from 'moment';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
/**
 * Generated class for the ChatAnalysisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-analysis',
  templateUrl: 'chat-analysis.html',
})


export class ChatAnalysisPage {


	public barChartLabels:string[] = ['Polarity'];
	public barChartType:string = 'horizontalBar';
	public barChartLegend:boolean = true;
  public elderly = "";
  public photoUrl = "";
  public openBar = false;
  public elderlyUid = [];
  public positiveness = 0;
  public elderlyName = "";
  //isDataAvailable:boolean = false;

	public barChartData:any[] = [
	  {data: Array<any>(), label: 'Conversation positiveness'},
	  // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
	];
		public barChartOptions:any = {
	     responsive:true,
	           scales: {
        xAxes: [{id: 'x-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max:10}}]
      }
    // scaleBeginAtZero:false,
    // barBeginAtOrigin:true
	  // scaleShowVerticalLines: false,
	  // responsive: true
	};

  barChartColors: any [] =[
    {
        backgroundColor:'rgba(255, 99, 132, 1)',
        // borderColor: "rgba(10,150,132,1)",
        borderWidth: 5
    }
    // {
    //     backgroundColor:'rgb(97 174 55, 1 )',
    //     borderColor: "rgba(10,150,132,1)",
    //     borderWidth: 5,
    // }
  ]



	//Doughnut

  public positiveContent = 0;
  public neutralContent = 0;
  public negativeContent = 0;
	public doughnutChartLabels: string[] = ['Postive Content', 'Neutral Content', 'Negative Content'];
	public doughnutChartData: number[] = [];
	public doughnutChartType: string = 'doughnut';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public userservice: UserProvider,
    public alertCtrl: AlertController,
    public request: RequestsProvider,
    public spinner: SpinnerDialog) {


  }

  loaduserdetails() {
    this.userservice.getuserdetails().then((res: any) => {
      this.elderly = res.elderlyEmail;
      console.log("here",this.elderly, res)
    }).then((res: any) => {
      this.userservice.getelderlydetails(this.elderly).then((res:any) =>{
        console.log("user elderly profile", res)

        this.elderlyName = res[0].displayName;
        this.elderlyUid = res[0].uid;
        this.photoUrl = res[0].photoURL;      
      }).then((res: any) => {
        this.request.getElderlyPolarity(this.elderlyUid).then((res:any) => {
          console.log("res",res)
          this.positiveness = res.polarity;
          this.positiveContent = res.positive;
          this.neutralContent = res.neutral;
          this.negativeContent = res.negative;

          if(this.positiveness>5){
            this.barChartColors.pop();
            this.barChartColors.push({backgroundColor:'rgba(97, 174, 55, 1)', borderWidth: 5});
          }

          this.barChartData.pop();
          this.barChartData.push({data: [this.positiveness], label: 'Conversation positiveness'});
          this.doughnutChartData.push(this.positiveContent);
          this.doughnutChartData.push(this.neutralContent);
          this.doughnutChartData.push(this.negativeContent);
          this.openBar = true;
          this.spinner.hide();
          //this.baseChart.update();
        })
      });

    })
  }

  ngOnInit(){
    this.spinner.show();
    this.loaduserdetails()  
  }

  openCalendar(){
    this.navCtrl.push('CalendarviewPage', {elderlyUid: this.elderlyUid});    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatAnalysisPage');

  }

  public chartClicked(e:any):void {
  	console.log(e);
  }

  public chartHovered(e:any):void {
  	console.log(e);
  }

  public setBar() {
    this.openBar = true;
  }

  public setPie() {
    this.openBar = false;
  }

  public showDialog() {
    console.log("xxxx",this.elderlyUid)

    this.request.getElderlyMessage(this.elderlyUid).then((res:any) => {
      console.log("res",res)
      this.organizeDialog(res);

    })
  }

  public organizeDialog(res){

    let content = "";
    let temp = [];

      temp = res;
      temp.forEach(r=>{
        let date = new Date(r.timestamp);
        let dates = moment(date).format('lll'); ;
        content+="<li>" + dates + "<br>" + r.message +'</li>';
      })    
    console.log("content", content)


    let alert = this.alertCtrl.create({
      title:"Dialog",
      subTitle:content,
      buttons:['Close']
    })
      alert.present();
  }



// public randomize():void {
//   // Only Change 3 values
//   let data = [
//     Math.round(Math.random() * 100),
//     59,
//     80,
//     (Math.random() * 100),
//     56,
//     (Math.random() * 100),
//     40];
//   let clone = JSON.parse(JSON.stringify(this.barChartData));
//   clone[0].data = data;
//   this.barChartData = clone;
// }

}
