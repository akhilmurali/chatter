$(function () {
	//make connection:
	var socket = io.connect('http://localhost:3000');
	//buttons and inputs:
	var chathistory = $(".message-history");
	var send_username = $(".channel-menu");
	var input = $('.input-box_text');
	var username = 'krypton';
	$('#myModal').css('display', 'block');
	$('#add_user_btn').on('click', ()=>{
		username = $('#username_input_field').val();
		$('#myModal').css('display', 'none');
	});

	$('.channel').click(function (event) {
		$('li').removeClass('active');
		$(this).addClass("active");
		//Write more code here:
	});

	$('.input-box_text').on('input', function () {
		socket.emit('typing');
	});

	$('.input-box_text').keypress(function (event) {
		if (event.keyCode === 13) {
			//Fire up the event emmiter:
			socket.emit('new_message', { message: $('.input-box_text').val() , username: username});
			$('.input-box_text').val('');
		}
	});

	$('.user-menu_username').on('click', function(){
		username = 'Pluto';
	});

	//Listen on new_message:
	socket.on("new_message", (data) => {
		chathistory.append(`<div class="message">` +
			'<a href="{{\'\'}}" class="message_profile-pic"></a>' +
			`<a class="message_username">${data.username}</a>` +
			`<span class="message_timestamp">${new Date().getHours()} : ${new Date().getMinutes()}</span>` +
			'<span class="message_star"></span>' +
			`<span class="message_content">${data.message}</span>` +
			'</div>');
	});

	//Emit a username:
	send_username.click(function () {
		socket.emit('change_username', { username: username });
	});

	//Emit typing:
	// input.bind("keypress", () => {
	// 	socket.broadcast.emit('typing', { username: username });
	// });

	//Listen on typing:
	socket.on('typing', (data) => {
		console.log(`${data.username} is typing....`);
		$('#typing_indicator').val(`${data.username} is typing....`);
	});
});


