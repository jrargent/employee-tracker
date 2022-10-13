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
      password: 'Knittaplease4!',
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
        case 'EXIT':
            process.exit();
            break;
        default:
            process.exit();        
    }


  };

const viewEmployees = async () => {
    const [employeeData] = await db.query('SELECT * FROM employee');
    console.table(employeeData);
    mainMenu();

};

const viewDepartments = () => {
// queries go here

};

const viewRoles = () => {


};



  mainMenu();