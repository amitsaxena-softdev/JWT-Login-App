const fs = require('fs');
const path = require('path');

//const filePath = path.resolve(__dirname, '/Data/Users.json');

const filePath = path.join(__dirname, "../Data/Users.json")
let users = [];

function loadUsers() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    users = JSON.parse(data);
  } else {
    console.error(`File not found: ${filePath}`);
    users = [];
  }
  return users;
}

function saveUsers(newUsers) {
  fs.writeFileSync(filePath, JSON.stringify(newUsers, null, 2), 'utf-8');
  loadUsers(); // Reload users after saving
}

module.exports = {
  users,
  loadUsers,
  saveUsers
};
