"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _url = require("url");

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _ejs = _interopRequireDefault(require("ejs"));

var _index = _interopRequireDefault(require("./models/index.js"));

var _index2 = _interopRequireDefault(require("./routes/index.js"));

var _users = _interopRequireDefault(require("./routes/users.js"));

var _requestIp = _interopRequireDefault(require("@supercharge/request-ip"));

var app = (0, _express["default"])();

var _filename = (0, _url.fileURLToPath)(import.meta.url);

var _dirname = _path["default"].dirname(_filename);

console.log(_filename);
console.log(_dirname);
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // app.use(express.urlencoded({ extended: false }));

app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"](_path["default"].join(_dirname, '../public')));
app.engine('html', _ejs["default"].renderFile);
app.set('view engine', 'html');
app.set('views', _path["default"].join(_dirname, '../public/template'));

_index["default"].sequelize.sync();

app.use('/', _index2["default"]);
app.use('/users', _users["default"]);
var _default = app;
exports["default"] = _default;