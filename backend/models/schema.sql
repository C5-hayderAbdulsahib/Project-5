DROP DATABASE meraki_academy_project_5;

CREATE DATABASE meraki_academy_project_5;

USE meraki_academy_project_5;

CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    role VARCHAR(255) NOT NULL UNIQUE,
    is_deleted TINYINT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT NOT NULL,
    permission VARCHAR(255) NOT NULL,
    is_deleted TINYINT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE roles_permissions (
    id INT NOT NULL AUTO_INCREMENT NOT NULL,
    role_id INT,
    permission_id INT,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (permission_id) REFERENCES permissions (id),
    PRIMARY KEY (id)
);

CREATE TABLE users(
    id INT AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    profile_image VARCHAR(255),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    is_deleted TINYINT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE categories(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_deleted TINYINT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE rooms(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255),
    room_image VARCHAR(255),
    is_group BOOLEAN DEFAULT false,
    is_deleted TINYINT DEFAULT 0,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES users (id),
    PRIMARY KEY (id)
);

CREATE TABLE users_rooms (
    id INT NOT NULL AUTO_INCREMENT NOT NULL,
    room_id INT,
    user_id INT,
    FOREIGN KEY (room_id) REFERENCES rooms (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    is_deleted TINYINT DEFAULT 0,
    is_blocked BOOLEAN DEFAULT false,
    send_follow_request BOOLEAN DEFAULT false,
    is_member BOOLEAN DEFAULT false,
    user_username VARCHAR(255),
    user_profile_img VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE messages(
    id INT AUTO_INCREMENT NOT NULL,
    description VARCHAR(255),
    message_image  VARCHAR(7500),
    document VARCHAR(7500),
    document_name VARCHAR(1000),
    is_deleted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    room_id INT,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (id)
);


INSERT INTO roles (role) VALUES ('SUPERADMIN');
INSERT INTO roles (role) VALUES ('ADMIN');
INSERT INTO roles (role) VALUES ('USER');

INSERT INTO permissions (permission) VALUES ("CREATE_CATEGORIES");
INSERT INTO permissions (permission) VALUES ("UPDATE_CATEGORIES");
INSERT INTO permissions (permission) VALUES ("DELETE_CATEGORIES");
INSERT INTO permissions (permission) VALUES ("UPDATE_ROOMS");
INSERT INTO permissions (permission) VALUES ("DELETE_ROOMS");
INSERT INTO permissions (permission) VALUES ("DELETE_ROOMS_ADMIN");


INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 1);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 2);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 3);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 4);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 5);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 6);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (2, 4);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (2, 5);

INSERT INTO users (email, password, username, first_name, last_name, country, profile_image ,role_id) VALUES ('superadmin@me.com', '$2b$10$uZYvsP7unqt2/fY37RixnenZqgFEC80uptiIFXecWFf6FmXEY/OaS', 'hayder', 'hayder', 'hayder', 'jordan', "https://i.ytimg.com/vi/ha0-qytMD9k/maxresdefault.jpg" , 1);
INSERT INTO users (email, password, username, first_name, last_name, country, profile_image ,role_id) VALUES ('admin@me.com', '$2b$10$uZYvsP7unqt2/fY37RixnenZqgFEC80uptiIFXecWFf6FmXEY/OaS', 'mosa', 'mosa s', 'hayder', 'jordan', "https://i.ytimg.com/vi/ha0-qytMD9k/maxresdefault.jpg" , 2);
INSERT INTO users (email, password, username, first_name, last_name, country, profile_image ,role_id) VALUES ('user@me.com', '$2b$10$uZYvsP7unqt2/fY37RixnenZqgFEC80uptiIFXecWFf6FmXEY/OaS', 'mustafa', 'mustafa h', 'hayder', 'jordan', "https://i.ytimg.com/vi/ha0-qytMD9k/maxresdefault.jpg" , 3);
INSERT INTO users (email, password, username, first_name, last_name, country, profile_image ,role_id) VALUES ('mosa@me.com', '$2b$10$uZYvsP7unqt2/fY37RixnenZqgFEC80uptiIFXecWFf6FmXEY/OaS', 'mosa saleh', 'mo s', 'hayder', 'jordan', "https://i.ytimg.com/vi/ha0-qytMD9k/maxresdefault.jpg" , 3);
INSERT INTO users (email, password, username, first_name, last_name, country, profile_image ,role_id) VALUES ('mustafa@me.com', '$2b$10$uZYvsP7unqt2/fY37RixnenZqgFEC80uptiIFXecWFf6FmXEY/OaS', 'mustafa hamdan', 'mus a', 'hayder', 'jordan', "https://i.ytimg.com/vi/ha0-qytMD9k/maxresdefault.jpg" , 3);


INSERT INTO categories (name) VALUES ('developers');
INSERT INTO categories (name) VALUES ('anime fans');
INSERT INTO categories (name) VALUES ('gamers');

INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('pirates', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",1, 1, 1);
INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('one piece fans', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",2, 1, 1);
INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('DBZ fans', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",2, 2, 1);
INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('attack on titans fans', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",2, 1, 1);
INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('call of duties fans', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",3, 1, 1);
INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('devil may cry fans', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",3, 1, 1);
INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('react developer', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",1, 2, 1);
INSERT INTO rooms (name, room_image, category_id, admin_id, is_group) VALUES ('javascript developer', "https://i.pinimg.com/originals/5a/7e/be/5a7ebe0b0ba89c07e683f30fd0761f16.jpg",1, 2, 1);
INSERT INTO rooms (is_group) VALUES (0);
INSERT INTO rooms (is_group) VALUES (0);


INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (1, 1, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (2, 1, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (3, 1, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (4, 1, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (5, 1, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (6, 1, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (1, 2, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (1, 3, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (5, 4, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (5, 2, 1);
INSERT INTO users_rooms (room_id, user_id, is_member) VALUES (4, 2, 1);
INSERT INTO users_rooms (room_id, user_id, user_username, user_profile_img, is_member) VALUES (9, 1, "hayder", "hayder image", 1);
INSERT INTO users_rooms (room_id, user_id, user_username, user_profile_img, is_member) VALUES (9, 4, "mosa s", "mosa image", 1);
INSERT INTO users_rooms (room_id, user_id, user_username, user_profile_img, is_member) VALUES (10, 1, "hayder", "hayder image", 1);
INSERT INTO users_rooms (room_id, user_id, user_username, user_profile_img, is_member) VALUES (10, 5, 'mustafa a', "mustafa image", 1);



INSERT INTO messages (description, room_id, user_id) VALUES ('hello', 1, 1);
INSERT INTO messages (description, room_id, user_id) VALUES ('have you seen the new movie', 1, 2);
INSERT INTO messages (description, room_id, user_id) VALUES ('no i have not', 1, 1);
INSERT INTO messages (description, room_id, user_id) VALUES ('you should', 1, 2);
