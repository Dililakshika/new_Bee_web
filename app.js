require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile); // Use EJS as the templating engine

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.render('index.html'); // Main page
});

app.get('/login', (req, res) => {
  res.render('login.html'); // Login page
});

app.get('/register', (req, res) => {
  res.render('register.html'); // Register page
});

app.get('/maintanace', (req, res) => {
  if (req.session.userId) {
    res.render('maintanace.html'); 
  } else {
    res.redirect('/login'); // Redirect to login if not authenticated
  }
});

app.get('/maintanace', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'maintanace.html'));
});

app.get('/hive-details', (req, res) => {
  res.sendFile(__dirname + '/views/hive-details.html');
});

app.get(['/', '/home', '/dashboard', '/maintenance', '/contact'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Handle registration
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// Handle login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
      req.session.userId = user._id; // Store user ID in session
      res.redirect('/maintanace'); // Redirect to location search page
    } else {
      res.render('login.html', { error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

//login error
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
      req.session.userId = user._id;
      res.redirect('/maintanace');
  } else {
      res.render('login.html', { error: 'Invalid email or password' });
  }
});

app.get('/api/hives', async (req, res) => {
  try {
      const hives = await Hive.find();
      res.json(hives);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Add a new hive
app.post('/api/hives', async (req, res) => {
  const hive = new Hive(req.body);
  try {
      await hive.save();
      res.status(201).json(hive);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Edit a hive
app.put('/api/hives/:id', async (req, res) => {
  try {
      const hive = await Hive.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(hive);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});


// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));