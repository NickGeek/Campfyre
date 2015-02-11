//Setting up variables
var tag = "";
var loaded = false;
var page = 1;
var lastPost = 0;
var ws = io('ws://'+window.location.hostname+':3973');
var userID = '';
var currentPageFile = location.pathname.substring(1);
var topics = ['clamminess', 'Nick', 'Bitcoin', 'your mum', 'homework', 'procrastination', 'tautology', 'anything', 'spiderman', 'The Doctor', '&#26085;&#26412;', 'a = &Delta;v/&Delta;t', 'The Sims', 'CHIM', 'life', 'stuff', 'the weather', 'python', 'COBOL', 'campfires', 'Google Buzz', 'emoji', 'Totoro', 'Constantine', 'ideas', 'GitHub', 'Android', 'iOS', 'GNU/Linux', 'Arch Linux', 'Ubuntu', 'xkcd', 'tents', 'creeps', 'corn crisps', '#rebellion', 'Briggleybear', 'Y&#831;&#770;&#770;&#843;&#833;&#773;&#855;&#780;&#829;&#786;&#794;&#787;&#773;&#783;&#864;&#773;&#861;&#835;&#849;&#784;&#779;&#829;&#772;&#776;&#855;&#779;&#836;&#838;&#842;&#830;&#838;&#775;&#861;&#787;&#849;&#774;&#836;&#768;&#794;&#777;&#859;&#776;&#774;&#831;&#778;&#833;&#844;&#781;&#844;&#788;&#781;&#843;&#829;&#785;&#785;&#861;&#781;&#836;&#814;&#816;&#858;&#854;&#846;&#803;&#816;&#806;&#798;&#805;&#841;&#840;&#839;&#796;&#801;&#811;&#793;&#793;&#801;&#857;&#803;&#791;&#796;&#812;&#799;&#818;&#792;&#802;&#793;&#806;&#825;&#799;&#800;&#846;&#816;&#793;&#852;&#827;&#806;&#800;&#798;&#837;&#796;&#814;&#799;&#797;o&#784;&#836;&#829;&#783;&#833;&#844;&#849;&#829;&#838;&#776;&#835;&#842;&#848;&#838;&#829;&#784;&#783;&#842;&#829;&#850;&#831;&#784;&#861;&#771;&#773;&#842;&#794;&#771;&#844;&#778;&#795;&#849;&#836;&#850;&#776;&#769;&#830;&#772;&#778;&#829;&#783;&#780;&#781;&#788;&#784;&#782;&#789;&#842;&#857;&#796;&#817;&#804;&#857;&#819;&#809;&#846;&#860;&#853;&#826;&#800;&#846;&#858;&#799;&#792;&#792;&#809;&#802;&#803;&#837;&#791;&#804;&#797;&#802;&#858;&#860;&#805;&#812;&#804;&#815;&#828;&#818;&#827;&#853;&#827;&#793;&#840;&#837;&#817;&#797;&#853;&#797;u&#779;&#784;&#779;&#768;&#787;&#769;&#849;&#784;&#830;&#771;&#795;&#781;&#768;&#861;&#785;&#783;&#794;&#830;&#794;&#848;&#768;&#788;&#836;&#787;&#775;&#838;&#779;&#782;&#772;&#779;&#861;&#773;&#831;&#783;&#780;&#829;&#771;&#864;&#794;&#831;&#789;&#859;&#786;&#782;&#776;&#835;&#833;&#795;&#864;&#842;&#787;&#768;&#776;&#771;&#770;&#861;&#794;&#845;&#826;&#790;&#815;&#854;&#810;&#803;&#839;&#804;&#817;&#817;&#860;&#827;&#796;&#812;&#803;&#810;&#828;&#858;&#860;&#798;&#791;&#808;&#818;&#845;&#839;&#817;&#798;&#851;&#828;&#799;&#860;&#810;&#801;&#857;&#806;&#852;&#815;&#801;&#799;&#815;&#827;&#791;&#826;&#799;&#852; &#833;&#768;&#772;&#842;&#783;&#848;&#836;&#783;&#835;&#830;&#829;&#832;&#770;&#789;&#848;&#789;&#786;&#784;&#850;&#832;&#831;&#769;&#783;&#832;&#773;&#795;&#768;&#832;&#795;&#769;&#784;&#844;&#782;&#831;&#849;&#781;&#850;&#780;&#775;&#856;&#835;&#838;&#850;&#779;&#858;&#806;&#853;&#805;&#846;&#790;&#793;&#815;&#857;&#811;&#801;&#837;&#805;&#804;&#827;&#806;&#799;&#806;&#845;&#816;&#828;&#800;&#804;&#804;&#858;&#860;&#853;&#809;&#851;&#791;&#851;&#816;&#801;&#802;&#802;&#809;&#796;&#840;&#840;&#839;&#817;&#790;&#846;&#802;&#809;&#817;&#802;&#839;&#852;&#837;&#837;&#813;&#810;&#854;&#803;&#845;&#806;&#804;&#791;w&#849;&#836;&#838;&#864;&#861;&#789;&#850;&#781;&#784;&#861;&#861;&#771;&#844;&#838;&#838;&#832;&#843;&#782;&#843;&#844;&#864;&#849;&#773;&#829;&#861;&#829;&#831;&#832;&#780;&#842;&#785;&#859;&#786;&#834;&#836;&#861;&#844;&#777;&#856;&#772;&#849;&#785;&#850;&#782;&#835;&#837;&#853;&#813;&#857;&#807;&#857;&#846;&#797;&#792;&#858;&#803;&#812;&#804;&#853;&#796;&#802;&#799;&#841;&#857;&#841;&#797;&#810;&#845;&#857;&#800;&#839;&#845;&#800;&#808;&#793;&#809;&#846;&#800;&#860;&#801;&#809;&#811;&#791;&#807;&#799;&#790;&#798;&#817;&#814;&#814;&#851;&#858;&#802;&#799;&#828;&#809;&#828;&#797;&#818;&#851;&#858;&#814;&#814;&#805;&#811;i&#856;&#768;&#855;&#844;&#772;&#855;&#775;&#779;&#771;&#777;&#834;&#830;&#768;&#772;&#785;&#861;&#778;&#795;&#777;&#855;&#787;&#772;&#836;&#836;&#780;&#773;&#769;&#784;&#834;&#831;&#786;&#859;&#856;&#771;&#794;&#859;&#785;&#832;&#781;&#859;&#770;&#789;&#784;&#834;&#830;&#789;&#785;&#781;&#856;&#769;&#850;&#772;&#835;&#804;&#841;&#807;&#798;&#825;&#860;&#826;&#791;&#837;&#804;&#809;&#815;&#837;&#808;&#841;&#814;&#803;&#837;&#841;&#828;&#828;&#815;&#817;&#799;&#825;&#810;&#851;&#799;&#805;&#802;&#790;&#804;&#817;&#854;&#817;&#793;&#839;&#791;&#805;&#802;&#828;&#791;&#814;&#852;&#801;&#793;&#807;&#810;&#793;&#813;&#858;&#815;&#845;&#792;l&#833;&#836;&#775;&#786;&#785;&#829;&#774;&#830;&#844;&#861;&#864;&#779;&#773;&#842;&#842;&#784;&#850;&#781;&#849;&#776;&#833;&#787;&#835;&#842;&#850;&#838;&#794;&#861;&#770;&#861;&#781;&#794;&#833;&#789;&#777;&#785;&#772;&#836;&#848;&#769;&#831;&#788;&#779;&#789;&#861;&#786;&#850;&#859;&#834;&#770;&#784;&#831;&#780;&#778;&#779;&#781;&#777;&#780;&#783;&#852;&#804;&#846;&#802;&#854;&#813;&#805;&#827;&#837;&#845;&#791;&#860;&#851;&#854;&#846;&#816;&#840;&#819;&#853;&#812;&#790;&#816;&#803;&#853;&#840;&#791;&#815;&#805;&#813;&#802;&#858;&#805;&#860;&#818;&#814;&#800;&#818;&#791;&#853;&#852;&#812;&#805;&#804;&#839;&#851;&#806;&#839;&#840;&#846;&#802;&#839;&#809;l&#832;&#785;&#842;&#864;&#773;&#769;&#834;&#789;&#836;&#789;&#775;&#833;&#786;&#859;&#859;&#771;&#849;&#768;&#787;&#787;&#779;&#848;&#842;&#776;&#777;&#835;&#864;&#773;&#836;&#789;&#789;&#782;&#783;&#855;&#774;&#831;&#830;&#836;&#784;&#779;&#774;&#783;&#777;&#789;&#861;&#840;&#796;&#818;&#840;&#827;&#816;&#837;&#803;&#818;&#828;&#841;&#841;&#801;&#797;&#800;&#837;&#791;&#858;&#806;&#853;&#813;&#840;&#817;&#827;&#858;&#798;&#819;&#815;&#858;&#858;&#837;&#812;&#812;&#793;&#818;&#818;&#804;&#854;&#818;&#811;&#802;&#845; &#776;&#835;&#829;&#770;&#787;&#775;&#768;&#775;&#785;&#855;&#835;&#835;&#772;&#768;&#771;&#770;&#842;&#773;&#773;&#783;&#775;&#832;&#775;&#778;&#849;&#771;&#864;&#836;&#833;&#844;&#855;&#768;&#843;&#771;&#848;&#784;&#838;&#776;&#785;&#836;&#782;&#789;&#774;&#772;&#864;&#796;&#826;&#860;&#857;&#803;&#797;&#837;&#805;&#810;&#827;&#790;&#799;&#860;&#804;&#810;&#814;&#853;&#793;&#825;&#805;&#803;&#815;&#797;&#809;&#799;&#798;&#825;&#825;&#845;&#814;&#792;&#841;&#792;&#810;&#851;&#810;&#790;&#837;&#845;&#816;&#858;&#811;&#793;&#807;&#811;&#812;&#800;&#851;&#828;&#841;&#841;&#860;&#818;&#806;&#845;&#815;&#828;&#793;&#851;n&#778;&#771;&#834;&#859;&#859;&#850;&#843;&#768;&#778;&#856;&#849;&#861;&#787;&#844;&#771;&#787;&#787;&#832;&#864;&#848;&#786;&#830;&#864;&#794;&#835;&#782;&#788;&#773;&#848;&#780;&#842;&#784;&#861;&#771;&#772;&#785;&#861;&#842;&#849;&#861;&#788;&#848;&#832;&#861;&#836;&#779;&#768;&#831;&#781;&#843;&#770;&#850;&#855;&#807;&#826;&#804;&#851;&#846;&#792;&#790;&#812;&#790;&#816;&#852;&#796;&#837;&#812;&#854;&#854;&#813;&#817;&#798;&#814;&#817;&#858;&#814;&#860;&#837;&#802;&#796;&#792;&#810;&#810;&#790;&#819;&#840;&#819;&#818;&#854;&#845;&#805;&#827;&#810;&#819;&#851;&#813;&#802;&#816;&#790;&#857;&#813;&#860;&#792;&#813;&#840;&#804;&#827;&#840;&#851;&#854;&#819;e&#836;&#783;&#836;&#855;&#770;&#848;&#842;&#842;&#836;&#836;&#848;&#795;&#769;&#850;&#833;&#770;&#771;&#833;&#788;&#781;&#830;&#843;&#785;&#769;&#836;&#781;&#831;&#772;&#850;&#782;&#856;&#771;&#770;&#776;&#832;&#775;&#835;&#830;&#781;&#850;&#842;&#838;&#779;&#782;&#768;&#861;&#836;&#795;&#779;&#782;&#829;&#787;&#787;&#784;&#773;&#844;&#831;&#832;&#807;&#805;&#793;&#791;&#825;&#808;&#814;&#813;&#837;&#798;&#798;&#812;&#840;&#801;&#828;&#845;&#813;&#818;&#804;&#845;&#797;&#839;&#827;&#828;&#802;&#853;&#827;&#793;&#804;&#806;&#853;&#802;&#816;&#803;&#808;&#858;&#808;&#803;&#814;&#818;&#825;&#810;v&#789;&#786;&#789;&#838;&#831;&#789;&#782;&#768;&#786;&#788;&#836;&#785;&#842;&#795;&#777;&#836;&#777;&#844;&#787;&#848;&#864;&#795;&#859;&#835;&#830;&#834;&#838;&#788;&#833;&#832;&#844;&#781;&#859;&#859;&#836;&#829;&#795;&#778;&#833;&#864;&#859;&#832;&#780;&#850;&#844;&#771;&#855;&#774;&#859;&#786;&#836;&#789;&#778;&#781;&#864;&#768;&#776;&#775;&#836;&#830;&#775;&#836;&#809;&#810;&#853;&#793;&#805;&#798;&#791;&#837;&#810;&#813;&#798;&#826;&#803;&#841;&#810;&#841;&#801;&#791;&#851;&#845;&#796;&#840;&#853;&#813;&#809;&#839;&#810;&#806;&#807;&#846;&#860;&#813;&#806;&#811;&#797;&#803;&#800;&#796;&#807;&#809;&#860;&#803;&#839;&#804;&#802;&#839;&#816;&#826;&#826;&#792;&#815;e&#775;&#836;&#829;&#788;&#770;&#779;&#833;&#831;&#784;&#833;&#831;&#842;&#838;&#794;&#795;&#786;&#861;&#836;&#779;&#794;&#834;&#781;&#838;&#842;&#849;&#831;&#855;&#785;&#830;&#783;&#855;&#771;&#768;&#829;&#836;&#781;&#774;&#788;&#864;&#769;&#829;&#842;&#834;&#773;&#829;&#848;&#780;&#774;&#789;&#772;&#836;&#780;&#829;&#784;&#845;&#793;&#852;&#804;&#852;&#791;&#799;&#839;&#828;&#815;&#817;&#841;&#851;&#840;&#846;&#808;&#797;&#812;&#792;&#796;&#851;&#851;&#857;&#807;&#828;&#853;&#803;&#857;&#793;&#851;&#803;&#853;&#815;&#798;&#790;&#852;&#804;&#803;&#800;&#854;&#792;&#791;&#792;&#813;&#827;r&#777;&#781;&#788;&#782;&#774;&#784;&#831;&#770;&#836;&#831;&#782;&#842;&#834;&#774;&#848;&#779;&#834;&#775;&#772;&#786;&#850;&#861;&#785;&#835;&#794;&#779;&#834;&#836;&#768;&#794;&#856;&#782;&#849;&#855;&#864;&#836;&#780;&#772;&#836;&#844;&#789;&#856;&#844;&#780;&#783;&#794;&#835;&#779;&#850;&#792;&#809;&#803;&#857;&#792;&#852;&#802;&#810;&#854;&#846;&#837;&#814;&#798;&#837;&#816;&#798;&#796;&#852;&#792;&#828;&#790;&#852;&#846;&#803;&#826;&#806;&#800;&#797;&#797;&#806;&#816;&#799;&#791;&#852;&#810;&#813;&#852;&#798;&#793;&#804;&#839;&#804;&#841;&#846;&#837;&#806;&#806;&#802;&#793;&#857;&#828;&#804;&#825;&#799;&#804;&#808;&#828;&#812;&#811; &#783;&#773;&#842;&#771;&#789;&#789;&#778;&#795;&#842;&#772;&#836;&#782;&#836;&#859;&#844;&#842;&#842;&#780;&#861;&#769;&#784;&#832;&#789;&#836;&#777;&#843;&#795;&#778;&#843;&#842;&#784;&#770;&#773;&#856;&#795;&#774;&#769;&#844;&#768;&#771;&#849;&#785;&#833;&#844;&#779;&#842;&#835;&#856;&#795;&#861;&#779;&#834;&#784;&#781;&#833;&#855;&#838;&#780;&#834;&#779;&#771;&#851;&#801;&#825;&#841;&#846;&#798;&#853;&#846;&#812;&#809;&#828;&#841;&#839;&#845;&#797;&#790;&#813;&#819;&#805;&#837;&#799;&#805;&#802;&#840;&#819;&#827;&#840;&#790;&#837;&#803;&#808;&#803;&#811;&#840;&#827;&#790;&#818;&#809;&#828;&#792;&#826;&#814;&#857;&#853;&#857;&#805;&#816;&#860;&#846;&#802;&#826;&#854;&#845;e&#775;&#848;&#836;&#786;&#835;&#848;&#844;&#864;&#833;&#850;&#789;&#849;&#829;&#835;&#831;&#849;&#774;&#844;&#855;&#772;&#773;&#768;&#849;&#768;&#778;&#833;&#775;&#843;&#849;&#838;&#794;&#783;&#769;&#780;&#787;&#856;&#771;&#788;&#832;&#861;&#774;&#774;&#779;&#843;&#773;&#779;&#789;&#838;&#774;&#831;&#784;&#834;&#849;&#795;&#844;&#801;&#793;&#857;&#798;&#839;&#800;&#804;&#814;&#840;&#796;&#790;&#817;&#819;&#818;&#860;&#798;&#809;&#806;&#852;&#854;&#827;&#793;&#803;&#814;&#800;&#813;&#792;&#837;&#826;&#845;&#852;&#810;&#852;&#797;&#808;&#816;&#852;&#857;&#815;&#858;&#790;&#808;&#857;&#814;&#790;&#790;&#819;&#796;&#808;&#813;&#837;&#801;&#828;&#812;&#793;&#860;&#818;&#818;&#827;&#811;&#811;s&#833;&#772;&#775;&#768;&#788;&#849;&#794;&#779;&#786;&#787;&#834;&#856;&#864;&#776;&#768;&#861;&#778;&#855;&#844;&#782;&#834;&#789;&#779;&#836;&#782;&#861;&#782;&#850;&#789;&#864;&#850;&#835;&#836;&#848;&#844;&#771;&#832;&#795;&#795;&#842;&#833;&#787;&#789;&#835;&#842;&#859;&#831;&#849;&#783;&#864;&#808;&#810;&#805;&#858;&#853;&#818;&#793;&#811;&#803;&#792;&#816;&#860;&#812;&#804;&#819;&#818;&#860;&#860;&#813;&#845;&#812;&#808;&#797;&#805;&#800;&#825;&#817;&#854;&#860;&#851;&#798;&#792;&#828;&#846;&#809;&#813;&#851;&#840;&#804;&#810;&#803;&#802;&#814;&#837;&#798;&#806;&#817;&#807;&#815;&#858;&#857;&#858;&#854;&#837;&#801;&#845;&#802;c&#783;&#830;&#774;&#831;&#795;&#861;&#769;&#832;&#786;&#781;&#784;&#780;&#861;&#844;&#773;&#843;&#794;&#783;&#844;&#838;&#774;&#779;&#786;&#781;&#773;&#831;&#772;&#769;&#830;&#848;&#794;&#768;&#829;&#848;&#776;&#783;&#773;&#838;&#773;&#780;&#864;&#778;&#777;&#835;&#789;&#795;&#787;&#774;&#833;&#770;&#782;&#848;&#782;&#782;&#830;&#850;&#829;&#794;&#772;&#806;&#797;&#802;&#854;&#858;&#841;&#790;&#827;&#799;&#818;&#837;&#815;&#827;&#827;&#806;&#807;&#800;&#804;&#810;&#816;&#818;&#814;&#852;&#813;&#814;&#803;&#801;&#860;&#840;&#810;&#825;&#851;&#825;&#853;&#840;&#790;&#797;&#828;&#798;&#813;&#806;&#846;&#853;&#805;&#798;&#798;&#826;&#846;&#812;&#800;&#819;&#805;&#818;&#826;&#791;&#828;&#790;&#857;&#814;&#802;a&#836;&#794;&#850;&#783;&#789;&#861;&#842;&#861;&#774;&#777;&#836;&#786;&#773;&#859;&#830;&#855;&#856;&#838;&#838;&#786;&#779;&#783;&#777;&#774;&#843;&#834;&#836;&#838;&#783;&#831;&#775;&#861;&#835;&#844;&#771;&#831;&#850;&#849;&#834;&#788;&#781;&#777;&#829;&#850;&#859;&#783;&#769;&#829;&#838;&#769;&#864;&#770;&#838;&#800;&#818;&#826;&#815;&#808;&#846;&#807;&#802;&#799;&#790;&#825;&#803;&#841;&#810;&#803;&#801;&#791;&#860;&#826;&#807;&#845;&#858;&#839;&#800;&#858;&#802;&#812;&#810;&#854;&#840;&#806;&#845;&#841;&#811;&#826;&#841;&#799;&#812;&#860;&#845;&#798;&#808;&#811;&#793;&#798;&#801;&#791;&#860;&#857;&#808;&#799;&#805;&#853;&#852;&#804;&#809;&#804;&#818;p&#795;&#861;&#782;&#774;&#768;&#782;&#773;&#768;&#843;&#787;&#779;&#772;&#785;&#835;&#774;&#789;&#842;&#833;&#773;&#777;&#783;&#780;&#838;&#855;&#836;&#769;&#784;&#785;&#784;&#848;&#850;&#777;&#830;&#856;&#861;&#786;&#864;&#795;&#861;&#795;&#772;&#795;&#829;&#842;&#836;&#786;&#787;&#768;&#854;&#801;&#810;&#797;&#852;&#851;&#806;&#796;&#852;&#808;&#806;&#839;&#854;&#854;&#815;&#817;&#793;&#810;&#851;&#811;&#805;&#806;&#808;&#808;&#790;&#852;&#818;&#816;&#818;&#851;&#802;&#860;&#839;&#815;&#814;&#797;&#801;&#837;&#793;&#812;&#860;&#853;&#826;&#798;&#800;&#809;&#793;&#803;&#841;&#797;&#799;&#853;&#799;&#813;&#803;&#846;e&#849;&#849;&#789;&#781;&#776;&#771;&#834;&#789;&#794;&#844;&#794;&#778;&#859;&#781;&#778;&#794;&#776;&#829;&#850;&#829;&#788;&#782;&#849;&#794;&#776;&#787;&#772;&#774;&#777;&#794;&#787;&#834;&#787;&#843;&#849;&#794;&#794;&#850;&#786;&#855;&#789;&#861;&#781;&#794;&#776;&#861;&#835;&#783;&#843;&#839;&#804;&#818;&#806;&#811;&#813;&#812;&#858;&#804;&#819;&#826;&#799;&#802;&#840;&#814;&#790;&#797;&#854;&#813;&#801;&#812;&#793;&#841;&#793;&#799;&#805;&#799;&#814;&#851;&#815;&#813;&#791;&#799;&#837;&#860;&#837;&#814;&#858;&#817;&#808;&#827;&#852;&#805;&#817;&#812;&#817;&#818;&#816;&#828;&#802;&#793;&#819;&#792;&#797;&#827;&#799;&#858;&#854;&#798;&#815;&#792;'];

