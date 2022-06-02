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

CREATE TABLE role_permission (
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
    is_blocked BOOLEAN DEFAULT false,
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
    name VARCHAR(255) NOT NULL,
    room_image VARCHAR(255),
    is_group BOOLEAN DEFAULT false,
    is_deleted TINYINT DEFAULT 0,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    PRIMARY KEY (id)
);

