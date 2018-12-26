CREATE DATABASE IF NOT EXISTS campfyre DEFAULT CHARSET utf8mb4;
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  ip VARCHAR(64) NOT NULL,
  hash_id VARCHAR(64) NOT NULL,
  post VARCHAR(500) NOT NULL,

  # This will also be its own table in the future
  notifyList MEDIUMTEXT NULL,

  nsfw INT(1) DEFAULT(0) NOT NULL DEFAULT(0),
  time INT NOT NULL,
  attachment VARCHAR(600) NOT NULL DEFAULT('n/a'),
  score INT NOT NULL DEFAULT(0),

  # This is pretty bad and will become it's own table in the future
  voters LONGTEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4 DEFAULT COLLATE = 'utf8mb4_unicode_ci';

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  ip VARCHAR(64) NOT NULL,
  comment VARCHAR(500) NOT NULL,
  parent INT NOT NULL,
  parentComment INT NULL,
  time INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4 DEFAULT COLLATE = 'utf8mb4_unicode_ci';

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  ip VARCHAR(64) NOT NULL,
  commentText VARCHAR(500) NOT NULL,
  postID INT NOT NULL,
  commentID INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET utf8mb4 DEFAULT COLLATE = 'utf8mb4_unicode_ci';
