const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 5501

app.use(express.json())

//// create connection
const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'secure',
  port: 3306
})

//// connect
db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('MySql Connected!!')
  app.listen(port, () => {
    console.log(`App listening at http:localhost:${port}`)
  })
})

//// Default employees
const defaultEmployees = [
  { full_name: 'Anupam Kulkarni', role: 'CEO' },
  { full_name: 'Nilesh Ratanaparkhi', role: 'COO' },
  { full_name: 'Krunal Chaudhari', role: 'CTO' },
  { full_name: 'Mayur Yambal', role: 'CPO' },
  { full_name: 'Yogesh Dhande', role: 'CDO' },
  { full_name: 'Sahil Doshi', role: 'Sr. Consultant' },
  { full_name: 'Nikhil Jadhav', role: 'Sr. SDE' },
  { full_name: 'Rohan Balkondekar', role: 'SDE intern' },
  { full_name: 'Chinmay Deshpande', role: 'SDE intern' },
]

//// Initiate database
app.get('/', (req, res) => {
  db.query('DROP DATABASE IF EXISTS employee_management_system', () => {
    console.log('Previous Database dropped...')
  })
  db.query('CREATE DATABASE employee_management_system', () => {
    console.log('New Database created...')
  })
  db.query('USE employee_management_system', () => {
    console.log('Using new Database...')
  })
  db.query(
    'CREATE TABLE posts(id int AUTO_INCREMENT, full_name VARCHAR(255), role VARCHAR(255), PRIMARY KEY(id))',
    () => {
      console.log('New Table created...')
    }
  )
  defaultEmployees.forEach((employee) => {
    db.query('INSERT INTO posts SET ?', employee)
  })
  res.send(`<h1>Welcome🙏</h1>
  <h2>This is a Employee Management System </h2>
  <ul>
  <li>Database initiated with ${defaultEmployees.length} default employees</li>
  <li>view console for details</li>
  <li>See the employees at <a href="http://localhost:3000/employees">http://localhost:3000/employees</a></li>
  </ul>`)
})

//// Get all employees
app.get('/employees', (req, res) => {
  db.query('SELECT * FROM posts', (err, rows) => {
    if (err) throw err
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #dddddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #dddddd;
    }
    .fullname{
    text-transform: capitalize;
    font-weight: bold;
    }
    .role{
    text-transform: uppercase;
    font-style: italic;
    }
    .id {
    width: 10%;
    }

    </style>
    </head>
    <body>
      <h1>Employees</h1>
      <table>
        <tr>
          <th class="id">ID</th>
          <th>Full Name</th>
          <th>Role</th>
        </tr>
        ${rows
          .map(
            (row) => `
          <tr>
            <td>${row.id}</td>
            <td class="fullname">${row.full_name}</td>
            <td class="role">${row.role}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    </body>
    </html>
    `)
  })
})

//// Get employee by id
app.get('/employees/:id', (req, res) => {
  const { id } = req.params
  db.query(`SELECT * FROM posts WHERE id = ${id}`, (err, rows) => {
    if (err) throw err
    if (rows.length === 0) {
      return res.send(`<h1>Employee not found</h1>`)
    }
    const employee = rows[0]
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #dddddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #dddddd;
    }
    </style>
    </head>
    <body>
      <h1>Employee</h1>
      <table>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Role</th>
        </tr>
        <tr>
            <td>${employee.id}</td>
            <td>${employee.full_name}</td>
            <td>${employee.role}</td>
          </tr>
      </table>
    </body>
    </html>
    `)
  })
})

//// Create new employee
app.post('/employees/', (req, res) => {
  const { full_name, role } = req.body
  if (!full_name || !role) {
    return res.status(400).send('Name and role are required')
  }
  db.query('INSERT INTO posts SET ?', { full_name, role }, (err, result) => {
    if (err) throw err
    res.send(
      `Employee ${full_name} with role ${role} created with id ${result.insertId}`
    )
  })
})

//// Update employee
app.put('/employees/', (req, res) => {
  const { id, full_name, role } = req.body
  if (!id || !full_name || !role) {
    return res.status(400).send('ID, Name and role are required')
  }
  db.query('UPDATE posts SET full_name = ?, role = ? WHERE id = ?', [full_name, role, id], (err, result) => { if (err) throw err
    res.send(`ID: ${id} Employee ${full_name} with role ${role} updated`)
  })
})

//// Delete employee
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err
    res.send(`Employee with id ${id} deleted`)
  })
})
