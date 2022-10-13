USE employees;

INSERT INTO department 
    (name)
VALUES
    ('Sales'),
    ('IT'),
    ('Legal'),
    ('Engineering'),
    ('Accounting');

INSERT INTO role 
    (title, salary, department_id)
VALUES
    ('Sales Lead', 75000, 1),
    ('IT Admin', 65000, 2),
    ('Paralegal', 35000, 3),
    ('Software Developer', 85000, 4),
    ('Accountant', 70000, 5);

INSERT INTO employee 
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Alex', "Chen", 1, NULL),
    ('Lindsay', "Reiner", 2, NULL),
    ('Caleb', "Crum", 1, 1);