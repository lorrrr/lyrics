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
var fft;
var spectrum;
const unit=4.5;

function preload() {

  // loadStrings returns an array of strings.
  lrcStrings = loadStrings('tomsdiner.lrc')
  song = loadSound('tomsdiner.mp3');
}

function setup() {
  createCanvas(windowHeight*2/3,windowHeight);
  //createCanvas(windowWidth,windowHeight);
  background(250);
 translate(width-100,height/3);
//translate(0,height/2);

  audioEl = createAudio('tomsdiner.mp3');
  audioEl.showControls();


  amp= new p5.Amplitude();
  fft = new p5.FFT(0,256);



  // turn the array of strings into one big string, separated by line breaks.
  lrcStrings = lrcStrings.join('\n');

  // lrc.js library converts Strings to JSON
  var lrcJSON = new Lrc(lrcStrings);
  song.addCue(5.00,changeBackground);
  // iterate through each line of the LRC file to get a Time and Lyric
  for (var i = 0; i < lrcJSON.lines.length; i++) {
    var time = lrcJSON.lines[i].time;
    var lyric = lrcJSON.lines[i].txt.valueOf();

    // schedule events to trigger at specific times during audioEl playback
    song.addCue(time+4, showLyric, lyric);
    audioEl.addCue(time+4, showLyric, lyric);
  console.log("cued");
  }


}
function changeBackground(){
  background(random(255));
  console.log("changed");
}

// callback specified by addCue(time, callback, value).
function showLyric(val) {
   textSize(5);

   var fonts = ["cursive", "serif","monospace",   "Helvetica" ]

   textFont(fonts[Math.floor(Math.random()*fonts.length)]);
  var lyric = val;
  var vol=amp.getLevel();
    spectrum = fft.analyze();
  var angle=radians(map(max(spectrum),150,256,0,360));
  //var angle=radians(map(((min(spectrum)+max(spectrum))/2),70,130,0,360));
  fill(0);
 font=floor(map(((min(spectrum)+max(spectrum))/2),75,150,0,4));

  textFont(fonts[font]);
   for (var i =0; i<lyric.length; i++){
     x+=sin(angle)*unit;
     y+=cos(angle)*unit;
     text(lyric[i].toUpperCase(),x,y);

   }

   if(y>height){
     windowResize(width,height+100);
   }
  console.log(val);
  console.log(vol);

  console.log(angle);
}

function mouseClicked() {

     getAudioContext().resume();

     fft.setInput(audioEl);
     amp.setInput(audioEl);

     audioEl.play();



}
