// initalize some variables
var xarr = [], yarr = [], xnormarr = [];
var xarrFilt = [], yarrFilt = [];
var IDarr =[];
var boundRange = 2;
var xSel, ySel;
var xmargin = 50;
var ymargin = 100;
var wwidth = 1200;
var hheight = 1600;

// subject heading slider
var slidermax = 1000;
var slidermin = xmargin;
var sliderglobal = 1000/2*0.98;
var sliderglobalTOC;
var sliderheight = ymargin;
var slidery=ymargin/2;
var sliderymin=slidery-sliderheight/2;
var sliderymax=slidery+sliderheight/2;
var draggingSlider = false;
var highlightSlider = false;
var slidertextwidth = 25;
var slidertextboxW = 30;
var slidertextboxY = ymargin;

// dropdown menus
let sel;
let bgCol;

// focus values
var xfocus = xmargin;
var yfocus = ymargin;
var firstfocus =false;
var tocXCol=1;
var tocNameCol=2;
var minTocX=1;
var maxTocX=108.99;
var minDatX=2000;
var maxDatX=0;
var minDatY=2000;
var maxDatY=0;
var globalSubj = {};
globalSubj.x = 50;
globalSubj.text='Select';


var sliderMouseOver = false;

let img;



// ------------------- Load images and fonts -------------------
function preload() {
  // img = loadImage('./assets/graph_paper.jpg');
  // alldata = loadTable('./data/NACA_vizData_all.csv', 'csv', 'header')
  datatable = loadTable('./data/NACA_viz_full.csv', 'csv', 'header')
  toctable = loadTable('./data/NACA_vizTOCxnormId.csv', 'csv', 'header')
  fontGudeaRegular = loadFont('./fonts/Gudea-Regular.ttf');
  // fontItalic = loadFont('assets/Italic.ttf');
  // fontBold = loadFont('assets/Bold.ttf');
}



// ------------------------------------------------------------------------------
// ------------------------------- Setup function -------------------------------
// ------------------------------------------------------------------------------
function setup() {


  var canvas = createCanvas(wwidth, hheight)
  canvas.parent('sketch-holder');
  // canvas.style('width','100%');
  // var vizdata = alldat
  print(datatable)
  print(toctable)



  // generate random points; add data later
  // for (let i = 0; i < 13800; i++) {
  //   let xx = random(1);
  //   x = map(xx, 0, 1, xmargin, width - xmargin)
  //   xarr.push(x);
  //   let yy = random(1);
  //   y = map(yy, 0, 1, ymargin, height - ymargin);
  //   yarr.push(y);
  // }

// ------------------initialize the main data table variables------------------
var NdatRows = datatable.getRowCount();
var metaIDcol = datatable.columns.indexOf('id_hd');
var metaXcol = datatable.columns.indexOf('x');
var metaYcol = datatable.columns.indexOf('y');
var metaXnormCol = datatable.columns.indexOf('Xnorm');
var authorCol = datatable.columns.indexOf('creator');
var titleCol = datatable.columns.indexOf('title');
var repTypeCol = datatable.columns.indexOf('repType');
var repFilt = 'TR';
var thistest = repFilt;


// loop through all nodes to get extreme values and populate plot arrays
  for (let r=0; r<NdatRows; r++){

    var thistype = datatable.getString(r,repTypeCol);
    
    if (thistest == repFilt){
      let thisx = datatable.getNum(r,metaXcol);
      let thisy = datatable.getNum(r,metaYcol);
      let thisxnorm = datatable.getNum(r,metaXnormCol);
      xarr.push(thisx);
      yarr.push(thisy);
      xnormarr.push(thisxnorm);

      // get min/max values for plotting
      // dont need xnorm, because getting it from the TOC section...living on the edge
      if (thisx < minDatX){
        minDatX=thisx;
      } 
      else if (thisx > maxDatX){
        maxDatX=thisx;
      }
      if (thisy < minDatY){
        minDatY=thisy;
      } 
      else if (thisy > maxDatY){
        maxDatY=thisy;
      }
    } 
  }

// print('Min X:'+str(minDatX));
// print('Max X:'+str(maxDatX));
// print('Max Y:'+str(minDatY));
// print('Max Y:'+str(maxDatY));












// ------------------initialize the slider/text category limits------------------
  slider = createSlider(slidermin,slidermax,sliderglobal);
  // slider.position(width/2,ymargin/2);
  slider.class('slider');
  slider.style('width', str(wwidth-xmargin*2)+'px');
  slider.parent('#slidercontainer')
  
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
  









  
// ------------------initialize the dropdown menus------------------
  // sel = createSelect();
  // sel.parent('#dropdowncontainer')
  // sel.option('Red');
  // sel.option('Blue');
  // sel.option('Green');
  // sel.changed(changeBg);
  // bgCol = color(0,0,0);




  

}





