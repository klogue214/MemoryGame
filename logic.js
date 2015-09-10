$(document).ready(function(){
	var app = {
		cardValues: [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9],
		imageType: 'animals',
		player: 'anonymous',
		startTime: 0,
		init: function() {
			app.shuffle();
			app.preloadImages();
			$('.start-game').on('click', function(e) {
				app.gatherData(e);
			});
		},
		gatherData: function(e) {
			e.preventDefault();
			if($('.player-name').val() !== '') {
				app.player = $('.player-name').val();
				app.clickHandlers();
				app.startTime = new Date();
				console.log(app.startTime);
			} else {
				$('input[type=text]').addClass('shake');
				setTimeout(function() { $('input[type=text]').removeClass('shake'); }, 500);
				return false;
			}
			$('.menu').fadeOut();
		},
		clickHandlers: function() {
			$('.card').on('click', function() {
				app.flipCard($(this));
			});
		},
		shuffle: function() {
			var swap = 0;
			var temp = 0;
			for(i = 0; i < app.cardValues.length; i ++) {
				swap = Math.round(Math.random()*i);
				temp = app.cardValues[i];
				app.cardValues[i] = app.cardValues[swap];
				app.cardValues[swap] = temp;
				$('.container').append('<div class="card unmatched"></div>');
			}
			$('.card').each(function(index){
				$(this).attr('data-card', app.cardValues[index]);
			});
		},
		flipCard: function(card) {
			card.addClass('selected');
			card.css({'background-image': 'url("http://lorempixel.com/150/200/'+app.imageType+'/'+card.data('card')+'")'});
			if($('.selected').length == 2) {
				app.checkMatch();
			}
		},
		checkMatch: function() {
			if($('.selected').first().data('card') == $('.selected').last().data('card')) {
				setTimeout(function() {
					$('.selected').each(function() {
						$(this).removeClass('unmatched selected').css({'background':''}).animate({ opacity: 0 },{duration: 1000});
						app.checkWin();
					});
				}, 1000);
			} else {
				setTimeout(function(){
					$('.selected').each(function() {
						$(this).removeClass('selected').css({'background':''});
					});
				}, 1000);
			}
		},
		checkWin: function() {
			if($('.unmatched').length === 0) {
				$('.results').show();
				var endTime = new Date();
				var time = Math.round((endTime - app.startTime)/1000);
				$('.results .time').text('Your time was '+time+' seconds');
				app.highScores(time);
			}
		},
		highScores: function(time) {
			$.ajax({
				url:'highscores/view.php',
				method: 'POST',
				data: {'name': app.player, 'time': time},
				dataType: 'JSON',
				success: function(data) {
					$.each(data, function(key, value) {
						$('.results .highscores').append('<li>'+key+' -- '+value+' seconds');
					});
				}
			});
		},
		preloadImages: function() {
			var img = [];
			for(i = 0; i < app.cardValues.length; i ++) {
				img[i] = new Image();
				img[i].src = "http://lorempixel.com/150/200/"+app.imageType+"/"+i;
			}
		}
	};
	app.init();
});