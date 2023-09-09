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
  db.query(
    "SELECT department.name as Departments FROM department",
    (err, data) => {
      if (err) throw err;
      console.table(data);
    }
  );
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
      if (answer.action == "View all departments") {
        viewDepartments();
        console.log("look at these depts");
      }
    });
};

showOptionList();
