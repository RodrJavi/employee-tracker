const inquirer = require("inquirer");
const sql = require("mysql2");

const db = sql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Deadlift",
    database: "company_db",
  },
  console.log("Connected to company_db database!")
);

const viewDepartments = () => {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    console.table(data);
    showOptionList();
  });
};

const viewRoles = () => {
  db.query(
    "SELECT role.title AS Titles, role.id AS role_id, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      showOptionList();
    }
  );
};

const viewEmployees = () => {
  db.query(
    "SELECT employee.id, first_name, last_name, role.title as role, department.name as department, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      showOptionList();
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of this new department?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO department (name) VALUES ("${answer.departmentName}")`,
        (err, data) => {
          if (err) throw err;
          console.log(`New department named "${answer.departmentName}" added!`);
          showOptionList();
        }
      );
    });
};
const showOptionList = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View all departments": {
          viewDepartments();
          break;
        }

        case "View all roles": {
          viewRoles();
          break;
        }

        case "View all employees": {
          viewEmployees();
          break;
        }

        case "Add a department": {
          addDepartment();
        }
      }
    });
};

showOptionList();
