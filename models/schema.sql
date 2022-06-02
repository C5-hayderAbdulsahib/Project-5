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
    send_follow_request BOOLEAN DEFAULT true,
    is_member BOOLEAN DEFAULT false,
    PRIMARY KEY (id)
);

CREATE TABLE messages(
    id INT AUTO_INCREMENT NOT NULL,
    description VARCHAR(255) NOT NULL,
    message_image  VARCHAR(255),
    document VARCHAR(255),
    is_deleted TINYINT DEFAULT 0,
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

INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 1);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 2);
INSERT INTO roles_permissions (role_id, permission_id) VALUES (1, 3);

INSERT INTO categories (name) VALUES ('developers');
INSERT INTO categories (name) VALUES ('anime fans');
INSERT INTO categories (name) VALUES ('gamers');

INSERT INTO rooms (name, category_id) VALUES ('pirates', 1);
INSERT INTO rooms (name, category_id) VALUES ('one piece fans', 2);