// ------------------------------------------------------------------------------
// ------------------------------- Draw function -------------------------------
// ------------------------------------------------------------------------------
function draw() {

  xarrFilt=[];
  yarrFilt=[];

  noSmooth();
  clear();

  var clr_lvl1 = color(71, 149, 184);
  var clr_lvl2 = color(25, 108, 158);
  var clr_lvl3 = color(134, 191, 204);
  var clr_lvl4 = color(221, 230, 232);
  var clr_lvl4b = color(221, 230, 232,130);
  var clr_lvl5 = color(208, 241, 244);
  var clr_bg = color(2, 73, 124);


  // ------------------ frame the canvas outer border------------------
  // fill('#ffffff00'); stroke(255,255,255,150); strokeWeight(1)
  // // rectMode(CORNER);rect(0,0,wwidth,hheight)
  // fill(bgCol);
  // rectMode(CORNER);rect(0,0,10,10)



  // ------------------ slider horizontal bar ------------------
  // ------------------ html slider ------------------
  // create a custom slider for Table of Contents (X-axis) filter
  // here the slider diameter of 25px is hard-coded...
  let sliderglobal = slider.value();
  // for line
  x_slider = map(sliderglobal,slidermin,slidermax,xmargin+25/2,width-xmargin-25/2);
  // for filter
  x_sliderPixelFrame = map(sliderglobal,slidermin,slidermax,xmargin,width-xmargin);
  // for text
  sliderglobalTOCX = map(sliderglobal,slidermin,slidermax,minTocX,maxTocX);

  // stroke(255,255,255,0);fill(255,255,255,255); noStroke;
  // if (mouseY < ymargin){
  //   highlightSlider=true;
  //   fill(255,255,255,120);
  // }
  // else {
  //   highlightSlider=false;
  //   fill(255,255,255,50);
  // }
  // rectMode(CENTER);rect(width/2,slidery,width-2*xmargin,sliderheight,3)
  // rectMode(CENTER);rect(x_slider,slidery,sliderheight/2,sliderheight,3)
  stroke(clr_lvl5,150);fill(255,255,255,150); strokeWeight(1)
  line(x_slider,ymargin,x_slider,height-ymargin)
  rectMode(CORNER);
  // text(str(x_slider),x_slider,slidery)


  








   // ------------------ Add (X-axis) tics/text ------------------
  stroke(clr_lvl4, 150);   strokeWeight(1)
  for (var r=0; r<toctable.getRowCount(); r++){
    thistocX = toctable.getNum(r,tocXCol)
    if (( thistocX > (sliderglobalTOCX-0.5)) && (thistocX < (sliderglobalTOCX+0.5))){
      globalSubj.x = map(toctable.getNum(r,tocXCol),minTocX,maxTocX,xmargin+slidertextwidth,width-xmargin-slidertextwidth)
      globalSubj.text = toctable.get(r,tocNameCol);
    }
  }
  push();
  fill(255).strokeWeight(0).textSize(20);
  textAlign(CENTER,CENTER); textFont(fontGudeaRegular);
  translate(globalSubj.x,ymargin/2)
  // rotate(radians(270)); 
  rectMode(CENTER)
  text(globalSubj.text, 0,0,slidertextboxW*5,slidertextboxY );
  pop();
  // rect(globalSubj.x-slidertextboxW*2.5, 0,slidertextboxW*5,slidertextboxY );
  
  


  // ------------------ Graph Border ------------------
  noFill();
  stroke(clr_lvl4, 150);
  strokeWeight(2)
  rect(xmargin, ymargin, width - 2 * xmargin, height - 2 * ymargin, 2)
  stroke(255);
  strokeWeight(1)
  rect(xmargin, ymargin, width - 2 * xmargin, height - 2 * ymargin, 2)




  // ------------------ Draw the nodes ------------------
  for (let i = 0; i < xarr.length; i++) {

    // mapMouseX = map(mouseX,0,width,xmargin,width-xmargin);
    // mapMouseY = map(mouseY,0,height,ymargin,height-ymargin);
    let thisx = map(xarr[i],minDatX,maxDatX,xmargin,width-xmargin);
    let thisy = map(yarr[i],minDatY,maxDatY,ymargin,height-ymargin);
    // let thisnxnorm = map(xnormarr[i],minTocX,maxTocX,xmargin,width-xmargin);

    // x_sliderPixelFrame
    // sliderglobalTOCX

    // check against normalized coordinate categories (Xnorm before force layout)
    if ((sliderglobalTOCX < (xnormarr[i] + boundRange / 2)) && (sliderglobalTOCX > (xnormarr[i] - boundRange / 2))){
      strokeWeight(4);
      stroke(clr_lvl4);  // Change the color
      xarrFilt.push(thisx);
      yarrFilt.push(thisy);
    }
    else {
      strokeWeight(3);
      stroke(clr_lvl1);
    }

    // if ((mouseX < (xarr[i] + boundRange / 2)) && (mouseX > (xarr[i] - boundRange / 2)) ||
    //   (mouseY < (yarr[i] + boundRange / 2)) && (mouseY > (yarr[i] - boundRange / 2))) {
    //   stroke(clr_lvl4);
    // } // Change the color}
    // else if ((x_slider < (xarr[i] + boundRange / 2)) && (x_slider > (xarr[i] - boundRange / 2))) {
    //   stroke(clr_lvl4);
    // }
    // else {
    //   stroke(clr_lvl1);
    // }

    
    point(thisx,thisy);
  }



  


  // ------------------ Mouse action ------------------
  strokeWeight(1);
  stroke(clr_lvl1);
  // line(mouseX, ymargin, mouseX, height-ymargin);
  if ((mouseY > ymargin) && (mouseY < height-ymargin-30) ){
    line(xmargin, mouseY+30, width-xmargin, mouseY+30);
    // line(xmargin, mouseY-30, width-xmargin, mouseY-30);
    stroke(255);
    fill(255);
    strokeWeight(0.5)
    textFont(fontGudeaRegular);
    textSize('12')
    // text('Title number ' + str(mouseX * mouseY), mouseX + 20, mouseY + 20)

    // hardcoded year...change later xxxxxxx
    stroke(clr_lvl4); fill(clr_lvl4);
    year = round(map(mouseY,ymargin,height-ymargin,1960,1915));
    textSize(16); textFont(fontGudeaRegular);
    textAlign(LEFT); text(str(year), xmargin+10, mouseY );
    // textAlign(RIGHT);text(str(year), width-xmargin-10, mouseY +20);

    // add arrows for slider...maybe need better solution....
    stroke(clr_lvl4); fill(clr_lvl1);
    if ((mouseX < x_slider + 20) && (mouseX > x_slider - 20)){
      stroke(clr_lvl4); fill(clr_lvl4);
    }
    textAlign(LEFT,CENTER); text("→", x_slider+30, mouseY );
    textAlign(RIGHT,CENTER);text("←", x_slider-30, mouseY );
  }




  // ------------------ click event tooltip------------------ 
  stroke(255);
  noFill();
  strokeWeight(1.5);
  ellipse(xfocus, yfocus, 20, 20);
  strokeWeight(3)
  point(xfocus,yfocus)
}



