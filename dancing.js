/**
 *  Display lyrics as a song plays.
 *
 *  Uses the p5.dom library to create an HTML5 Audio Element, and schedules
 *  events using audioEl.setCue(callback, time, value)
 *
 *  Lyrics are parsed from an LRC file, which is used for karaoke.
 *  Here is a quick way to generate your own LRC file for any song: http://lrcgenerator.com/
 *
 *  First we loadStrings to read the LRC file, then convert the Strings to JSON using this
 *  LRC to JSON converter:
 *  https://github.com/justan/lrc (MIT License)
 *
 */

var audioEl;
var currentLyric = '';
var lyricDiv;
var lrcStrings;
var amp;
var song;
var button;
var x=0;
var y=0;
var oy;
var fft;
var counter=0;
var font;
var spectrum;
var lrcJSON;
const unit=20;

function preload() {
  font=loadFont("Recursive Mono-Linear Medium.otf");
  // loadStrings returns an array of strings.
  lrcStrings = loadStrings('tomsdiner_short.lrc')
  song = loadSound('tomsdiner.mp3');
}

function setup() {
  createCanvas(windowHeight*2/3,windowHeight);
  //createCanvas(windowWidth,windowHeight);
  background(250);
 //translate(width-130,height/3);
//translate(0,height/2);

  audioEl = createAudio('tomsdiner.mp3');
  audioEl.showControls();


  amp= new p5.Amplitude();
  fft = new p5.FFT(0,32);


  textFont(font);
  // turn the array of strings into one big string, separated by line breaks.
  lrcStrings = lrcStrings.join('\n');

  // lrc.js library converts Strings to JSON
  lrcJSON = new Lrc(lrcStrings);
  song.addCue(5.00,changeBackground);
  // iterate through each line of the LRC file to get a Time and Lyric
  for (var i = 0; i < lrcJSON.lines.length; i++) {
    var time = lrcJSON.lines[i].time;


    // schedule events to trigger at specific times during audioEl playback
    song.addCue(time+4, showLyric, i);
    audioEl.addCue(time+4, showLyric, i);
  console.log("cued");
  }


}
function changeBackground(){
  background(random(255));
  console.log("changed");
}

// callback specified by addCue(time, callback, value).
function showLyric(val) {

  var lyric = lrcJSON.lines[val].txt.valueOf();

  if (val==0){
  var prev=""} else{
  var prev=lrcJSON.lines[val-1].txt.valueOf();
}

  var vol=amp.getLevel();
    spectrum = fft.analyze();
  //var size=map(max(spectrum),150,256,4,13);
  var size=40;
  var offset=int(map(max(spectrum),150,256,0,6));

  //var angle=radians(map(((min(spectrum)+max(spectrum))/2),70,130,0,360));
  fill(0);
  noStroke();
  x=(counter%2)*(prev.length+1)*unit;

  oy=floor(counter/2)*58+50;

  var noi=int(map(vol,0,0.2,1,80));
 console.log(y);
  for (var i=1;i<noi;i++){
    var nx=random(x,x+lyric.length*unit);
    var ny=random(oy-45,oy+15);
    fill(50,50,155);
    rect(nx,ny,4.5,3.5);
    //ellipse(nx,ny,8,8);
    fill(0);

  }
   for (var i =0; i<lyric.length; i++){
     x+=unit;
     y=oy;
     if (i%2==0){
      y=y-(offset+1)*2;
     }
     textSize(size);
    // text(lyric[i].toUpperCase(),x,y);
  text(lyric[i],x,y);




   }

counter++;
}

function mouseClicked() {

     getAudioContext().resume();

     fft.setInput(audioEl);
     amp.setInput(audioEl);

     audioEl.play();



}
