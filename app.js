require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false
}));
// Middleware for JSON parsing
app.use(express.json());


// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bee-smart' 
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// View engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


// Serve the registration page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});

// Handle registration POST request
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Query to insert user into database
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';

  db.query(query, [email, password], (err, result) => {
      if (err) {
          console.error('Database error:', err);
          return res.render('register', { error: 'Registration failed. Please try again.' });
      }

      // If registration is successful, redirect to the login page
      res.redirect('/login');
  });
});

// Serve the login page
app.get('/login', (req, res) => {
  res.render('login.html');  // Render the login page using EJS
});

// Handle login POST request
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.render('login', { error: 'Database error. Please try again later.' });
      }

      if (results.length === 0 || results[0].password !== password) {
          // If no user found or password doesn't match
          return res.render('login', { error: 'Invalid email or password.' });
      }

      req.session.userId = results[0].id;

      // Login success, redirect to dashboard or home
      res.redirect('/');
  });
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();  // User is authenticated, proceed
  } else {
    res.redirect('/login');  // User is not authenticated, redirect to login
  }
}

// Hive details page route
app.get('/hive-details', isAuthenticated, (req, res) => {
  const location = req.query.location || 'All';  // Get the location filter from query or default to 'All'

  // SQL query for hive details
  let query = `
      SELECT * 
      FROM hive_details
      WHERE 1 = 1
  `;

  if (location !== 'All') {
    query += ` AND location = ?`;
  }

  query += `
      ORDER BY 
          CASE WHEN active_status = "active" THEN 0 ELSE 1 END, 
          hive_no ASC
  `;

  db.query(query, [location !== 'All' ? location : null], (err, hives) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving hive data");
    } else {
      res.render('hive-details', { hives: hives, selectedLocation: location });
    }
  });
});

// Serve the index (home/dashboard) page
app.get('/', isAuthenticated, (req, res) => {
  res.render('index.html');
});

// Serve the maintenance page
app.get('/maintanace', isAuthenticated, (req, res) => {
  res.render('maintanace.html');
});

// Serve the harvest page
app.get('/harvest', isAuthenticated, (req, res) => {
  res.render('harvest.html');
});

// Serve the index, home, dashboard, or contact pages
app.get(['/', '/home', '/dashboard', '/contact'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/hive-report', isAuthenticated, (req, res) => {
  res.render('hive-report.html');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');  // Redirect to index after logout
  });
});

// Route to serve the edit hive page
app.get('/edit-hive/:hive_no', isAuthenticated, (req, res) => {
  const hiveNo = req.params.hive_no;

  const query = 'SELECT * FROM hive_details WHERE hive_no = ?';
  db.query(query, [hiveNo], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving hive data');
      }

      if (results.length > 0) {
          res.render('edit-hive', { hive: results[0] });
      } else {
          res.status(404).send('Hive not found');
      }
  });
});

// Route to get edit history for a hive
app.get('/view-history/:hive_no', isAuthenticated, (req, res) => {
  const hiveNo = req.params.hive_no;

  const query = 'SELECT * FROM hive_update_history WHERE hive_no = ? ORDER BY updated_at DESC';
  db.query(query, [hiveNo], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving hive history');
      }

      res.render('view-history', { history: results, hive_no: hiveNo });
  });
});


// Route to serve the form for editing a specific history entry
app.get('/edit-history/:id', isAuthenticated, (req, res) => {
  const id = req.params.id;

  const query = 'SELECT * FROM hive_update_history WHERE id = ?';
  db.query(query, [id], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving history data');
      }

      if (results.length > 0) {
          res.render('edit-history', { history: results[0] });
      } else {
          res.status(404).send('History not found');
      }
  });
});

// Route to handle the update of historical records
app.post('/update-history', (req, res) => {
  const { id, temperature, humidity, weight, health_status, active_status, bees_in, bees_out } = req.body;

  const query = `
      UPDATE hive_update_history 
      SET temperature = ?, humidity = ?, weight = ?, health_status = ?, active_status = ?, bees_in = ?, bees_out = ? 
      WHERE id = ?`;
  
  db.query(query, [temperature, humidity, weight, health_status, active_status, bees_in, bees_out, id], (err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error updating history');
      }

      res.redirect('/view-history/' + req.body.hive_no);
  });
});