//NSFW posts
if (store.get('showNSFW')) {
	var showNSFW = store.get('showNSFW');
}
else {
	store.set('showNSFW', 0);
	var showNSFW = store.get('showNSFW');
}

//Display posts when they arrive
ws.on('new post', function(postData) {
	if (currentPageFile != "permalink.html" || $("#posts > section").length < 1) {
		loaded = false;
		postData = JSON.parse(postData);
		var newHTML = '';

		//Handle NSFW posts
		if (showNSFW === 0 && postData.nsfw === 1) {
			return;
		}

		newHTML = newHTML + "<section id="+postData.id+" class='card'>";
		newHTML = newHTML + '<paper-shadow z="3"></paper-shadow>';
			var submitterHash = postData.ip.split("g/")[1].split(".")[0];
			newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+submitterHash+"\")'><img src='"+postData.ip+"' /></a> says...<br></i><a href='permalink.html?id="+postData.id+"'>Permalink</a> | <span data-livestamp="+postData.time+"></span>";
				
				//Tags
				switch (submitterHash) {
					case "324411d31d789ba374008ab7960dfa2f":
						newHTML = newHTML + " [admin]";
						break;
				}
				if (postData.nsfw == 1) {
					newHTML = newHTML + " [nsfw]";
				}
			newHTML = newHTML + "</p>";
			newHTML = newHTML + '<h3 id="postText'+postData.id+'" style="text-align: left;">'+postData.post.replace(new RegExp('\n','g'), '<br />')+'</h3>';

			//Attachments
			if (postData.attachment != "n/a") {
				newHTML = newHTML + attach(postData.attachment)+"<br><br>";
			}

			//Stokes and Comments
			newHTML = newHTML + '<span id="stokeBtn'+postData.id+'"><a class="btn" href="javascript:void(0);" onclick="stoke('+postData.id+', '+postData.score+')">Stoke ('+postData.score+')</a></span>';
			newHTML = newHTML + ' <a id="showCommentButton'+postData.id+'" class="btn" href="javascript:void(0);" onclick="showCommentForm('+postData.id+')">Load comments ('+postData.commentNum.split(" ")[0]+')</a>';
			newHTML = newHTML + ' <a style="display: none;" id="hideCommentButton'+postData.id+'" class="btn" href="javascript:void(0);" onclick="hideCommentForm('+postData.id+')">Hide comments</a>';
			newHTML = newHTML + '<div style="display: none;" id="commentForm'+postData.id+'">';
				newHTML = newHTML + '<br><br><form id="commentForm" method="post">';
					newHTML = newHTML + '<input type="hidden" name="type" value="comment">';
					newHTML = newHTML + '<input type="hidden" name="parent" value="'+postData.id+'">';
					newHTML = newHTML + '<textarea id="postText" name="postText" placeholder="Comment text" class="rounded" rows="5" onkeydown="countChar(this, '+postData.id+')" onkeyup="countChar(this, '+postData.id+')" required></textarea>';
					newHTML = newHTML + '<div style="font-family: "Lato", serif;" id="counter'+postData.id+'">256/256</div><br />';
					newHTML = newHTML + '<b>Subscribe to comments:</b><br />';
					newHTML = newHTML + '<input type="text" name="catcher" style="display: none;">';
					newHTML = newHTML + '<input name="email" type="email" class="rounded" placeholder="E-Mail address (optional)"><br />';
					newHTML = newHTML + '<input class="btn" type="submit" name="post" value="Post">';
				newHTML = newHTML + '</form>';
				newHTML = newHTML + '<a id="goBackCommentBtn'+postData.id+'" style="display: none;" href="javascript:void(0);" onclick="exitThread('+postData.id+');"><< Go Back</a>';
				//Comments have been posted lets show them
				newHTML = newHTML + '<div id="comments'+postData.id+'">';
					for (var i = 0; i < postData.comments.length; ++i) {
						var commenterHash = postData.comments[i].ip.split("g/")[1].split(".")[0];
						newHTML = newHTML + '<div style="padding-left: 0px;" id="comment'+postData.comments[i].id+'">';
						newHTML = newHTML + '<hr />';
						newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+commenterHash+"\")'><img src='"+postData.comments[i].ip+"' /></a> says...<br></i><span data-livestamp="+postData.comments[i].time+" />";
						//Tags
						switch (commenterHash) {
							case "324411d31d789ba374008ab7960dfa2f":
								newHTML = newHTML + " [admin]";
								break;
						}
						newHTML = newHTML + "</p>";
						newHTML = newHTML + '<h4 id="commentText">'+postData.comments[i].comment.replace(new RegExp('\r?\n','g'), '<br />')+'</h4>';
						newHTML = newHTML + '<button class="btn" onclick="replyToComment('+postData.id+', '+postData.comments[i].id+');">Reply</button>';
						newHTML = newHTML + ' <button style="display: none;" id="continueThreadBtn'+postData.comments[i].id+'" class="btn" onclick="loadCommentThread('+postData.comments[i].id+', '+postData.id+');">Continue thread >></button>'
						newHTML = newHTML + '<div style="padding-left: 20px;" id="replies'+postData.comments[i].id+'">';
						newHTML = newHTML + '</div>';
						newHTML = newHTML + '</div>';
					}
				newHTML = newHTML + '</div>';
			newHTML = newHTML + '</div>';
		newHTML = newHTML + "</section>";

		var posts = document.getElementById('posts');
		if (postData.loadBottom) {
			posts.innerHTML = posts.innerHTML + newHTML;
		}
		else {
			posts.innerHTML = newHTML + posts.innerHTML;
		}

		//Submit a comment
		$('#posts').off('submit');
		$('#posts').on('submit','#commentForm',function(e) {
			e.preventDefault();
			
			ws.emit('submit comment', JSON.stringify({
				comment: $(this).find('textarea[name="postText"]').val(),
				email: $(this).find('input[name="email"]').val(),
				catcher: $(this).find('input[name="catcher"]').val(),
				parent: $(this).find('input[name="parent"]').val()
			}));

			$(this)[0].reset();
			return false;
		});

		//Link #tags/URLs
		highlighter(postData.id);

		//Sort the comment replies
		for (var i = 0; i < postData.comments.length; ++i) if (postData.comments[i].parentComment) {
			//Put the comment in the comment replies div for its parent comment
			$('#comment'+postData.comments[i].id).appendTo('#replies'+postData.comments[i].parentComment);

			//Remove comments too deep and make continue thread buttons
			if ($('#comment'+postData.comments[i].parentComment).parents().length >= 13 || !$('#comment'+postData.comments[i].parentComment).parents().length) {
				$('#comment'+postData.comments[i].id).remove();
			}
			if ($('#comment'+postData.comments[i].id).parents().length == 13) {
				$('#continueThreadBtn'+postData.comments[i].id).show();
			}
		}


		loaded = true;
		$('#loadingMessage').hide();
}
});

