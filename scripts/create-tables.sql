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

-- Cria tabela de unidade de estoque
CREATE TABLE sku (
	id int NULL AUTO_INCREMENT,
	product_id INT NOT NULL,
	name varchar(256) NULL,
	description varchar(512) NOT NULL,
	date_expires DATETIME NULL,
	date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	quantity_purchased int NOT NULL,
	quantity_available int NOT NULL,
	price decimal(13,2) NOT NULL,
	CONSTRAINT sku_PK PRIMARY KEY (id),
	CONSTRAINT sku_product_FK FOREIGN KEY (product_id) REFERENCES product(id)
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
