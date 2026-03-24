window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 182;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  image.style.width = "300px";
  image.style.height = "auto";
  image.style.display = "block";
  image.style.margin = "0 auto";
  $('#interpolation-image-wrapper').empty().append(image);
}




const INTERP_BASE1 = "./static/interpolation/stacked1";
const NUM_INTERP_FRAMES1 = 147;

const interp_images1 = [];
function preloadInterpolationImages1() {
  for (let i = 0; i < NUM_INTERP_FRAMES1; i++) {
    const path = INTERP_BASE1 + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images1[i] = new Image();
    interp_images1[i].src = path;
  }
}

function setInterpolationImage1(i) {
  const image = interp_images1[i];
  image.ondragstart = () => false;
  image.oncontextmenu = () => false;
  image.style.width = "300px";
  image.style.height = "auto";
  image.style.display = "block";
  image.style.margin = "0 auto";
  $("#interpolation-image-wrapper1").empty().append(image);
}





$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);
	
	
	
	preloadInterpolationImages1();
  $("#interpolation-slider1").on("input", function () {
    setInterpolationImage1(this.value);
  });
  setInterpolationImage1(0);
  $("#interpolation-slider1").prop("max", NUM_INTERP_FRAMES1 - 1);
  
  
  

    bulmaSlider.attach();

})