ws.on('new comment', function(commentData) {
	commentData = JSON.parse(commentData);

	//Increment the number on the counter
	if (!commentData.dontCount) {
		var newCommNum = parseInt(+document.getElementById('showCommentButton'+commentData.parent).innerHTML.split('(')[1].split(')')[0])+1;
		document.getElementById('showCommentButton'+commentData.parent).innerHTML = 'Load comments ('+newCommNum+')';
	}

	var newHTML = '';
	var commenterHash = commentData.ip.split("g/")[1].split(".")[0];
	newHTML = newHTML + '<div style="padding-left: 0px;" id="comment'+commentData.id+'">';
	newHTML = newHTML + '<hr />';
	newHTML = newHTML + "<p><i id='ip'><a href='javascript:void(0);' onclick='loadUserPage(\""+commenterHash+"\")'><img src='"+commentData.ip+"' /></a> says...<br></i><span data-livestamp="+commentData.time+" />";
	//Tags
	switch (commenterHash) {
		case "324411d31d789ba374008ab7960dfa2f":
			newHTML = newHTML + " [admin]";
			break;
	}
	newHTML = newHTML + "</p>";
	if ($('#comment'+commentData.parentComment).parents().length >= 13) {
		return;
	}
	else if ($('#comment'+commentData.parentComment).length === 0) {
		if (commentData.parentComment && !commentData.getChildren) {
			return;
		}
		else {
			newHTML = newHTML + '<h4 id="commentText">'+commentData.comment.replace(new RegExp('\n','g'), '<br />')+'</h4>';
		}
	}
	else {
		newHTML = newHTML + '<h4 id="commentText">'+commentData.comment.replace(new RegExp('\n','g'), '<br />')+'</h4>';
	}
	newHTML = newHTML + '<button class="btn" onclick="replyToComment('+commentData.parent+', '+commentData.id+');">Reply</button>';
	newHTML = newHTML + ' <button style="display: none;" id="continueThreadBtn'+commentData.id+'" class="btn" onclick="loadCommentThread('+commentData.id+', '+commentData.parent+');">Continue thread >></button>';
	newHTML = newHTML + '<div style="padding-left: 20px;" id="replies'+commentData.id+'">';
	newHTML = newHTML + '</div>';
	newHTML = newHTML + "</div>";

	//Insert the comment
	var comments = document.getElementById('comments'+commentData.parent);
	comments.innerHTML = comments.innerHTML + newHTML;


	//Sort the comment replies
	if (commentData.parentComment) {
		//Put the comment in the comment replies div for its parent comment
		$('#comment'+commentData.id).appendTo('#replies'+commentData.parentComment);
	}

	if ($('#comment'+commentData.id).parents().length == 13) {
		$('#continueThreadBtn'+commentData.id).show();
	}

	if (commentData.getChildren) {
		ws.emit('get comment thread', JSON.stringify({
			parent: commentData.id
		}));
	}
});

