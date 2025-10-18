INSERT INTO tb_user (login, password, name, cpf, email) VALUES ('auricelio', '$2a$10$55KUj0d/wW2RsqKhqK2BzOZdwa2iyuQzzxDoZ9Mu4FVoqVE7xM4by', 'auricelio freitas', '12345678911', 'auricelio.suporte@hotmail.com');
INSERT INTO tb_user (login, password, name, cpf, email) VALUES ('teste', '$2a$10$55KUj0d/wW2RsqKhqK2BzOZdwa2iyuQzzxDoZ9Mu4FVoqVE7xM4by', 'teste sobrenome', '12345678900', 'teste@hotmail.com');

INSERT INTO tb_role (authority) VALUES ('ROLE_ADMIN');
INSERT INTO tb_role (authority) VALUES ('ROLE_OPERATOR');

INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2);

INSERT INTO tb_supplier (name, contact, cpf, address) VALUES ('Rose', '(85) 98538-0883', '00000000000', 'Rua Osvaldo Cruz, 175, Meireles');
INSERT INTO tb_supplier (name, contact, cpf, address) VALUES ('Elizeu', '(85) 92358-9857', '00000000011', 'Rua Teste, 175, Barra do Ceara');

INSERT INTO tb_sub_product (name, description) VALUES ('Botão', 'Utensilio');
INSERT INTO tb_sub_product (name, description) VALUES ('Uber', 'Viagem');

INSERT INTO tb_product (name, description, has_Sub_Prod, sub_Product_Id) VALUES ('Cropped', 'Modinha', true, 1);
INSERT INTO tb_product (name, description, has_Sub_Prod, sub_Product_Id) VALUES ('Modelagem', 'Modinha', false, null);
INSERT INTO tb_product (name, description, has_Sub_Prod, sub_Product_Id) VALUES ('Piloto', 'Modinha', false, null);
INSERT INTO tb_product (name, description, has_Sub_Prod, sub_Product_Id) VALUES ('Elastico', 'Utensilio', false, null);
INSERT INTO tb_product (name, description, has_Sub_Prod, sub_Product_Id) VALUES ('Entrega', 'Viagem',true, 2);

INSERT INTO tb_status (name) VALUES ('Aguardando');
INSERT INTO tb_status (name) VALUES ('Produção');
INSERT INTO tb_status (name) VALUES ('Finalizado');
INSERT INTO tb_status (name) VALUES ('Quitado');

INSERT INTO tb_order  (supplier_Id, product_Id, sub_Product_Id, status_Id, entry_Date, unit_Amount_Prod, quantity_Prod, unit_Amount_Sub_Prod, quantity_Sub_Prod, exit_Date, total_Amount, paid_Value, is_Paid, end_Os) VALUES (1, 1, 1, 1, '2024-08-28', 4.0, 70, 0.15, 3, null, 311.5, 0, false, null);
INSERT INTO tb_order  (supplier_Id, product_Id, sub_Product_Id, status_Id, entry_Date, unit_Amount_Prod, quantity_Prod, unit_Amount_Sub_Prod, quantity_Sub_Prod, exit_Date, total_Amount, paid_Value, is_Paid, end_Os) VALUES (2, 2, null, 2, '2024-07-28', 0.15, 100, null, null, null, 15.0, 0, false, null);
INSERT INTO tb_order  (supplier_Id, product_Id, sub_Product_Id, status_Id, entry_Date, unit_Amount_Prod, quantity_Prod, unit_Amount_Sub_Prod, quantity_Sub_Prod, exit_Date, total_Amount, paid_Value, is_Paid, end_Os) VALUES (1, 3, null, 3, '2024-06-28', 40.0, 2, null, null, '2024-07-28', 80.0, 70.0, false, null);
INSERT INTO tb_order  (supplier_Id, product_Id, sub_Product_Id, status_Id, entry_Date, unit_Amount_Prod, quantity_Prod, unit_Amount_Sub_Prod, quantity_Sub_Prod, exit_Date, total_Amount, paid_Value, is_Paid, end_Os) VALUES (2, 4, null, 4, '2024-05-28', 70.0, 1, null, null, '2024-05-30', 70.0, 70.0, true, '2024-05-30');
INSERT INTO tb_order  (supplier_Id, product_Id, sub_Product_Id, status_Id, entry_Date, unit_Amount_Prod, quantity_Prod, unit_Amount_Sub_Prod, quantity_Sub_Prod, exit_Date, total_Amount, paid_Value, is_Paid, end_Os) VALUES (1, 1, null, 4, '2024-05-28', 4.0, 100, null, null, '2024-05-10', 400.0, 400.0, true, '2024-05-30');
INSERT INTO tb_order  (supplier_Id, product_Id, sub_Product_Id, status_Id, entry_Date, unit_Amount_Prod, quantity_Prod, unit_Amount_Sub_Prod, quantity_Sub_Prod, exit_Date, total_Amount, paid_Value, is_Paid, end_Os) VALUES (2, 4, null, 3, '2024-06-28', 40.0, 2, null, null, '2024-07-28', 80.0, 0, false, null);

INSERT INTO tb_pay  (order_Id, pay_Date, pay_Value) VALUES (4, '2024-05-30', 70.0);
INSERT INTO tb_pay  (order_Id, pay_Date, pay_Value) VALUES (5, '2024-05-29', 200.0);
INSERT INTO tb_pay  (order_Id, pay_Date, pay_Value) VALUES (5, '2024-05-30', 200.0);
INSERT INTO tb_pay  (order_Id, pay_Date, pay_Value) VALUES (3, '2024-07-30', 70.0);
