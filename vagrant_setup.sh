apt-get update
export DEBIAN_FRONTEND=noninteractive
MARIA_PASS=`< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c${1:-64}`
sudo debconf-set-selections <<< "mariadb-server-5.5 mysql-server/root_password password $MARIA_PASS"
sudo debconf-set-selections <<< "mariadb-server-5.5 mysql-server/root_password_again password $MARIA_PASS"
apt-get install -y apache2 php5 libapache2-mod-php5 mariadb-server-5.5 mariadb-client-5.5 php5-mysql
rm -rf /var/www
mkdir /var/www
ln -fs /vagrant/web /var/www/html
mkdir /home/nick
cat <<EOPASS >> /home/nick/passwords.php
<?php
\$CAMPFYRE_NOTIFY_EMAIL = 'abc';
\$CAMPFYRE_DISABLE_EMAIL = true;
?>
EOPASS
cat <<EOT >> /home/nick/mysqlDetails.php
<?php
\$MYSQL_USERNAME = 'root';
\$MYSQL_PASSWORD = '$MARIA_PASS';
?>
EOT

cat <<'EOSQL' | mysql -uroot -p`echo $MARIA_PASS`
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
CREATE DATABASE campfyre;
USE campfyre;
CREATE TABLE IF NOT EXISTS `comments` (
`id` int(11) NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `comment` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent` int(11) NOT NULL,
  `time` int(10) NOT NULL DEFAULT '1402740490'
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=976 ;
INSERT INTO `comments` (`id`, `ip`, `comment`, `parent`, `time`) VALUES
(1, '210.55.212.160', 'That''s a shame.', 93, 1404879462),
(570, '202.78.142.167', 'What''s the plural of anonymous? Anonymees?', 367, 1410428625);
CREATE TABLE IF NOT EXISTS `posts` (
`id` int(11) NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `post` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emails` mediumtext COLLATE utf8mb4_unicode_ci COMMENT 'csv of e-mails to notify',
  `nsfw` int(1) NOT NULL DEFAULT '0' COMMENT '1 is NSFW, 0 is SFW',
  `time` int(10) NOT NULL DEFAULT '0',
  `attachment` varchar(600) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'n/a' COMMENT 'JSON of attachment',
  `score` int(11) DEFAULT '0',
  `voters` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=599 ;
INSERT INTO `posts` (`id`, `ip`, `post`, `emails`, `nsfw`, `time`, `attachment`, `score`, `voters`) VALUES
(1, 'admin', 'This is your admin speaking. Prepare for takeoff.', NULL, 0, 1402740490, 'n/a', 3, '125.238.214.142,100.43.81.142,210.86.93.238'),
(93, 'admin', 'Oops. This is a bit embarrassing. After modifying the database for the Android app the comments have become out of order. Every single comment has been deleted (sorry). However you can download all the deleted comments here: http://campfyre.org/comments.sql', 'n60storm4@gmail.com', 0, 1404875439, 'n/a', 2, '100.43.81.142,180.76.5.28'),
(367, '186.32.99.192', 'Just wondering... Is there any girl in here? ', NULL, 0, 1410417345, 'n/a', 7, '203.97.98.197,180.76.5.143,104.131.208.15,157.55.39.187,100.43.81.142,162.243.83.240,157.55.39.132'),
(596, 'admin', 'アジュミッヌ　#bonfyre', NULL, 0, 0, 'n/a', 0, NULL);
ALTER TABLE `comments`
 ADD PRIMARY KEY (`id`);
ALTER TABLE `posts`
 ADD PRIMARY KEY (`id`), ADD FULLTEXT KEY `post` (`post`), ADD FULLTEXT KEY `post_2` (`post`);
ALTER TABLE `comments`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=976;
ALTER TABLE `posts`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=599;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
EOSQL

echo "MARIA PASS: $MARIA_PASS"
