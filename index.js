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
                // more may be added
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
        // case 'ADD_EMPLOYEE':
        //     addEmployee();
        //     break;
        case 'ADD_DEPARTMENT':
            addDepartment();
            break;
        case 'ADD_ROLE':
            addRole();
            break;
        // case 'UPDATE_ROLE':
        //     updateRole();
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
            message: 'What is the name of the department?'
        }
    ]).then(data => {
        db.query(`INSERT INTO department (name)
        VALUES ('${data.name}')`);
        viewDepartments();
    });


};

const addRole = async () => {
    const [listDepartments] = await db.query('SELECT * FROM department');
    //console.log(listDepartments);
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
        console.log(departments);
    })


    // inquirer.prompt([
    //     {
    //         type: 'input',
    //         name: 'name',
    //         message: 'What is the name of the role?'
    //     },
    //     {
    //         type: 'number',
    //         name: 'salary',
    //         message: 'What is the salary of the role?'
    //     },
    //     {
    //         type: 'list',
    //         name: 'choice',
    //         message: 'Which department does this role belong to?',
    //         choices: 


    // ]).then(
    // // INSERT INTO role (title, salary, department_id)
    // // VALUES ('${data.title}', ${data.salary}, ${data.id}),
    // )

};

const addEmployee = () => {
    // prompt here for 'What is the employee's first name?'
    // 'What is the employee's last name?' 
    // and 'What is the employee's role?' (use choice prompt here)
    // 'Who is the employee's manager? (use choice prompt here and list none, other employees)
};

const updateRole = () => {
    // prompt here for 'Which employee's role do you want to update?? (use choice prompt here and list employees)
    // 'Which role do you want to assign the selected employee?' 

};

logoLoad();