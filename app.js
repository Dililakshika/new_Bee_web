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

// Route to handle the update of hive details
app.post('/update-hive', (req, res) => {
  const { hive_no, temperature, humidity, weight, health_status, active_status, bees_in, bees_out } = req.body;
  const updated_at = new Date();  // Capture the current date and time

  // Update the hive details
  const updateQuery = `
      UPDATE hive_details
      SET temperature = ?, humidity = ?, weight = ?, health_status = ?, active_status = ?, bees_in = ?, bees_out = ?, last_updated = NOW()
      WHERE hive_no = ?
  `;

  db.query(updateQuery, [temperature, humidity, weight, health_status, active_status, bees_in, bees_out, hive_no], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error updating hive data');
      }

      // Optionally, save the update history in another table
      const historyQuery = `
          INSERT INTO hive_update_history (hive_no, updated_at, temperature, humidity, weight, health_status, active_status, bees_in, bees_out)
          VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(historyQuery, [hive_no, temperature, humidity, weight, health_status, active_status, bees_in, bees_out], (err) => {
          if (err) {
              console.error(err);
          }
          res.redirect('/hive-details'); // Redirect back to the hive details page
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


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

