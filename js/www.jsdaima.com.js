MorphSVGPlugin.convertToPath('polygon');
var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
  pContainer = select('.pContainer'),
  mainSVG = select('.mainSVG'),
  star = select('#star'),
  sparkle = select('.sparkle'),
  tree = select('#tree'),
  showParticle = true,
  particleColorArray = ['#E8F6F8', '#ACE8F8', '#F6FBFE','#A2CBDC','#B74551', '#5DBA72', '#910B28', '#910B28', '#446D39'],
  // particleTypeArray = ['#star','#circ','#cross','#heart'],
 particleTypeArray = ['#star'],
  particlePool = [],
  particleCount = 0,
  numParticles = 201


gsap.set('svg', {
  visibility: 'visible'
})

gsap.set(sparkle, {
	transformOrigin:'50% 50%',
	y:-100
})

let getSVGPoints = (path) => {
	
	let arr = []
	var rawPath = MotionPathPlugin.getRawPath(path)[0];
	rawPath.forEach((el, value) => {
		let obj = {}
		obj.x = rawPath[value * 2]
		obj.y = rawPath[(value * 2) + 1]
		if(value % 2) {
			arr.push(obj)
		}
		//console.log(value)
	})
	
	return arr;
}

let treePath = getSVGPoints('.treePath')
var treeBottomPath = getSVGPoints('.treeBottomPath')

//console.log(starPath.length)
var mainTl = gsap.timeline({delay:0, repeat:0}), starTl;


//tl.seek(100).timeScale(1.82)

function flicker(p){
  
  //console.log("flivker")
  gsap.killTweensOf(p, {opacity:true});
  gsap.fromTo(p, {
    opacity:1
  }, {
		duration: 0.07,
    opacity:Math.random(),
    repeat:-1
  })
}

function createParticles() {
  
  //var step = numParticles/starPath.length;
  //console.log(starPath.length)
  var i = numParticles, p, particleTl, step = numParticles/treePath.length, pos;
  while (--i > -1) {
    
    p = select(particleTypeArray[i%particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
    p.setAttribute('class', "particle");   
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
                 x:-100, 
                 y:-100,
   transformOrigin:'50% 50%'
                 })
  }

}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle(p){
  if(!showParticle){return};
  var p = particlePool[particleCount]
  gsap.set(p, {
    x: gsap.getProperty('.pContainer', 'x'),
    y: gsap.getProperty('.pContainer', 'y'),
    // x: gsap.getProperty('.sparkle', 'x'),
    // y: gsap.getProperty('.sparkle', 'y'),
    scale:getScale()
      }
  );
  var tl = gsap.timeline();
  tl.to(p, {
		duration: gsap.utils.random(0.61,6),
      physics2D: {
        velocity: gsap.utils.random(-23, 23),
        angle:gsap.utils.random(-180, 180),
        gravity:gsap.utils.random(-6, 50)
      },
      scale:0,
      rotation:gsap.utils.random(-123,360),
      ease: 'power1',
      onStart:flicker,
      onStartParams:[p],
      //repeat:-1,
      onRepeat: (p) => {
        gsap.set(p, {         
            scale:getScale()
        })
      },
      onRepeatParams: [p]

    });
  

  //
  //particlePool[particleCount].play();
  particleCount++;
  //mainTl.add(tl, i / 1.3)
  particleCount = (particleCount >=numParticles) ? 0 : particleCount
  
}

function drawStar(){
  starTl = gsap.timeline({onUpdate: playParticle})
  starTl.to('.pContainer, .sparkle', {
		duration: 6,
		motionPath :{
			path: '.treePath',
      autoRotate: false
		},
    ease: 'linear'
  })  
  .to('.pContainer, .sparkle', {
		duration: 1,
    onStart:function(){showParticle = false},
    x:treeBottomPath[0].x,
    y:treeBottomPath[0].y
  })
  .to('.pContainer, .sparkle',  {
		duration: 2,
    onStart:function(){showParticle = true},
		motionPath :{
			path: '.treeBottomPath',
      autoRotate: false
		},
    ease: 'linear'    
  },'-=0')
   
  //gsap.staggerTo(particlePool, 2, {})
  // createParticles()
  var i = numParticles, p, particleTl, step = numParticles/treePath.length, pos;
  while (--i > -1) {
    
    p = select(particleTypeArray[i%particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
    p.setAttribute('class', "particle");   
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
                 x:-100, 
                 y:-100,
   transformOrigin:'50% 50%'
                 })
  }

}
function drawStar1(){
  starTl = gsap.timeline()
  starTl.to('.treeStarOutline', {
	  duration: 2,
    opacity:1,
    ease:"rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
  },'+=0')
  .to('.treeStarOutline', {
	  duration: 2,
    opacity:0,
    ease:"rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
  },'+=0')
}



