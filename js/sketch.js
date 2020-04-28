// initalize some variables
var xarr = [],
  yarr = [];
var boundRange, xSel, ySel;
var slidermax = 1000;
var xmargin = 50;
var ymargin = 50;
var xfocus = 0;
var yfocus = 0;
var sliderglobal = xmargin;

let img;

// function preload() {
//   img = loadImage('./assets/graph_paper.jpg');
// }


function setup() {

  var canvas = createCanvas(800, 1200)
  canvas.parent('sketch-holder');


  // generate random points; add data later
  for (let i = 0; i < 13800; i++) {
    let xx = random(1);
    x = map(xx, 0, 1, xmargin, width - xmargin)
    xarr.push(x);
    let yy = random(1);
    y = map(yy, 0, 1, ymargin, height - ymargin);
    yarr.push(y);
  }


  boundRange = 20;
  // var slidervals = width - 2 * xmargin;
  // slider = createSlider(0, slidermax, 1000);
  // slider.position(xmargin, ymargin/3 );
  // slider.style('width', str(slidervals) + 'px');



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





  // background(2, 73, 124)
  // image(img, 0, 0, 800, 1200);



  // Add the slidervalue
  // let val = slider.value();
  // x_slider = map(val, 0, slidermax, xmargin, width - xmargin);
  // let val = slider.value();
  // x_slider = map(val,0,slidermax,0,width);
  x_slider = sliderglobal;
  var sliderheight = 20;
  var sliderwidth = 10;
  var slidery=ymargin/4;
  stroke(255,255,255,150);fill(255,255,255,200); strokeWeight(1)
  rect(xmargin,slidery,width-2*xmargin,20)
  
  stroke(clr_lvl4, 150);
  strokeWeight(2)
  // stroke(0,0,0); strokeWeight(1)
  for (i=xmargin; i <= width-2*xmargin; i=i+50){
    line(i,ymargin,i,ymargin+sliderheight);
  }
  
  stroke(clr_lvl5,150);fill(255,255,255,150); strokeWeight(1)
  rect(x_slider-sliderwidth/2,slidery,sliderwidth,sliderheight)
  triangle(x_slider-sliderwidth/2,slidery+sliderheight,x_slider,slidery+sliderheight*1.5,x_slider+sliderwidth/2,slidery+sliderheight)
  stroke(0,0,0,150);fill(clr_lvl1); strokeWeight(1)
  line(x_slider,slidery,x_slider,slidery+sliderheight*1.5)
  

  // Draw the nodes
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