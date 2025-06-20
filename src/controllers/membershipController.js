const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/database');

class MembershipController {
  // POST /registration
  async register(req, res, next) {
    try {
      const { email, first_name, last_name, password } = req.validatedData;

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user with prepared statement
      const query = `
        INSERT INTO users (email, first_name, last_name, password) 
        VALUES (?, ?, ?, ?)
      `;
      
      await pool.execute(query, [email, first_name, last_name, hashedPassword]);

      res.status(200).json({
        status: 0,
        message: 'Registrasi berhasil silahkan login',
        data: null
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          status: 102,
          message: 'Email sudah terdaftar',
          data: null
        });
      }
      next(error);
    }
  }

  // POST /login
  async login(req, res, next) {
    try {
      const { email, password } = req.validatedData;

      // Find user with prepared statement
      const query = 'SELECT id, email, password FROM users WHERE email = ?';
      const [users] = await pool.execute(query, [email]);

      if (users.length === 0) {
        return res.status(401).json({
          status: 103,
          message: 'Username atau password salah',
          data: null
        });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          status: 103,
          message: 'Username atau password salah',
          data: null
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
      );

      res.status(200).json({
        status: 0,
        message: 'Login Sukses',
        data: {
          token: token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /profile
  async getProfile(req, res, next) {
    try {
      const user = req.user;
      
      res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: user.profile_image || `${process.env.BASE_URL}/uploads/default-profile.jpg`
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /profile/update
  async updateProfile(req, res, next) {
    try {
      const { first_name, last_name } = req.validatedData;
      const userId = req.user.id;

      // Update user profile with prepared statement
      const query = `
        UPDATE users 
        SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await pool.execute(query, [first_name, last_name, userId]);

      // Get updated user data
      const [users] = await pool.execute(
        'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
        [userId]
      );

      const user = users[0];

      res.status(200).json({
        status: 0,
        message: 'Update Profile berhasil',
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: user.profile_image || `${process.env.BASE_URL}/uploads/default-profile.jpg`
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /profile/image
  async updateProfileImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 102,
          message: 'File tidak ditemukan',
          data: null
        });
      }

      const userId = req.user.id;
      const fileName = req.file.filename;
      const profileImageUrl = `${process.env.BASE_URL}/uploads/${fileName}`;

      // Update profile image with prepared statement
      const query = `
        UPDATE users 
        SET profile_image = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await pool.execute(query, [profileImageUrl, userId]);

      // Get updated user data
      const [users] = await pool.execute(
        'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
        [userId]
      );

      const user = users[0];

      res.status(200).json({
        status: 0,
        message: 'Update Profile Image berhasil',
        data: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: user.profile_image
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MembershipController();