$(document).ready(function(){
  start();
  // window.setTimeout(start,6000);
});

function start(){
  drawStar();
  var t1 = window.setInterval(drawStar,6000);
  // var t1 = window.setInterval(createParticles,6000);
  var t1 = window.setInterval(drawStar1,2000);
  window.setTimeout(svgInDisplay,6000);

  var box = document.getElementById("s1"),
  count = 0,
  tween;

  // 往复运动
  tween = TweenMax.to(['.s1','.s3'], 3, {
    y: "15%",
    x: 5,
    repeat: 100,
    yoyo: true,
    // onRepeat: onRepeat,
    repeatDelay: 1,
    ease: Linear.easeNone
  });

  TweenMax.to(['.s2'], 3, {
    y: "15%",
    x: -5,
    repeat: 100,
    yoyo: true,
    // onRepeat: onRepeat,
    repeatDelay: 3,
    ease: Linear.easeNone
  });
  TweenMax.to(['.s4','.s5'], 3, {
    y: "10%",
    repeat: 100,
    yoyo: true,
    // onRepeat: onRepeat,
    repeatDelay: 2,
    ease: Linear.easeNone
  });
  // function onRepeat() {
  //   count++;
  //   box.innerHTML = count;
  //   TweenLite.set(box, {
  //     backgroundColor: "hsl(" + Math.random() * 255 + ", 90%, 60%)"
  //   });
  // }

  mainTl.from(['.treePathMask','.treePotMask'],{
    duration: 6,
    drawSVG:'0% 0%',
    stroke:'#FFF',
    stagger: {
      each: 6
    },
    duration: gsap.utils.wrap([6, 1,2]),
    ease:'linear'
    })
    .from('.treeStar', {
      duration: 3,
      //skewY:270,
      scaleY:0,
      scaleX:0.15,
      transformOrigin:'50% 50%',
      ease: 'elastic(1,0.5)'
    },'-=4')
  .to('.sparkle', {
    duration: 3,
      opacity:0,
      ease:"rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})"
    },'-=0')
    .from('.treeBottomMask', {
      duration: 2,
      drawSVG:'0% 0%',
      stroke:'#FFF',
      ease:'linear',
      stagger: {
        each: 6
      } 
    },'-=3') 
  
    // .to('.treeStarOutline', {
    //   duration: 2,
    //   opacity:1,
    //   ease:"rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
    // },'+=0')
  
  //  .to('.tree', {
  //   opacity: 0
  // }, '+=2') 
  
  mainTl.add(starTl, 0)
  gsap.globalTimeline.timeScale(1.5);
}
//ScrubGSAPTimeline(mainTl)
function svgInDisplay(){
  $(document).ready(function(){
    $(".svgIn").fadeIn(1000);
    // $('.svgIn').show();
  });
}

$(".icon").click(function(e){    
  var list = ['皮皮呀~', '小鞠鞠~', '❤❤❤❤~~~', '爱你~', '（づ￣3￣）づ╭❤～', '嘻嘻(#^.^#)',"圣诞快乐！",
  "要开心喔(*^▽^*)","ლ(°◕‵ƹ′◕ლ)","ʕ๑•ɷ•๑ʔ❀","❤(ε)❤","ξ( ✿＞◡❛)","ε(○´∀｀)зε(´∀｀●)з牵手手",
  "ʕ ᵔᴥᵔ ʔ","什么时候才能花前月下呀"];
  textUp( e, 2000, list, 200 )
})
// 漂浮文字
function textUp( e, time, arr, heightUp ){
  var lists = Math.floor(Math.random() * arr.length);
  var colors = '#'+Math.floor(Math.random()*0xffffff).toString(16);
  var $i = $('<span />').text( arr[lists] );
  var xx = e.pageX || e.clientX + document.body.scroolLeft;
  var yy = e.pageY || e.clientY + document.body.scrollTop;

  $('body').append($i);
  $i.css({
      top: yy,
      left: xx,
      color: colors,
      transform: 'translate(-50%, -50%)',
      display: 'block',
      position: 'absolute',
      zIndex: 999999999999
  })  
  $i.animate({
      top: yy - ( heightUp ? heightUp : 200 ),
      opacity: 0
  }, time, function(){
      $i.remove();
  })            
}