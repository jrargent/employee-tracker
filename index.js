const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'string',
        database: 'employees'
    },
    console.log(`Connected to the inventory_db database.`)
).promise();


function logoLoad() {
    const logoText = logo({ name: 'Employee Tracker' }).render();
    console.log(logoText);
    mainMenu();
};

const mainMenu = async () => { // async await allows for asynchronous promises
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View All Departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'View All Roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Add an Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Add a Department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Add a Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_ROLE'
                },
                {
                    name: 'Exit',
                    value: 'EXIT'
                }
            ]
        }
    ])

    switch (choice) {
        case 'VIEW_EMPLOYEES':
            viewEmployees()
            break;
        case 'VIEW_DEPARTMENTS':
            viewDepartments();
            break;
        case 'VIEW_ROLES':
            viewRoles();
            break;
        case 'ADD_EMPLOYEE':
            addEmployee();
            break;
        case 'ADD_DEPARTMENT':
            addDepartment();
            break;
        case 'ADD_ROLE':
            addRole();
            break;
        case 'UPDATE_ROLE':
            updateRole();
            break;
        case 'EXIT':
            process.exit();
            break;
        default:
            process.exit();
    }
};

const viewEmployees = async () => {
    const [employeeData] = await db.query(
        `SELECT E.id, E.first_name, E.last_name, role.title AS title, 
         department.name AS department, role.salary, CONCAT(m.first_name,' ', M.last_name) AS manager
         FROM employee E 
         JOIN role ON E.role_id = role.id 
         JOIN department ON role.department_id = department.id
         LEFT JOIN employee M ON E.manager_id = M.id`);
    console.table(employeeData);
    mainMenu();
};

const viewDepartments = async () => {
    const [departmentData] = await db.query('SELECT * FROM department');
    console.table(departmentData);
    mainMenu();
};

const viewRoles = async () => {
    const [roleData] = await db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id');
    console.table(roleData);
    mainMenu();
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a department name.');
                    return false;
                }
            }
        }
    ]).then(data => {
        db.query(`INSERT INTO department (name)
        VALUES ('${data.name}')`);
        viewDepartments();
    });
};

const addRole = async () => {
    const [listDepartments] = await db.query('SELECT * FROM department');
    let departments = [];
    let getDepartment = new Promise((resolve, reject) => {
        for (let dept of listDepartments) {
            var departmentData = {
                name: dept.name,
                value: {
                    name: dept.name,
                    id: dept.id
                }
            }
            departments.push(departmentData);
            resolve(departments);
        }
    });

    getDepartment.then((departments) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log('Please enter a role name.');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please enter a number.');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'choice',
                message: 'Which department does this role belong to?',
                choices: departments
            }
        ]).then(data => {
            db.query(`INSERT INTO role (title, salary, department_id)
            VALUES ('${data.title}', ${data.salary}, ${data.choice.id})`)

            mainMenu();
        })
    })
};

const addEmployee = async () => {

    const [listManagers] = await db.query('SELECT * FROM employee');
    let managers = [];
    let getManager = new Promise((resolve, reject) => {
        for (let manager of listManagers) {
            var managerData = {
                name: manager.name,
                value: {
                    name: manager.name,
                    id: manager.id
                }
            }
            managers.push(managerData);
            resolve(managers);
        }
    });

    const [listRoles] = await db.query('SELECT * FROM role');
    let roles = [];
    let getRole = new Promise((resolve, reject) => {
        for (let role of listRoles) {
            var roleData = {
                name: role.title,
                value: {
                    name: role.title,
                    id: role.id
                }
            }
            roles.push(roleData);
            resolve(roles);
        }
    });


    getRole.then((roles) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What is the employee's first name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log('Please enter an employee name.');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log('Please enter an employee name.');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'choice',
                message: "What is the employee's role?",
                choices: roles
            },
            // {
            //     type: 'list',
            //     name: 'choice',
            //     message: "Who is the employee's manager?",
            //     choices: 

            // }
        ]).then(data => {
            console.log(data);
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                     VALUES ('${data.first_name}', "${data.last_name}", ${data.choice.id}, NULL)`)
            mainMenu();
        })
    })
};



const updateRole = async () => {
    const [listEmployees] = await db.query('SELECT * FROM employee');
    let employees = [];
    let getEmployee = new Promise((resolve, reject) => {
        for (let emp of listEmployees) {
            var employeeData = {
                name: emp.first_name + " " + emp.last_name,
                value: {
                    name: emp.first_name + " " + emp.last_name,
                    id: emp.id
                }
            }
            employees.push(employeeData);
            resolve(employees);
        }
    });

    getEmployee.then((employees) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: "Which employee's role do you want to update?",
                choices: employees
            },
        ]).then((data) => {
            console.log(data);
        })
    })


    // prompt here for 'Which employee's role do you want to update?? (use choice prompt here and list employees)
    // 'Which role do you want to assign the selected employee?' 

};

logoLoad();