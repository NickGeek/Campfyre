-- phpMyAdmin SQL Dump
-- version 3.5.8.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 08, 2014 at 09:05 PM
-- Server version: 5.5.37-log
-- PHP Version: 5.4.23

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `etherals_campfyre`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(45) NOT NULL DEFAULT 'admin',
  `comment` varchar(500) NOT NULL,
  `parent` int(11) NOT NULL,
  `time` int(10) NOT NULL DEFAULT '1402740490',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=164 ;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `ip`, `comment`, `parent`, `time`) VALUES
(2, '210.55.212.155', 'Please keep all electronic devices on for the duration of this flight.', 1, 1402740490),
(3, 'admin', 'Haha', 1, 1402740490),
(5, '210.55.212.213', 'Good. You?', 5, 1402740490),
(6, '210.55.212.225', 'Really? What''s so complex about it?', 4, 1402740490),
(7, '66.249.80.187', 'You''re with TelstraClear in Wellington. You''re not Chris Sole (you''re not forwarding port 80) so I''m going to guess you are Rhys. ', 6, 1402740490),
(8, '66.249.80.187', 'Hi', 7, 1402740490),
(9, '66.249.80.187', 'Get out the cake!', 9, 1402740490),
(10, '210.54.118.253', 'No! The cake is a lie!', 9, 1402740490),
(11, '66.249.80.187', 'Haha', 9, 1402740490),
(12, '66.249.80.187', 'Ok', 12, 1402740490),
(13, 'admin', 'Thanks', 13, 1402740490),
(14, 'admin', 'All fixed!', 12, 1402740490),
(15, '210.55.212.253', 'Just finished Rivenspire''s main quest!', 15, 1402740490),
(16, '117.18.80.21', 'Dammit Rhys', 17, 1402740490),
(17, '117.18.80.21', 'Such game\r\nSo MMO', 17, 1402740490),
(18, '117.18.80.21', 'What an insightful post.', 19, 1402740490),
(19, '66.249.80.187', 'I''ll also clear up the show comments button.', 21, 1402740490),
(20, '210.55.212.183', 'I''m working on it! Be patient.', 23, 1402740490),
(21, 'admin', 'Fixed!', 23, 1402740490),
(23, '125.238.214.142', 'It sure is!', 29, 1402740490),
(24, '125.238.214.142', 'That''s a shame!', 30, 1402740490),
(47, '117.18.80.21', 'Yoyo', 35, 1402740490),
(50, '31.172.30.4', 'Should blatant censorship by Admin be allowed on Campfyre?', 38, 1402740490),
(46, '125.238.214.142', 'swag', 35, 1402740490),
(44, '117.18.80.21', 'Cool story bro', 32, 1402740490),
(45, '117.18.80.21', 'No bloody idea', 33, 1402740490),
(43, '125.238.214.142', 'Okay. Let''s\r\n\r\nsee\r\nhow this\r\n\r\n\r\n\r\nworks', 30, 1402740490),
(42, '125.238.214.142', 'ARGH!\r\n\r\nWHY CAN''T THINGS JUST WORK?!\r\nikr', 30, 1402740490),
(41, '125.238.214.142', 'Okay\r\nfinal\r\n\r\ntest', 30, 1402740490),
(40, '125.238.214.142', 'ARGH! WHY ARE NEW LINES DIFFERENT ON WINDOWS :-!', 30, 1402740490),
(39, '125.238.214.142', 'Fancy\r\npants\r\n\r\nstuff', 30, 1402740490),
(49, 'admin', 'Also should Tor IPs be allowed?', 38, 1402740490),
(51, '171.25.193.131', 'No comments?  Come on, what''d y''all think of Tim Minchin?', 37, 1402740490),
(52, '117.18.80.21', 'Haha. I love Tor users.', 39, 1402740490),
(53, '117.18.80.21', 'Haha. Posting pornography is against the rules. If you wanna do that use 4chan.', 38, 1402740490),
(54, '66.249.80.187', 'It was pretty average to be honest.', 37, 1402740490),
(55, '62.210.206.25', 'I''m afraid that''s actually very offensive.  66.249.80.187, I''m afraid I''m just going to have to hunt you down and kill you. ', 37, 1402740490),
(56, '62.210.206.25', 'Fuck, it would seem I just pitted myself against Google, you poxying little anonymous **** (that better, Admin?)', 37, 1402740490),
(57, '62.210.206.25', 'Maybe I''m at Wellington College with you?', 40, 1402740490),
(58, '62.210.206.25', 'Luckily I''m not because that would make everything far too boring.  Challenge - how did I find out you got to Wellington College?', 40, 1402740490),
(59, '74.120.13.132', 'Part 2, mingers - http://imgur.com/a/B9wqU', 41, 1402740490),
(60, '74.120.13.132', 'Challenge 2 - Where in the world am I?', 40, 1402740490),
(61, '188.226.150.19', 'In other news I scrolled down the site and now fully comprehend why you love me so much.  Y''all some boring mingers, arentcha?', 40, 1402740490),
(62, '77.247.181.164', 'As you should.  ', 39, 1402740490),
(63, '125.238.214.142', 'Yup. I doubt I know you because of what you post (I''m not friends with any over-preachy atheists). You are also using the Tor network, I don''t have the ability to track you.', 40, 1402740490),
(64, '66.249.80.187', 'I love those kinds of threads.', 41, 1402740490),
(65, '66.249.80.187', 'We''ve got no idea what you''re listing about.', 46, 1402740490),
(66, '109.163.234.8', 'Game of Thrones....  You guys don''t watch Game of Thrones?  How is that even possible?!  I know for a fact that it''s huge even in NZ!  Thrones is like the best TV show ever made!', 47, 1402740490),
(67, '109.163.234.8', 'Admin you might wanna delete the spoiler comments if you guys haven''t seen it....  Go watch and you''ll begin to be able to comprehend the cultural phenomenon that is the Game of Thrones...', 47, 1402740490),
(68, '109.163.234.8', 'Not even talking about that, it''s the lack of comments on the other inflammatory stuff like the religion link.    Only one comment on IT guy thread?  That thing is the funniest thing I''ve seen in months!  Come on now, gotta come to the party.  ', 46, 1402740490),
(69, '109.163.234.8', 'How many of you are there on this site anyway?', 46, 1402740490),
(70, '66.249.80.187', 'There''s only like 6 of us and we don''t really care about trolling.', 46, 1402740490),
(71, '66.249.80.187', 'I started watching the first episode, got bored and gave up. Doctor Who is real TV!', 47, 1402740490),
(72, 'admin', 'Done! I''ve just cleaned up a few of your posts for you.', 47, 1402740490),
(73, '77.109.139.26', 'ahahaha very funny', 44, 1402740490),
(74, '77.109.139.26', 'Thanks for taking down the ones I said you should but what was wrong with that Oatmeal comic??!!  If you''ve got a problem with it at least have the debate!', 48, 1402740490),
(75, '210.55.212.206', 'Feel free to post that comic again. It was a mistake on my behalf (I misread your comment).', 48, 1402740490),
(76, '117.18.80.21', 'Not really', 49, 1402740490),
(77, '117.18.80.21', '&#3232;_&#3232;', 51, 1402740490),
(78, '117.18.80.21', '( &#65439;&#1076;&#65439;)(^&#12512;^)(&#12539;&#12408;&#12539;)\r\n', 51, 1402740490),
(79, '117.18.80.21', '( ´&#1044;&#65344;)=3', 51, 1402740490),
(80, '117.18.80.21', 'Omg wtf is this...', 52, 1402740490),
(81, '117.18.80.21', '~YOLOSWAG', 55, 1402740490),
(82, '66.249.80.187', 'I can''t say how much I hate this post.', 57, 1402740490),
(83, '117.18.80.21', 'Fuck off max', 57, 1402740490),
(84, 'admin', 'Couldn''t agree more.', 58, 1402740490),
(85, '117.18.80.21', 'Because the hashtag is sooooo overated and it needs to go.  So ~ShutTheFuckUp', 58, 1402740490),
(86, '85.24.215.117', 'You are aware that you aren''t getting rid of the hashtag, right?  You''re seemingly keeping absolutely everything about the concept and phenomenon, just replacing the character with a new, uglier one that no on recognizes', 58, 1402740490),
(87, '210.55.212.233', 'What?!', 61, 1402740490),
(88, '121.98.84.58', 'Hellwo back to you. XD', 70, 1402740490),
(89, '80.195.3.184', 'XD Hellwo!!! ', 70, 1402740490),
(90, '210.55.212.147', 'Except for Campfyre because it''s amazing.', 68, 1402740490),
(91, '203.97.98.197', 'Except I wasn''t that anonymous because you can see my IP.', 74, 1402740490),
(92, '125.238.214.142', 'Cool story bro.', 74, 1402740490),
(93, '125.238.214.142', 'http://sharepic.tk/i/Capture%20%281%29.PNG', 74, 1402740490),
(94, '117.18.80.21', 'LOL that wasn''t where I live.', 74, 1402740490),
(95, '122.56.205.98', 'Yeah. IP addresses aren''t that accurate.', 74, 1402740490),
(96, '188.138.9.49', 'If you get this one immediately there''s probably something wrong with you.  This won absolutely takes the cake for being the most disturbing joke I''ve ever read and took me (with my extensive knowledge of offensive jokes) a whole half minute to get.  ', 78, 1402740490),
(97, '188.138.9.49', 'Admin I know these somewhat skirt the SWF rule I think you should please leave them up for their sheer entertainment value and literary calibre.  Thanks!  :)', 78, 1402740490),
(98, '68.169.35.103', 'Classy rebellion guys.  You could totally give ISIS a run for their money up until yesterday when they went conquering Mosul.  ', 71, 1402740490),
(99, '68.169.35.103', '(If you don''t understand this reference I''m deeply disturbed by your collective lack of knowledge of global events, a terrifyingly all too common state of even those of us who live on the internet)', 71, 1402740490),
(100, '68.169.35.103', 'ahahahaha if y''all find this shit offensive you''re gonna love what I just posted up top hehe', 69, 1402740490),
(101, '68.169.35.103', 'Ooooh robot.  You show pictures?  Pictures or bullshit', 65, 1402740490),
(102, '68.169.35.103', 'Shit, sorry bro.  Low res screen, shitty processor, shitty design - please don''t think all Windows 8 devices look and run like that one.  Microsoft are doing some great stuff still', 73, 1402740490),
(103, '68.169.35.103', 'Yo yo yo ma beeeeeitch', 72, 1402740490),
(104, '68.169.35.103', 'Yeah Campfyre ftw.  It''d be nice if it could restore my position on the page after posting a comment though.  That''d make the experience quite a lot nicer, admin if you would.  Especially as the page gets bigger.  Thanks!', 68, 1402740490),
(105, '68.169.35.103', 'No, no, no.  I am anonymous.  You left your IP out for everyone to see.  Didn''t even need to pull out my fancy script that lets me send you a link to easily get hold of your IP to find you mate.  Sitting bloody duck to be honest.  ', 74, 1402740490),
(106, '68.169.35.103', 'I like that they copied enough of Android to make it slightly more bearable, most notably the app interaction stuff that there was surprisingly little pickup in the tech media about', 64, 1402740490),
(107, '212.83.187.52', 'Ken Ham''s little article here is really quite interesting because it logically and correctly rips apart the logic of the measured, modern Christian.  https://answersingenesis.org/who-is-god/god-is-good/the-god-of-an-old-earth/', 80, 1402740490),
(108, '125.238.214.142', 'http://sharepic.tk/i/IMG_20140526_133400.jpg', 65, 1402740490),
(109, '125.238.214.142', 'Screen looks fine and it''s running games and MS Office without a problem.', 73, 1402740490),
(110, 'admin', 'Sorry mate. I''m currently working on a feature you might like though.', 78, 1402740490),
(111, '125.238.214.142', 'First time I''ve ever heard the word. Sounds a bit like "goon".', 69, 1402740490),
(112, 'admin', '@68.169.35.103 Working on it. Also now by default only the 50 latest posts will be loaded (if you want to there is a load all button at the bottom).', 68, 1402740490),
(113, '125.238.214.142', 'Yes. I might add #tags.', 81, 1402740490),
(114, '125.238.214.142', 'I don''t want to have a debate but in reply to the article I would like to point out that being a Christian isn''t about logic or rules. It''s about a relationship.', 80, 1402740490),
(115, 'admin', 'Okay. I give in. You can have your damn #hashtags. #rebellion', 71, 1402740490),
(116, '125.238.214.142', 'You happy now?', 65, 1402740490),
(117, '125.238.214.142', 'I see someone''s #happy.', 90, 1402740490),
(118, '192.240.96.44', 'Logical justification is important.  Of course it is about logic.  If there could be no logical justification then why wouldn''t you go be a Hindu, a Muslim or a Mormon?', 80, 1402740490),
(119, '192.240.96.44', 'Given that we know that Ken Ham''s position is total bullshit (you''d have to debunk everything on http://rationalwiki.org/wiki/Evidence_against_a_recent_creation and then some, including rejecting the basic principles on which all of science is grounded)...', 80, 1402740490),
(120, '192.240.96.44', '…this might be a pretty interesting place to begin from in reconsidering exactly how you manage to justify the reconciliation of your ancient religious rubbish with all that we now know about the world.  ', 80, 1402740490),
(121, '192.240.96.44', 'Once you start reading and thinking you might be surprised at the conclusions that you come to.  ', 80, 1402740490),
(122, '192.240.96.44', 'Ooooh me likes.  Thanks admin!', 89, 1402740490),
(123, '192.240.96.44', 'Just because lots of people you know think something is true doesn’t make it true.  Arguing that something is true because someone (even someone incredibly important or intelligent) believes it doesn’t make it so, it’s called an ad hominem fallacy.', 80, 1402740490),
(124, '192.240.96.44', 'I can''t believe that I requested something one day and it actually changed the next day, that''s just fucking incredible tbh', 89, 1402740490),
(125, '192.240.96.44', 'There are a multitude of incredibly intelligent people on both sides of this debate, either way you’re disagreeing with a whole bunch of geniuses.  ', 80, 1402740490),
(126, '192.240.96.44', 'If you’re interested (and you should be!), a good place to start might actually be a Christopher Hitchens debate – try https://www.youtube.com/watch?v=mMraxhd9Z9Q or go searching around for one of your own.  Hitchens is totally incredible, you’ll love him.', 80, 1402740490),
(127, '125.238.214.142', 'Okay. Suit yourself.', 80, 1402740490),
(128, '192.240.96.44', 'After that, interesting debates/talks about this stuff and related ideas include https://www.youtube.com/watch?v=9RExQFZzHXQ and https://www.youtube.com/watch?v=Domm1mvTEh0', 80, 1402740490),
(129, '125.238.214.142', 'I''ll have a look', 80, 1402740490),
(130, '192.240.96.44', 'Booooooooooooooo', 78, 1402740490),
(131, '192.240.96.44', 'I get where you''re coming from though.  Somewhat disturbed that slavery jokes are OK but blowjobs cross the line but I suppose you had to make a call.  I take it your problem is the sexual content more than anything?  I''ll make sure I keep to...', 78, 1402740490),
(132, 'admin', 'Thanks. It was such a minor code change (two lines) to implement your request that I thought I might as well do it.', 89, 1402740490),
(133, '192.240.96.44', '...viciously racist content for next time if that''s what you prefer.  ', 78, 1402740490),
(134, '5.104.224.195', 'I would however like to note a great quote from Geogre RR Martin, not totally what this is about but pretty much on the money about the offensiveness of sexual content (I concede that my jokes were pretty bad and you were totally within your rights to...', 78, 1402740490),
(135, '5.104.224.195', '..take them down, this is more of a related thought, not arguing that decision).  Anyway, what he said was "I can describe an axe entering a human skull in great explicit detail and no one will blink twice at it. I provide a similar description, just as...', 78, 1402740490),
(136, '5.104.224.195', '...detailed, of a penis entering a vagina, and I get letters about it and people swearing off. To my mind this is kind of frustrating, it''s madness. Ultimately, in the history of [the] world, penises entering vaginas have given a lot of people a lot of...', 78, 1402740490),
(137, '5.104.224.195', 'pleasure. Axes entering skulls, well, not so much."', 78, 1402740490),
(138, '5.104.224.195', 'Good on you mate, that''s cool.  Tell me more about this new moderation system though, is it gonna be good or bad for me?  ', 89, 1402740490),
(139, '5.104.224.195', ':)', 80, 1402740490),
(140, 'admin', 'Good. It detects NSFW stuff (and allows me to manually do it) and then allows people to pick whether they want to see it or not.', 89, 1402740490),
(141, '5.104.224.5', 'So stuff won''t have to be deleted outright?  Perf', 89, 1402740490),
(142, 'admin', 'Correct', 89, 1402740490),
(143, '125.238.214.142', 'Same thing with comments', 98, 1402742869),
(144, '125.238.214.142', 'lol', 103, 1402948574),
(145, '117.18.80.21', 'I AM THE DANGER! #heisenberg', 104, 1403061246),
(146, '122.56.234.98', 'Shut the fuck up', 104, 1403061555),
(147, '117.18.80.21', '&#12375;&#12378;&#12363;&#12395;&#65281;', 107, 1403219466),
(148, '82.94.251.227', '*knocks.  Walt''s not Asian.  ', 105, 1403316668),
(149, '210.55.212.132', 'Fancy! Can you comment from this script as well?', 113, 1403846887),
(150, '210.55.212.183', 'Booted! It wouldn''t let me keep any data though.', 114, 1403847231),
(151, '210.55.212.225', 'Also, would you mojd sharing the source code?', 113, 1403865720),
(152, '210.55.212.80', '*mind', 113, 1403865765),
(153, 'admin', 'Thanks Jamie and Toby.', 1237, 1403935605),
(154, '210.55.212.131', 'Don''t use MD5 for your encryption by the way "lol!" Security inc.', 1237, 1403990433),
(155, '121.73.150.105', 'The MD5 isn''t "encryption", it was a puzzle.', 1237, 1404006584),
(156, '117.18.80.21', 'A pretty crap puzzle', 1237, 1404016170),
(157, '117.18.80.21', 'No', 1239, 1404175704),
(158, '117.18.80.21', 'How is that offensive???', 1241, 1404350367),
(159, '117.18.80.21', 'Damn it! Why won''t these work? #revolution\r\n', 1242, 1404350746),
(160, 'admin', 'You can''t use any symbols or numbers in hashtags.', 1242, 1404521908),
(161, 'admin', 'BOOM! And just like that, #campfyre makes links clickable.', 1259, 1404632876),
(162, '131.203.254.70', 'Why not xamarin?', 1260, 1404866937);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
