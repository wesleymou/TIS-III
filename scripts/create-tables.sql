-- Cria tabela de produtos
CREATE TABLE product (
	id INT NULL AUTO_INCREMENT,
	code varchar(100) NULL,
	name varchar(256) NOT NULL,
	description varchar(512) NULL,
	price decimal(13,2) NOT NULL,
	date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	date_expires DATETIME NULL,
	quantity INT NOT NULL,
	CONSTRAINT product_PK PRIMARY KEY (id)
);

-- Cria tabela de clientes
CREATE TABLE customer (
	id INT NOT NULL AUTO_INCREMENT,
	fullname varchar(100) NOT NULL,
	nickname varchar(100) NULL,
	phone varchar(100) NOT NULL,
	email varchar(100) NULL,
	address varchar(256) NULL,
	date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT customer_PK PRIMARY KEY (id)
);
