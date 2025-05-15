INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

DELETE FROM account
WHERE account_id = 1;

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_description LIKE '%small interiors%';

SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;

UPDATE inventory
SET inv_image = REPLACE (inv_image, 'ages/', 'ages/vehicles/'),
	inv_thumbnail = REPLACE (inv_thumbnail, 'ages/', 'ages/vehicles/')
WHERE inv_image LIKE '%ages/%';