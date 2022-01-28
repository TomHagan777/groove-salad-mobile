p5.disableFriendlyErrors = true; 

var capture;
var mic;
let switchFlag = false;
let switchBtn;
var videoconstraints = {
     video: {
         facingMode: {
          exact: "user"
        }
     }
   };

function setup() {
  cnv = createCanvas(windowWidth,windowHeight);

  pixelDensity(1);

  capture = createCapture(videoconstraints);
  capture.hide();
  rectMode(CENTER);
    
  mic = new p5.AudioIn();
  mic.start();
  
  fft = new p5.FFT();
  fft.setInput(mic);
  
  slider1 = createSlider(0,5,0);
  slider2 = createSlider(0,225,225);
  slider3 = createSlider(0,225,130);
  slider4 = createSlider(400,1000,400);
    slider1.position(20,height-110);
    slider2.position(20,height-180);
    slider3.position(20,height-205);
    slider4.position(20,height-40);
        slider1.style('display:none');
        slider2.style('display:none');
        slider3.style('display:none');
        slider4.style('display:none');
      
  title1 = createP ('Colour Shift');
  title2 = createP ('EQ Spread');
  title3 = createP ('Mic Sensitivity');
  title4 = createP ('Touch Here to Launch');
    title1.position(23,height-249);
    title2.position(23,height-154);
    title3.position(23,height-84);
    title4.position([width/2]-80,[height/2]-20);
        title1.style('display:none');
        title2.style('display:none');
        title3.style('display:none');
    
  cnv.mousePressed(titleInvisible);
  title4.mousePressed(titleInvisible);

  button4 = createImg('Images/MenuOpen02.png');
    button4.mousePressed(fullscreen_menu);
        button4.position(10,height-35);
        button4.style('display:block');
  
  button5 = createImg('Images/MenuClose.png');
    button5.mousePressed(fullscreen_menu_off);
        button5.position(width-35,height-35);
        button5.style('display:none');
    
  button6 = createImg('Images/CameraSwitch.png');
    button6.mousePressed(switchCamera);
        button6.position(width-40, 10);   
}

function windowResized() {
	if(windowWidth<windowHeight){
		resizeCanvas(windowWidth,windowHeight);
        
        slider1.position(20,height-110);
        slider2.position(20,height-180);
        slider3.position(20,height-205);
        slider4.position(20,height-40);
        
        title1.position(23,height-249);
        title2.position(23,height-154);
        title3.position(23,height-84);
        title4.position([width/2]-80,[height/2]-20);
        
        button4.position(10,height-35);
        button5.position(width-35,height-35);
        button6.position(width-40, 10);
    
	} else {
		resizeCanvas(displayHeight,displayWidth);
        
        slider1.position(20,displayWidth-110);
        slider2.position(20,displayWidth-180);
        slider3.position(20,displayWidth-205);
        slider4.position(20,displayWidth-40);
           
        title1.position(23,displayWidth-249);
        title2.position(23,displayWidth-154);
        title3.position(23,displayWidth-84);
        title4.position([width/2]-80,[height/2]-20);
        
        button4.position(10,displayWidth-35);
        button5.position(displayHeight-35,displayWidth-35);
        button6.position(displayHeight-40,10);   
	}
}

function draw() {

//BACKGROUND//

  let eq=fft.analyze();
  
  Lows=(int)(fft.getEnergy("bass"));
  LowMids=(int)(fft.getEnergy("lowMid"));
  Mids=(int)(fft.getEnergy("mid"));
  HighMids=(int)(fft.getEnergy("highMid"));
  Highs=(int)(fft.getEnergy("treble"));
  
  background([Lows+LowMids]/2,HighMids+Highs,Mids+slider3.value());

//VIDEO AND EQ PIXEL LOAD//
  capture.loadPixels();
  spectrum=fft.analyze();
  noStroke();
  fill([HighMids+Highs]*1.5,slider2.value()+Mids,[Lows+LowMids]/2,150);

  for (var cy=0;cy<capture.height;cy+=25){
    for (var cx=0;cx<capture.width;cx+=1+slider1.value()){
      var offset=((cy*capture.width)+cx)*4;
      var xpos=(cx/capture.width)*width;
      var ypos=(cy/capture.height)*[height+30];
        
      rect(xpos,ypos,1,spectrum[cy]*(capture.pixels[offset+1]/slider4.value())); 
    }      
  } 
}

function fullscreen_menu() {
    title1.style('display:block');
    title2.style('display:block');
    title3.style('display:block');
        slider1.style('display:block');
        slider2.style('display:block');
        slider3.style('display:block');
        slider4.style('display:block');
    button4.style('display:none');
    button5.style ('display:block');
}

function fullscreen_menu_off(){
    title1.style('display:none');
    title2.style('display:none');
    title3.style('display:none');
        slider1.style('display:none');
        slider2.style('display:none');
        slider3.style('display:none');
        slider4.style('display:none');
    button4.style('display:block');
    button5.style('display:none');
}

function titleInvisible() {
  title4.style('display:none');
}

function touchStarted() {
  getAudioContext().resume()
  var fs = fullscreen();
     if (!fs) {
       fullscreen(true);
     }
}

function switchCamera() {
  switchFlag = !switchFlag;
  stopCapture();
  if(switchFlag==true)
  {
   capture.remove();
   videoconstraints = {
     video: {
         facingMode: {
          exact: "environment"
        }
     }
   };

  }
  else
  {
   capture.remove();
   videoconstraints = {
     video: {
         facingMode: {
          exact: "user"
        }
     }
   };
  }
  capture = createCapture(videoconstraints);
  capture.hide();
}

function stopCapture() {
  let stream = capture.elt.srcObject;
  let tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  capture.elt.srcObject = null;
}