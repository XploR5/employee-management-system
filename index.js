const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

app.use(express.json())

//create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
})

//connect
db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('MySql Connected!!')
})

//create database
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE employee_management_system'
  db.query(sql, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send('Database created...')
  })
})

const employees = [
  { id: 1, full_name: 'Sahil Doshi', role: 'Sr. Consultant' },
  { id: 2, full_name: 'Nikhil Jadhav', role: 'Sr. SDE' },
  { id: 3, full_name: 'Rohan Balkondekar', role: 'SDE intern' },
]

app.get('/', (req, res) => {
  res.send('This is a employee-management-system')
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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
