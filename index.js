const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

app.use(express.json())

//// create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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

//// create database
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE employee_management_system'
  db.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send('Database created...')
  })
})


app.get('/employees', (req, res) => {
  res.send(employees)
})

app.get('/employees/:id', (req, res) => {
  const employee = employees.find((e) => e.id === parseInt(req.params.id))
  if (!employee)
    return res.status(404).send('The employee with the given ID was not found.')
  res.send(employee)
})

app.post('/employees/', (req, res) => {
  if (!req.body.full_name || !req.body.role) {
    return res.status(400).send('The name or body is missing.')
  } else if (employees.find((e) => e.full_name === req.body.full_name)) {
    return res
      .status(400)
      .send('The employee with the given name already exists.')
  }

  const emp = {
    id: employees.length + 1,
    full_name: req.body.full_name,
    role: req.body.role,
  }
  employees.push(emp)
  res.send(emp)
})

app.put('/employees/', (req, res) => {
  const employee = employees.find((e) => e.id === parseInt(req.body.id))
  if (!employee)
    return res.status(404).send('The employee with the given ID was not found.')

  employee.full_name = req.body.full_name
  employee.role = req.body.role
  res.send(employee)
})

app.delete('/employees/', (req, res) => {
  const employee = employees.find((e) => e.id === parseInt(req.body.id))
  if (!employee)
    return res.status(404).send('The employee with the given ID was not found.')

  const index = employees.indexOf(employee)
  employees.splice(index, 1)
  res.send(employee)
})
