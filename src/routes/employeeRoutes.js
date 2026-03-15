const express = require('express');
const { authSuperAdmin } = require('../middleware/auth');
const {
  createEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee,
  salaryList,
} = require('../controllers/employeeController');

const router = express.Router();

router.use(authSuperAdmin);

router.post('/', createEmployee);
router.get('/', listEmployees);
router.get('/salary-list', salaryList);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
