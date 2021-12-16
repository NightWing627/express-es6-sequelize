import express from 'express';
import * as LogController from '../controllers/log.controller.js'

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('dashboard.html');
});

router.post('/get_transactions', LogController.findAll);

router.post('/get_data', LogController.get_balance);

router.post('/add_transaction', LogController.create);

router.post('/delete_transaction', LogController.remove);

export default router;