// add a tooltip selection.
//  Check the minimum distance to a point and use that point as highlighted one.
function mouseClicked() {
  // xfocus = mouseX;
  // yfocus = mouseY;
  var minvalX, minvalY;
  var minDist = 10000;
  

  // firstfocus = true;

  // xfocus = mouseX;
  // yfocus = mouseY;

if ((mouseY > ymargin) && (mouseY < height-ymargin)  ){
  for (let i = 0; i < xarrFilt.length; i++) {

    thisx = map(xarrFilt[i],minDatX,maxDatX,xmargin,width-xmargin)
    thisy = map(yarrFilt[i],minDatY,maxDatY,ymargin,height-ymargin)
    let d = dist(xarrFilt[i], yarrFilt[i], mouseX, mouseY);
    if (d < minDist) {
      minDist = d;
      xfocus = xarrFilt[i];
      yfocus = yarrFilt[i];


  }}}

  // prevent default
  return false;
}


// function mousePressed(){
//   return true;
// }

function mouseDragged() {

  // var dragupper = map(mouseX,xmargin,width-xmargin,slidermin,slidermax)
  // var draglower = map(mouseX,xmargin,width-xmargin,slidermin,slidermax)


if ( (mouseY > ymargin) && (mouseX < x_slider + 30) && (mouseX > x_slider - 30) ){

  draggingSlider=true;
  slider.value(map(mouseX,xmargin,width-xmargin,slidermin,slidermax))

  if (mouseX > width-xmargin) {
    sliderglobal = width-xmargin;
  }
  else if (mouseX < xmargin) {
    sliderglobal = xmargin;
  }
  else {
    sliderglobal=mouseX;
  }

}

// return false;
}




function changeBg(){
  let val = sel.value();
 if(val == 'Red'){
   bgCol = color(255,0,0);
 } else if(val == 'Blue'){
    bgCol = color(0,0,255);
 } else if(val == 'Green'){
    bgCol = color(0,255,0); 
 }
}


function drawTooltip(){

  ellipse(0,0,10,10)
}