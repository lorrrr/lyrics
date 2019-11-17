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
var counter=0;
var spectrum;
const unit=15;

function preload() {

  // loadStrings returns an array of strings.
  lrcStrings = loadStrings('tomsdiner1.lrc')
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
var fonts = ["cursive", "serif","monospace",   "Helvetica" ]

textFont(fonts[Math.floor(Math.random()*fonts.length)]);
  var lyric = val;
  var vol=amp.getLevel();
    spectrum = fft.analyze();
  //var size=map(max(spectrum),150,256,4,13);
  var size=12;
  var offset=int(map(vol,0,0.2,0,10));
  console.log(vol);
  //var angle=radians(map(((min(spectrum)+max(spectrum))/2),70,130,0,360));
  var font=floor(map(((min(spectrum)+max(spectrum))/2),75,150,0,4));

  textFont(fonts[font]);

  fill(0);
  //x=(counter%3)*200+offset*4;
  //x=50+offset*10;
  x=width/2-180+offset*18;
  //y=floor(counter/3)*20+100;
  y=counter*11+40;
  // if (counter>=38){
  //  x=width/2+offset*15;
  //  y=(counter-38)*17+40;
  // }
  textSize(size);
  text(lyric,x,y);


counter++;
}

function mouseClicked() {

     getAudioContext().resume();

     fft.setInput(audioEl);
     amp.setInput(audioEl);

     audioEl.play();



}
