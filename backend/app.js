const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/appConfig');

const app = express();