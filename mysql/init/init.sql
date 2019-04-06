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
	TitleName VARCHAR(255) NOT NULL,
	HireDate DATE NOT NULL,
	PRIMARY KEY (Id),
	FOREIGN KEY (Id)
		REFERENCES People (Id)
		ON DELETE CASCADE
	FOREIGN KEY (TitleName)
		REFERENCES Titles (Name)
		ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Titles (
	Name VARCHAR(255) NOT NULL,
	PRIMARY KEY (Name)
)

CREATE TABLE IF NOT EXISTS Permissions (
	Name VARCHAR(255) NOT NULL,
	PRIMARY KEY (Name)
)

CREATE TABLE IF NOT EXISTS TitlePermissionMap (
	TitleName VARCHAR(255) NOT NULL,
	PermissionName VARCHAR(255) NOT NULL,
	FOREIGN KEY (TitleName)
		REFERENCES Titles (Name)
		ON DELETE CASCADE
	FOREIGN KEY (PermissionName)
		REFERENCES Permissions (Name)
		ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS JobListing (
	Id INT NOT NULL AUTO_INCREMENT,
	TitleName VARCHAR(255) NOT NULL,
	Description VARCHAR(255) NOT NULL,
	PRIMARY KEY (Id),
	FOREIGN KEY (TitleName)
		REFERENCES Titles (Name)
		ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS JobApplicationDecision (
	JobApplicationId INT NOT NULL,
	Decision BOOLEAN NOT NULL,
	DeciderId INT,
	Time DATE NOT NULL,
	PRIMARY KEY (JobApplicationId),
	FOREIGN KEY (JobApplicationId)
		REFERENCES JobApplications (Id)
		ON DELETE CASCADE,
	FOREIGN KEY (DeciderId)
		REFERENCES Employees (Id)
		ON DELETE SET NULL
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

CREATE TABLE IF NOT EXISTS Semesters (
	Id INT NOT NULL AUTO_INCREMENT,
	StartDate DATE NOT NULL,
	EndDate DATE NOT NULL,
	RegistrationStartDate DATE NOT NULL,
	RegistrationEndDate DATE NOT NULL,
	ApplicationStartDate DATE NOT NULL,
	ApplicationEndDate DATE NOT NULL,
	Name VARCHAR(255) NOT NULL,
	PRIMARY KEY (Id)
);

CREATE TABLE IF NOT EXISTS Applications (
	Id INT NOT NULL AUTO_INCREMENT,
	PersonId INT NOT NULL,
	SemesterId INT NOT NULL,
	Detail TEXT NOT NULL,
	IsDraft BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (Id),
	FOREIGN KEY (SemesterId)
		REFERENCES Semesters (Id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ApplicationDecisions (
	ApplicationId INT NOT NULL,
	Decision BOOLEAN NOT NULL,
	DeciderId INT,
	PRIMARY KEY (ApplicationId),
	FOREIGN KEY (ApplicationId)
		REFERENCES Applications (Id)
		ON DELETE CASCADE,
	FOREIGN KEY (DeciderId)
		REFERENCES Employees (Id)
		ON DELETE SET NULL
);