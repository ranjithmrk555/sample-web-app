/* Custom */
var imageList = [];

$(document).ready(function() {
	// Popup
	$(document).on("click",".custom-popup-toggle",function(e) {
		// Disable popup by clicking this button
		if($("button").hasClass('icon-btn')) {
			$(".icon-btn").click(function(event){
				event.stopPropagation();
				// console.log("pass")
			});
		}
		
		e.preventDefault();
		$('.custom-popup').toggleClass('isVisible');
		$('body').toggleClass('isPopupOpen');
		const imageId = $(this).attr("image-id");
		const key = $(this).attr("key");
		updatePopup(imageId,parseInt(key));
	});

	// Esc key pressed
	$(document).keydown(function(e) {
		if (e.keyCode == 27) {
		    $('.custom-popup').toggleClass('isVisible');
			$('body').toggleClass('isPopupOpen');
			
			// Reset Zoom Image
			$(".full-image-trigger").removeClass("isHit")
			$(".image-place-holder").removeClass("full-image");
		}
	});

	// Nav Controls
	$(document).on("click",".arrow-control-prev",function(e) {
		const key = $(this).attr("key");
		const tempKey = parseInt(key) - 1;		
		if(!enableDisable(tempKey))
		return false;
		const imageId = imageList[tempKey].id;
		// console.log(imageList,tempKey);
		updatePopup(imageId,tempKey);

		// Reset Zoom Image
		$(".full-image-trigger").removeClass("isHit")
		$(".image-place-holder").removeClass("full-image");
	});

	$(document).on("click",".arrow-control-next",function(e) {
		const key = $(this).attr("key");
		const tempKey = parseInt(key) + 1;
		if(!enableDisable(tempKey))
		return false;
		// console.log(imageList,tempKey);
		const imageId = imageList[tempKey].id;
		updatePopup(imageId,tempKey);

		// Reset Zoom Image
		$(".full-image-trigger").removeClass("isHit")
		$(".image-place-holder").removeClass("full-image");
	});

	// Full Image
	$(".full-image-trigger").on("click", function() {
		$(this).toggleClass("isHit")
		$(".image-place-holder").toggleClass("full-image");
	});

	//var url="https://api.unsplash.com/photos?page=1&per_page=20&client_id=o2HYd-3WDHa23Xa93YBAz_ld9k5BQyPv-F9OPh9UlPw";
	var url="https://api.unsplash.com/photos?page=1&per_page=25&order_by=latest&client_id=o2HYd-3WDHa23Xa93YBAz_ld9k5BQyPv-F9OPh9UlPw";

	$.ajax({
		method: 'GET',
		url: url,
		success: function (data) {
			console.log("Unsplash data",data);
			// console.log(data[0].user.bio);
			imageList = data;
			addImage(data);
			
		}
	});
});

function enableDisable(tempKey){
	console.log("key",tempKey)
	if(tempKey === 0)
	{
		$(".arrow-prev").addClass("disable");
	} 
	else if(tempKey === imageList.length-1)
	{
		$(".arrow-next").addClass("disable");
	} 
	else if(tempKey === -1 || tempKey === imageList.length)
	{
		return false;
	} 
	else {
		$(".arrow-next").removeClass("disable");
		$(".arrow-prev").removeClass("disable");
	} 
	return true;
}

function updatePopup(imageId,key) {
	enableDisable(key)
	const url=`https://api.unsplash.com/photos/${imageId}?client_id=o2HYd-3WDHa23Xa93YBAz_ld9k5BQyPv-F9OPh9UlPw`;
	
	// Loader Image
	$(".popup-image").addClass("image-loader").attr("src","assets/images/loader.gif");
	
	$.ajax({
		method: 'GET',
		url: url,
		success: function (data) {
			console.log("Unsplash image data",data);
			$(".popup-image").removeClass("image-loader")
			$(".popup-image").attr("src",data.urls.full);

			$(".popup-user-image").attr("src",data.user.profile_image.small);
			$(".popup-user-image").attr("alt",data.alt_description);
			$(".popup-user-name").html(data.user.name);
			$(".popup-user-name").attr("href",data.user.links.html);
			$(".popup-user-desc").html(data.description);
			
			$(".popup-user-download").attr("href",data.links.download);

			// $(".user-views").html(data.views);
			$(".user-views-count").html(data.views);
			$(".user-downloads-count").html(data.downloads);

			$(".arrow-control-prev").attr("key",key);
			$(".arrow-control-next").attr("key",key);

			// Extra Data
			$(".user-published").html(data.updated_at);
			// $(".user-camera").html(data.updated_at);
			// $(".user-license").html(data.updated_at);
		}
	});
}
function addImage(data) {
	data.forEach((rec, key) => {
	console.log("rec", rec,key)
	// console.log("Taggggggg", rec.sponsorship?.tagline,rec.sponsorship?.tagline_url);
	let imageContent = `<div class="custom-grid-item custom-popup-toggle animation-element" image-id="${rec.id}" key="${key}">
	<img src="${rec.urls.regular}" alt="${rec.alt_description}">
	<div class="cgi-content">
		<div class="cgi-content-top">		   
			<div class="cgi-content-top-left">
				<p>${rec.sponsorship ? 'Sponsored': ''}</p>
			</div>
			<div class="cgi-content-top-right">
				<button class="icon-btn heart-btn" title="Heart"><i class="fa-solid fa-heart"></i></button>
				<button class="icon-btn download-btn" title="Add"><i class="fa-light fa-plus"></i></button>
			</div>
		</div>
		<div class="cgi-content-bottom">
			<div class="cgi-content-bottom-left">
				<div class="user-photo">
					<img src="${rec.user.profile_image.small}" alt="${rec.alt_description}">
				</div>
				<div class="user-text">
					<p>${rec.user.first_name}</p>
					<a target="_blank" href="${rec.sponsorship ? rec.sponsorship.tagline_url: '#'}">${rec.sponsorship ? rec.sponsorship.tagline: ''}</a>
				</div>
			</div>
			<div class="cgi-content-bottom-right">
				<div class="download">
					<a class="icon-btn download-btn" href="${rec.links.download}" download><i class="fa-solid fa-download"></i></a>
				</div>
			</div>
		</div>
	</div>`;
	$(".custom-grid").append(imageContent);
	});
	// console.log("htmllll", $(".custom-grid").html())
	//$(".related-photo").html($(".custom-grid").html());
}

$(document).on("click",".download-btn",function(e) { 
	e.preventDefault();
	forceDownload($(this).attr("href"), "test.jpg")
});
  function forceDownload(url, fileName) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.responseType = "blob";
	xhr.onload = function () {
		var urlCreator = window.URL || window.webkitURL;
		var imageUrl = urlCreator.createObjectURL(this.response);
		var tag = document.createElement('a');
		tag.href = imageUrl;
		tag.download = fileName;
		document.body.appendChild(tag);
		tag.click();
		document.body.removeChild(tag);
	}
	xhr.send();
}