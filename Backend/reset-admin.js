const pool = require('./db');
const bcrypt = require('bcryptjs');

async function resetSuperAdmin() {
    try {
        // 1. Generate a fresh, perfect hash for "AswinAdmin"
        const newHash = await bcrypt.hash('AswinAdmin', 10);

        // 2. Automatically update the database
        const query = `
            UPDATE Users 
            SET email = 'aswinarun654@gmail.com', password_hash = $1 
            WHERE role = 'superadmin'
            RETURNING email;
        `;
        
        const result = await pool.query(query, [newHash]);

        if (result.rowCount > 0) {
            console.log(`Success! Super Admin updated for: ${result.rows[0].email}`);
            console.log(`Your password is exactly: AswinAdmin`);
        } else {
            console.log(`Error: Could not find a 'superadmin' in the database. Did you run the INSERT query in pgAdmin?`);
        }
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        process.exit(); // Stop the script
    }
}

resetSuperAdmin();