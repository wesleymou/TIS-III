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
	name varchar(256) NOT NULL,
	description varchar(512) NULL,
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

-- Cria tabela de usuários
CREATE TABLE user (
	id int NOT NULL AUTO_INCREMENT,
	login varchar(100) NOT NULL,
	password varchar(256) NOT NULL,
	CONSTRAINT user_PK PRIMARY KEY (id)
);

-- Cria tabela de vendas
CREATE TABLE sale (
	id int NOT NULL AUTO_INCREMENT,
	customer_id INT NOT NULL,
	user_id INT NOT NULL,
	total_price DECIMAL(13,2),
	discount DECIMAL NULL,
	date_created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	date_updated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	sale_status INT NOT NULL,
	CONSTRAINT sale_PK PRIMARY KEY (id),
	CONSTRAINT sale_user_FK FOREIGN KEY (user_id) REFERENCES `user`(id),
	CONSTRAINT sale_customer_FK FOREIGN KEY (customer_id) REFERENCES customer(id)
);

-- Cria tabela de itens da venda
CREATE TABLE sale_item (
	id int NOT NULL AUTO_INCREMENT,
	sku_id int NOT NULL,
	sale_id int NOT NULL,
	name varchar(256) NOT NULL,
	description varchar(512) NULL,
	date_expires DATETIME NULL,
	quantity int NOT NULL,
	price decimal(13,2) NOT NULL,
	price_sold decimal(13,2) NOT NULL, 
	CONSTRAINT sale_item_PK PRIMARY KEY (id),
	CONSTRAINT sale_item_sku_FK FOREIGN KEY (sku_id) REFERENCES sku(id),
	CONSTRAINT sale_item_sale_FK FOREIGN KEY (sale_id) REFERENCES sale(id) ON DELETE CASCADE
);