//Comment Replies
function replyToComment(postParent, commentParent) {
	$('#commentForm').find('input[name="parent"]').val(postParent);
	$('#commentForm').find('input[name="commentParent"]').val(commentParent);
	$('#submitComment').popup('show');
}

//Load into a thread
function loadCommentThread(parent, post) {	
	//Empty the current comments
	$('#comments'+post).empty();

	//Show a go back button
	$('#goBackCommentBtn'+post).show();

	//API call to get all comments with our parent
	ws.emit('get comment thread', JSON.stringify({
		parent: parent
	}));
}

function exitThread(parent) {
	$('#comments'+parent).empty();
	$('#goBackCommentBtn'+parent).hide();

	ws.emit('get bulk comments', JSON.stringify({
		parent: parent
	}));
}

//Attachments
function attach(url) {
var attachCode = '';
var URLbits = document.createElement('a');
URLbits.href = url;

//Get hostname
var hostname = URLbits.hostname;
var sitename = hostname.match(/(youtube|youtu.be|imgur.com|sharepic.tk|puu.sh)/i);

//Create attachement code depending on site
if (sitename != null) {
	switch (sitename[0]) {
		case "youtu.be":
		case "youtube":
			//Thanks to http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = url.match(regExp);
			var videoid = match[2];

			var width = '95%';
			var height = '420';
			attachCode = '<br /><iframe width="'+width+'" height="'+height+'" src="http://youtube.com/embed/'+videoid+'" frameborder="0" allowfullscreen></iframe>';
			break;
		case "imgur.com":
			var imgid = url.split("/");
			imgid = imgid[imgid.length-1];
			imgid = imgid.split(".");
			imgid = imgid[0];
			attachCode = '<a class="imgContainer" target="_blank" href="http://i.imgur.com/'+imgid+'.png"><img src="http://i.imgur.com/'+imgid+'.png" /></a>';
			break;
		case "sharepic.tk":
			attachCode = '<a class="imgContainer" target="_blank" href="'+url+'"><img src="'+url+'" /></a>';
			break;
		case "puu.sh":
			var imgid = url.split("http://puu.sh/")[1].split(".")[0];
			attachCode = '<a class="imgContainer" target="_blank" href="http://puu.sh/'+imgid+'.png"><img src="http://puu.sh/'+imgid+'.png" /></a>';
			break;
		default:
			attachCode = 'Attached URL: <a target="_blank" href="'+url+'">'+url+'</a>';
			break;
	}
}
else {
	attachCode = 'Attached URL: <a target="_blank" href="'+url+'">'+url+'</a>';
}

return attachCode;
}

