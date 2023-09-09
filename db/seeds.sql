INSERT INTO department (name)
VALUES ("Sales"),
       ("Service"),
       ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Service Advisor", 60000, 2),
       ("Service Manager", 75000, 2),
       ("Salesperson", 50000, 1),
       ("Sales manager", 65000,1),
       ("HR Representative", 45000, 3),
       ("HR Manager", 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 2, null),
       ("Luke", "Hammer", 1, 1),
       ("Jane", "Doe", 4, null),
       ("Tony", "Pitts", 3, 3),
       ("Ed", "Long", 6, null),
       ("Matt", "Brown", 5, 5);