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

const addRole = () => {
  let departmentArray;
  let departmentList = [];
  db.query("SELECT * FROM department", (err, data) => {
    if (err) throw err;
    departmentArray = data;
    data.forEach((department) => departmentList.push(department.name));
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of this new role?",
      },
      {
        type: "number",
        name: "salary",
        message: "What is this new role's salary?",
      },
      {
        type: "list",
        name: "department",
        message: "What department will this role belong to?",
        choices: departmentList,
      },
    ])
    .then((answer) => {
      const departmentId = departmentArray.find(
        (department) => department.name === answer.department
      );

      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${answer.name}", ${answer.salary}, ${departmentId.id})`,
        (err, data) => {
          if (err) throw err;
          if (isNaN(answer.salary)) {
            console.log("Salary must be a number!");
          } else {
            console.log(`Added ${answer.name} to the database`);
          }
          showOptionList();
        }
      );
    });
};

const addEmployee = () => {
  let employeeArray;
  let employeeList = [];
  db.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err;
    employeeArray = data;
    data.forEach((employee) =>
      employeeList.push(`${employee.first_name} ${employee.last_name}`)
    );
  });

  let roleArray;
  let roleList = [];
  db.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;
    roleArray = data;
    data.forEach((role) => roleList.push(role.title));
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the new employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the new employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the new employee's role?",
        choices: roleList,
      },
      {
        type: "list",
        name: "manager",
        message: "Who will this employee's manager be?",
        choices: employeeList,
      },
    ])
    .then((answer) => {
      const roleId = roleArray.find((role) => role.title === answer.role);
      const managerId = employeeArray.find(
        (employee) =>
          `${employee.first_name} ${employee.last_name}` === answer.manager
      );

      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${roleId.id}, ${managerId.id})`,
        (err, data) => {
          if (err) throw err;
          console.log(
            `${answer.firstName} ${answer.lastName} has been added to the database`
          );
          showOptionList();
        }
      );
    });
};

const updateRole = () => {
  let employeeArray;
  let employeeList = [];
  let roleArray;
  let roleList = [];
  db.query("SELECT * FROM employee", (err, data) => {
    if (err) throw err;
    employeeArray = data;
    employeeArray.forEach((employee) =>
      employeeList.push(`${employee.first_name} ${employee.last_name}`)
    );
  });

  db.query("SELECT * FROM role", (err, data) => {
    if (err) throw err;
    roleArray = data;
    roleArray.forEach((role) => roleList.push(role.title));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Who's role is going to be updated?",
          choices: employeeList,
        },
        {
          type: "list",
          name: "newRole",
          message: "What role will this employee be changed to?",
          choices: roleList,
        },
      ])
      .then((answer) => {
        const roleId = roleArray.find((role) => role.title === answer.newRole);
        const employeeId = employeeArray.find(
          (employee) =>
            `${employee.first_name} ${employee.last_name}` === answer.employee
        );
        db.query(
          `UPDATE employee SET role_id = ${roleId.id} WHERE id = ${employeeId.id}`,
          (err, data) => {
            if (err) throw err;
            console.log(`Updated ${answer.employee}'s role`);
            showOptionList();
          }
        );
      });
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
          break;
        }

        case "Add a role": {
          addRole();
          break;
        }

        case "Add an employee": {
          addEmployee();
          break;
        }

        case "Update an employee role": {
          updateRole();
          break;
        }
      }
    });
};

showOptionList();
