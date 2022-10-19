const inquirer = require('inquirer');
const mysql = require('mysql2');
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
                    name: 'Exit',
                    value: 'EXIT'
                }
                // more may be added
            ]
        }
    ])

    switch (choice) {
        case 'VIEW_EMPLOYEES':
            viewEmployees()//.then(mainMenu());
            break;
        case 'VIEW_DEPARTMENTS':
            viewDepartments();
            break;
        case 'VIEW_ROLES':
            viewRoles();
            break;
        // case 'ADD_EMPLOYEE':
        //     addEmployee();
        //     break;
        case 'ADD_DEPARTMENT':
            addDepartment();
            break;
        // case 'ADD_ROLE':
        //     addRole();
        //     break;
        case 'EXIT':
            process.exit();
            break;
        default:
            process.exit();
    }


};

const viewEmployees = async () => {
    const [employeeData] = await db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, 
         department.name AS department, role.salary, employee.manager_id AS manager 
         FROM employee 
         JOIN role ON employee.role_id = role.id 
         JOIN department ON role.department_id = department.id`);
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
    const newDepartment = `INSERT INTO department (name)
                            VALUES (?)`;
}

mainMenu();