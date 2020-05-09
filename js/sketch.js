// initalize some variables
var xarr = [],
  yarr = [];
var boundRange, xSel, ySel;
var slidermax = 1000;
var xmargin = 50;
var slidermin = xmargin;
var ymargin = 50;
var xfocus = 0;
var yfocus = 0;
var sliderglobal = 1000/2;
var sliderglobalTOC;
var tocXCol=1;
var tocNameCol=2;
var minTocX=1;
var maxTocX=108.99;
var globalSubj = {};
globalSubj.x = 50;
globalSubj.text='Select';

let img;

function preload() {
  // img = loadImage('./assets/graph_paper.jpg');
  // alldata = loadTable('/data/NACA_vizData_all.csv', 'csv', 'header')
  unttable = loadTable('/data/NACA_viz_full.csv', 'csv', 'header')
  toctable = loadTable('/data/NACA_vizTOCxnormId.csv', 'csv', 'header')

  
  fontGudeaRegular = loadFont('fonts/Gudea-Regular.ttf');
  // fontItalic = loadFont('assets/Italic.ttf');
  // fontBold = loadFont('assets/Bold.ttf');


}



function setup() {

  var canvas = createCanvas(1000, 1200)
  canvas.parent('sketch-holder');
  // var vizdata = alldat
  print(unttable)
  print(toctable)



  // generate random points; add data later
  for (let i = 0; i < 13800; i++) {
    let xx = random(1);
    x = map(xx, 0, 1, xmargin, width - xmargin)
    xarr.push(x);
    let yy = random(1);
    y = map(yy, 0, 1, ymargin, height - ymargin);
    yarr.push(y);
  }



  // ------------------initialize the slider/text category limits------------------
  // var minTocX = 100;
  // var maxTocX = 0;
  // var tocNameCol = toctable.columns.indexOf('tocName');
  var tocXCol = toctable.columns.indexOf('Xnorm');
  // var tocLCol = toctable.columns.indexOf('Lcustom');
  for (let r=0; r<toctable.getRowCount(); r++){
    var thistocval = toctable.getNum(r,tocXCol);

    if (thistocval < minTocX){
      minTocX=thistocval;
    } 
    else if (thistocval > maxTocX){
      maxTocX=thistocval;
    }

  }
  // print(minTocX)
  // print(maxTocX)
  
  






  boundRange = 20;

}






function draw() {

  noSmooth();
  clear();

  var clr_lvl1 = color(71, 149, 184);
  var clr_lvl2 = color(25, 108, 158);
  var clr_lvl3 = color(134, 191, 204);
  var clr_lvl4 = color(221, 230, 232);
  var clr_lvl5 = color(208, 241, 244);
  var clr_bg = color(2, 73, 124);
  // background(clr_bg)



  // ------------------ frame the canvas outer border------------------
  fill('#ffffff00'); stroke(255,255,255,150); strokeWeight(1)
  rectMode(CORNER);rect(0,0,1000,1200)



  // create a custom slider for Table of Contents (X-axis) filter
  x_slider = sliderglobal;
  var sliderheight = 20;
  var slidercircleD = 16;
  var slidery=ymargin/2;

  // ------------------ slider horizontal bar ------------------
  stroke(255,255,255,150);fill(255,255,255,200); strokeWeight(1)
  rectMode(CENTER);rect(width/2,slidery,width-2*xmargin+slidercircleD,6,3)
  rectMode(CORNER);
  stroke(clr_lvl5,150);fill(255,255,255,150); strokeWeight(1)
  circle(x_slider,slidery,slidercircleD)
  text(str(sliderglobal),x_slider,slidery)
  sliderglobalTOCX = map(sliderglobal,slidermin,slidermax,minTocX,maxTocX);


   // ------------------ Add (X-axis) tics and text ------------------
  stroke(clr_lvl4, 150);   strokeWeight(1)
  



  // add the legend label
  for (var r=0; r<toctable.getRowCount(); r++){
    thistocX = toctable.getNum(r,tocXCol)
    // print(thistocX)
    if (( thistocX > (sliderglobalTOCX-0.5)) && (thistocX < (sliderglobalTOCX+0.5))){
   
   globalSubj.x = map(toctable.getNum(r,tocXCol),minTocX,maxTocX,30,width-xmargin*2-6)
   globalSubj.text = toctable.get(r,tocNameCol);
  }
  }

 
  push();
  fill(255).strokeWeight(0).textSize(12);
  textAlign(CENTER); textFont(fontGudeaRegular);
  translate(globalSubj.x,ymargin+30)
  // rotate(radians(270)); 
  rectMode(CENTER)
  text(globalSubj.text, xmargin*1.5,ymargin,xmargin,ymargin );
  pop();

  

  // ------------------ Draw the nodes ------------------
  for (let i = 0; i < 13800; i++) {

    if ((mouseX < (xarr[i] + boundRange / 2)) && (mouseX > (xarr[i] - boundRange / 2)) ||
      (mouseY < (yarr[i] + boundRange / 2)) && (mouseY > (yarr[i] - boundRange / 2))) {
      stroke(clr_lvl4);
    } // Change the color}
    else if ((x_slider < (xarr[i] + boundRange / 2)) && (x_slider > (xarr[i] - boundRange / 2))) {
      stroke(clr_lvl4);
    }
    else {
      stroke(clr_lvl1);
    }

    strokeWeight(2);
    point(xarr[i], yarr[i]);
  }




  noFill();
  stroke(clr_lvl4, 150);
  strokeWeight(2)
  rect(xmargin, ymargin, width - 2 * xmargin, height - 2 * ymargin, 2)
  stroke(255);
  strokeWeight(1)
  rect(xmargin, ymargin, width - 2 * xmargin, height - 2 * ymargin, 2)


  // Mouse action
  strokeWeight(1);
  stroke(clr_lvl5);
  line(mouseX, 0, mouseX, height);
  line(0, mouseY, width, mouseY);
  stroke(255);
  fill(255);
  strokeWeight(0.5)
  textFont('Helvetica');
  textSize('12')
  text('Title number ' + str(mouseX * mouseY), mouseX + 20, mouseY - 20)

  // click event tool
  stroke(255);
  noFill();
  strokeWeight(1.5);
  ellipse(xfocus, yfocus, 20, 20);
  strokeWeight(3)
  point(xfocus,yfocus)



}


function mouseClicked() {
  // xfocus = mouseX;
  // yfocus = mouseY;
  var minvalX, minvalY;
  var minDist = 10000;

  for (let i = 0; i < xarr.length; i++) {
    let d = dist(xarr[i], yarr[i], mouseX, mouseY);
    if (d < minDist) {
      minDist = d;
      xfocus = xarr[i];
      yfocus = yarr[i];
    }

  }
  // prevent default
  return false;
}



function mouseDragged() {
  
  if (mouseX > width-xmargin) {
    sliderglobal = width-xmargin;
  }
  else if (mouseX < xmargin) {
    sliderglobal = xmargin;
  }
  else {
    sliderglobal=mouseX;
  }

// return false;
}