//Character counter
function countChar(val, id) {
	var counterDiv = "#counter"+id
	var len = val.value.length;
	if (len >= 256) {
		$(counterDiv).text("0/256");
		val.value = val.value.substring(0, 256);
	} else {
		$(counterDiv).text(256 - len+"/256");
	}
};

//Comment form
function showCommentForm(id) {
divToShow = "commentForm"+id;
//Show the comments div
document.getElementById(divToShow).style.display = 'inline';
//Hide the show button
document.getElementById("showCommentButton"+id).style.display = "none";
document.getElementById("hideCommentButton"+id).style.display = "";
}

//Hide the comments
function hideCommentForm(id) {
divToHide = "commentForm"+id;
//Hide the comments div
document.getElementById(divToShow).style.display = 'none';

//Show the show button
document.getElementById("showCommentButton"+id).style.display = "";
document.getElementById("hideCommentButton"+id).style.display = "none";
}

//Auto links
var url_regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
function linkURLs(text) {
return text.replace(
	url_regex,
	'<a target="_blank" href="$1">$1</a>'
);
}

function findLinks(id) {
$('#postText'+id).each(function() {
	$(this).html(linkURLs($(this).html()));
});
};

function highlighter(id) {
findLinks(id);
findHashtags(id);
}

//#YOLOSWAG - thanks to http://stackoverflow.com/questions/4913555/find-twitter-hashtags-using-jquery-and-apply-a-link
// var hashtag_regexp = /(#\w+)/ug;
var hashtag_regexp = /(#(.+?)(?=[\s.,:,!,?,<>,]|$))/g;

function linkHashtags(text) {
return text.replace(
	hashtag_regexp,
	'<a href="javascript:void(0);" onclick="runSearch(\'$1\')">$1</a>'
);
}

function findHashtags(id) {
$('#postText'+id).each(function() {
	$(this).html(linkHashtags($(this).html()));
});
};

$.urlParam = function(name, url) {
	if (!url) {
	 url = window.location.href;
	}
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
	if (!results) { 
		return undefined;
	}
	return results[1] || undefined;
}

ws.on('success message', function(message) {
	message = JSON.parse(message);
	toastr.success(message.body, message.title);
});

ws.on('error message', function(message) {
	message = JSON.parse(message);
	toastr.warning(message.body, message.title);
});

ws.on('post stoked', function(params) {
	params = JSON.parse(params);
	$('#stokeBtn'+params.id).html('<a id="stokeBtn'+params.id+'" class="btn" href="javascript:void();" onclick="stoke('+params.id+')">Stoke ('+params.score+')</a>');
});

ws.on('show nsfw', function() {
	if (showNSFW !== 1) refresh(1);
});

ws.on('score result', function(params) {
	params = JSON.parse(params);
	var title = document.getElementById('searchTitle');
	title.innerHTML = title.innerHTML + '<h2>Stokes: '+params.score+'</h2>';
});

function stoke(postID) {
	ws.emit('stoke', JSON.stringify({
		id: postID
	}));
}

function runSearch(searchQuery) {
	//Re-arange the site
	tag = searchQuery;
	$('#submit').hide();
	$('#searchTitle').html('<h2>Results for: '+tag+'</h2>');
	$('#goBack').show();
	$('#posts').html('');
	$('#loadingMessage').show();
	$('#submitFAB').hide();

	page = 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
}

function exitSearch() {
	tag = '';
	userID = '';
	$('#submit').show();
	$('#searchTitle').html('');
	$('#goBack').hide();
	$('#loadingMessage').show();
	$('#submitFAB').show();

	$('#posts').html('');
	page = 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
}

function loadUserPage(id) {
	tag = ''
	userID = id.split("/")[0];
	$('#submit').hide();
	$('#searchTitle').html('<h2>Viewing posts from <img src="http://robohash.org/'+userID+'.png?set=set3&size=64x64"/></h2>');
	$('#goBack').show();
	$('#posts').html('');
	$('#loadingMessage').show();
	$('#submitFAB').hide();

	ws.emit('get total score', JSON.stringify({
		id: userID
	}));

	page = 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
}

function loadMore() {
	$('#loadingMessage').show();
	page += 1;
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		reverse: true,
		user: userID
	}));
}

$(document).ready(function() {
	$('#submit').popup({
		transition: 'all 0.3s'
	});

	$('#submitComment').popup({
		transition: 'all 0.3s'
	});

	$('#closeSubmitPopup').click(function() {
		$('#submit').popup('hide');
	});

	$('#closeCommentPopup').click(function() {
		$('#submitComment').popup('hide');
	});

	$('.submit_open').html('WRITE A POST about '+topics[Math.floor(Math.random() * topics.length)]);
});

function refresh(nsfw) {
	if (nsfw === 0 || nsfw === 1){
		showNSFW = nsfw;
		store.set('showNSFW', nsfw)
	}
	page = 1;
	$('#posts').html('');
	$('#loadingMessage').show();
	ws.emit('get posts', JSON.stringify({
		size: '64x64',
		search: tag,
		startingPost: page*50-50,
		loadBottom: true,
		user: userID,
		reverse: true
	}));
	nsfwToggle();
}

window.setInterval(function(){
	//Put a topic in the write a post button every 2 seconds
	$('.submit_open').html('WRITE A POST about '+topics[Math.floor(Math.random() * topics.length)]);
}, 2000);
