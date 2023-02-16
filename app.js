const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
	res.json({
		message: 'Welcome',
	});
});

app.post('/api/posts', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) {
			res.status(403).json({
				message: "No token found"
			});
		} else {
			res.json({
				message: 'Post created...',
				authData,
			});
		}
	});
});

app.post('/api/login', (req, res) => {
	// Mock user
	const user = {
		id: 1,
		username: 'sam',
		email: 'sam@gmail.com',
	};

	jwt.sign({ user }, 'secretkey', { expiresIn: '30s' },(err, token) => {
		res.json({
			token,
		});
	});
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	// Check if bearer is undefined
	if(typeof bearerHeader !== 'undefined') {
		// Extract token from header
		const token = bearerHeader.split(' ')[1];

		// Set the token
		req.token = token;

		// Call next middleware
		next();
	} else {
		// Forbidden
		res.status(403).json({
			message: 'Error creating token',
		});
	}
}

app.listen(5000, () => console.log('Server started on port 5000'));
