CREATE DATABASE IF NOT EXISTS db;
USE db;

CREATE TABLE IF NOT EXISTS People (
	Id INT NOT NULL AUTO_INCREMENT,
	UserName VARCHAR(255) NOT NULL,
	FirstName VARCHAR(255) NOT NULL,
	LastName VARCHAR(255) NOT NULL,
	Email VARCHAR(255) NOT NULL,
	PasswordHash VARCHAR(1024) NOT NULL,
	PasswordSalt VARCHAR(255) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS Employees (
	Id INT NOT NULL,
	Title VARCHAR(255) NOT NULL,
	HireDate DATE NOT NULL,
	PRIMARY KEY (Id),
	FOREIGN KEY (Id)
		REFERENCES People (Id)
		ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS Addresses (
	Id INT NOT NULL AUTO_INCREMENT,
	Street VARCHAR(255) NOT NULL,
	City VARCHAR(255) NOT NULL,
	State VARCHAR(255) NOT NULL,
	Country VARCHAR(255) NOT NULL,
	ZipCode VARCHAR(255) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS PersonAddressMap (
	PersonId INT NOT NULL,
	AddressId INT NOT NULL,
	Type VARCHAR(255) NOT NULL,
	PRIMARY KEY (PersonId, AddressId),
	FOREIGN KEY (PersonId) 
		REFERENCES People(Id)
		ON DELETE CASCADE,
	FOREIGN KEY (AddressId) 
		REFERENCES Addresses(Id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Claims (
	Type VARCHAR(255) NOT NULL,
	Value VARCHAR(255) NOT NULL,
	PersonId INT NOT NULL,
	PRIMARY KEY (Type, Value, PersonId),
	FOREIGN KEY (PersonId)
		REFERENCES People (Id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Semester (
	Id INT NOT NULL AUTO_INCREMENT,
	StartDate DATE NOT NULL,
	EndDate DATE NOT NULL,
	RegistrationDate DATE NOT NULL
)

CREATE TABLE IF NOT EXISTS Application (
	Id INT NOT NULL AUTO_INCREMENT,
	PersonId INT NOT NULL,
	SemeterId INT NOT NULL,
	Detail TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS ApplicationDecision {
	ApplicationId VARCHAR(255) NOT NULL,
	Decision BOOLEAN NOT NULL,
	MakerId VARCHAR(255) NOT NULL,
	PRIMARY KEY (ApplicationId),
	FOREIGN KEY (ApplicationId)
		REFERENCES Application (Id)
		ON DELETE CASCADE
	FOREIGN KEY (MakerId)
		REFERENCES Employee (Id)
		ON DELETE SET NULL
}