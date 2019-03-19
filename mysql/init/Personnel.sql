CREATE DATABASE IF NOT EXISTS db;
USE db;

CREATE TABLE IF NOT EXISTS People (
	Id INT NOT NULL AUTO_INCREMENT,
	UserName VARCHAR(255) NOT NULL,
	Email VARCHAR(255) NOT NULL,
	PasswordHash VARCHAR(1024) NOT NULL,
	PasswordSalt VARCHAR(255) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS Addresses (
	Id INT NOT NULL AUTO_INCREMENT,
	Street VARCHAR(255) NOT NULL,
	City VARCHAR(255) NOT NULL,
	State VARCHAR(255) NOT NULL,
	Country VARCHAR(255) NOT NULL,
	Zipcode VARCHAR(255) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS PersonAddressMap (
	PersonId INT,
	AddressId INT,
	Type VARCHAR(255),
	PRIMARY KEY (PersonId, AddressId),
	FOREIGN KEY (PersonId) REFERENCES People(Id),
	FOREIGN KEY (AddressId) REFERENCES Addresses(Id)
);