app.post('/update-hive', (req, res) => {
  const { hive_no, temperature, humidity, weight, health_status, active_status, bees_in, bees_out } = req.body;

  // Step 1: Save the current data into the history table
  const historyQuery = `
    INSERT INTO hive_update_history (hive_no, updated_at, temperature, humidity, weight, health_status, active_status, bees_in, bees_out) 
    SELECT hive_no, NOW(), temperature, humidity, weight, health_status, active_status, bees_in, bees_out 
    FROM hive_details WHERE hive_no = ?`;
  
  db.query(historyQuery, [hive_no], (err) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Error saving history');
    }

    // Step 2: Update the hive details in the main table
    const updateQuery = `
      UPDATE hive_details 
      SET temperature = ?, humidity = ?, weight = ?, health_status = ?, active_status = ?, bees_in = ?, bees_out = ? 
      WHERE hive_no = ?`;
    
    db.query(updateQuery, [temperature, humidity, weight, health_status, active_status, bees_in, bees_out, hive_no], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating hive details');
      }

      res.redirect('/hive-details');
    });
  });
});


// POST route to add a new hive
app.post('/add-hive', (req, res) => {
  const { hive_no, temperature, humidity, weight, health_status, location, bees_in, bees_out, active_status } = req.body;

  const sql = `INSERT INTO hive_details (hive_no, temperature, humidity, weight, health_status, location, bees_in, bees_out, active_status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [hive_no, temperature, humidity, weight, health_status, location, bees_in, bees_out, active_status], (err, result) => {
      if (err) {
          console.error('Error adding new hive:', err);
          return res.status(500).send('Error adding hive');
      }
      console.log('New hive added:', result);
      res.redirect('/hive-details'); // Redirect back to the hive details page after the hive is added
  });
});

app.post('/saveTasks', (req, res) => {
  const { hiveNo, taskType, dateValue, tasks } = req.body;

  const taskList = tasks.join(','); // Convert tasks array to a string
  let query = '';
  let queryValues = [];

  if (taskType === 'daily') {
      query = 'INSERT INTO hive_tasks (hive_no, task_type, task_date, task_list) VALUES (?, ?, ?, ?)';
      queryValues = [hiveNo, taskType, dateValue, taskList];
  } else if (taskType === 'weekly') {
      query = 'INSERT INTO hive_tasks (hive_no, task_type, task_week, task_list) VALUES (?, ?, ?, ?)';
      queryValues = [hiveNo, taskType, dateValue, taskList]; // weekly date in YYYY-WW format
  } else if (taskType === 'monthly') {
      query = 'INSERT INTO hive_tasks (hive_no, task_type, task_month, task_list) VALUES (?, ?, ?, ?)';
      queryValues = [hiveNo, taskType, dateValue, taskList]; // monthly date in YYYY-MM format
  }

  db.query(query, queryValues, (err, result) => {
      if (err) {
          console.error('Error saving tasks:', err);
          return res.status(500).json({ error: 'Failed to save tasks' });
      } 
  });
});

// Route to save the report
app.post('/saveReport', (req, res) => {
  const { hive_no, task_type, report_content } = req.body;

  // Step 1: Retrieve the hive_task_id from the hive_tasks table
  const getHiveTaskIdSql = 'SELECT id FROM hive_tasks WHERE hive_no = ? AND task_type = ?';
  
  db.query(getHiveTaskIdSql, [hive_no, task_type], (error, results) => {
      if (error) {
          console.error('Error retrieving hive_task_id:', error);
          return res.json({ success: false });
      }

      if (results.length === 0) {
          // No matching task found
          return res.json({ success: false, message: 'No matching task found for the provided hive_no and task_type.' });
      }

      const hiveTaskId = results[0].id;

      // Step 2: Insert the report into the hive_reports table
      const insertReportSql = `
          INSERT INTO hive_reports (hive_task_id, hive_no, task_type, report_content, report_date, created_at) 
          VALUES (?, ?, ?, ?, NOW(), NOW())
      `;

      db.query(insertReportSql, [hiveTaskId, hive_no, task_type, report_content], (error, results) => {
          if (error) {
              console.error('Error saving report:', error);
              return res.json({ success: false });
          }
          res.json({ success: true });
      });
  });
});

// Route to serve the view report page
app.get('/viewReport', (req, res) => {
  res.sendFile(__dirname + '/views/viewReport.html');
});


// Route to get all reports from the hive_reports table
app.get('/getAllReports', (req, res) => {
  // SQL query to fetch all reports from the table
  const sql = 'SELECT * FROM hive_reports ORDER BY report_date DESC';
  db.query(sql, (error, results) => {
      if (error) {
          console.error('Error fetching reports:', error);
          return res.json({ success: false, message: 'Error fetching reports' });
      }

      // Send all the retrieved reports to the frontend
      res.json({ success: true, reports: results });
  });
});

// API endpoint to fetch hive numbers
app.get('/api/hives', (req, res) => {
  const query = 'SELECT hive_no FROM hive_details';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching hive numbers' });
    }
    res.json(results);
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

