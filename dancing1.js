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
const unit=10;

function preload() {
  font=loadFont("Minipax-Medium.otf");
  // loadStrings returns an array of strings.
  lrcStrings = loadStrings('tomsdiner_short.lrc')
  song = loadSound('tomsdiner.mp3');
}

function setup() {
  createCanvas(windowHeight*2/3,windowHeight);
  //createCanvas(windowWidth,windowHeight);
  background(250);
  fill(0);
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

  // iterate through each line of the LRC file to get a Time and Lyric
  for (var i = 0; i < lrcJSON.lines.length; i++) {
    var time = lrcJSON.lines[i].time;


    // schedule events to trigger at specific times during audioEl playback
    song.addCue(time+4, showLyric, i);
    audioEl.addCue(time+4, showLyric, i);
  console.log("cued");
  }


}

// callback specified by addCue(time, callback, value).
function showLyric(val) {

  var lyric = lrcJSON.lines[val].txt.valueOf();
  console.log(lyric);
  if (val==0){
  var prev="i am sittimg"} else{
  var prev=lrcJSON.lines[val-1].txt.valueOf();
}

  var vol=amp.getLevel();
    spectrum = fft.analyze();
  //var size=map(max(spectrum),150,256,4,13);
  var size=43;
  var offset=int(map(max(spectrum),150,256,0,7));

  //var angle=radians(map(((min(spectrum)+max(spectrum))/2),70,130,0,360));
  fill(0);
  noStroke();
  x=(counter%2)*(textWidth(prev)+unit-10)+10;

  oy=floor(counter/2)*58+70;

  var noi=int(map(vol,0,0.2,1,15));
 console.log(textWidth(lyric));
  for (var i=0;i<noi;i++){
    var nx=random(x-10,x+textWidth(lyric)+10);
    var ny=random(oy-55,oy+25);

    if (random(2)>1){
     y=y-(offset+1)*1.3;
       fill(65,144,251);
    }else {fill(0);}


    //rect(nx,ny,4.5,3.5);
    ellipse(nx,ny,6,6);
    fill(0);

  }
   for (var i =0; i<lyric.length; i++){
     if (i==0){x+=0}else
     if (lyric[i-1]==" "){
       x+=unit;
     } else {
     x+=textWidth(lyric[i-1]);}
     y=oy;
     if (i%2==0){
      y=y-(offset+1)*1.3;
        fill(65,144,251);
     }else {fill(0);}
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
