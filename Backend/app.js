const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');

const http = require('http');
const {createServer} = require('node:http');
const {Server} = require('socket.io')
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const passwordRoutes = require('./routes/password');
const chatRoutes = require('./routes/chat');

const User = require('./models/User');
const ForgotPassword = require('./models/ForgotPassword');
const ChatHistory = require('./models/ChatHistory');
const Group = require('./models/Group');
const GroupMember = require('./models/GroupMember');

const cronService = require('./services/cronjob');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://127.0.0.1:5502','http://127.0.0.1:5500'],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

cronService.job.start();

require('dotenv').config();

//Established Socket connection
io.on('connection', (socket) => {
    socket.on('message', (mssgDetails, groupId) => {
        io.emit('message', mssgDetails, groupId);
    });

    socket.on('groupUpdates', (updatedGroupDetails) => {
        io.emit('groupUpdates', updatedGroupDetails);
    });

    socket.on('groupCreation', (groupDetails, groupId, flag) => {
        socket.broadcast.emit('groupCreation', groupDetails, groupId, flag);
    });
});

//middlewares with Routes
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')))

app.use('/user', userRoutes);
app.use('/password', passwordRoutes);
app.use('/chat', chatRoutes);

//DB Associations
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User); 
Group.belongsToMany(User, {through: GroupMember});
User.belongsToMany(Group, {through: GroupMember});
Group.hasMany(ChatHistory, {onDelete: 'CASCADE'});
ChatHistory.belongsTo(Group);
User.hasMany(ChatHistory);
ChatHistory.belongsTo(User);

sequelize.sync().then((result) => {
    console.log("Database Connected ....");
    server.listen(3000, () => {
      console.log(`Server running on port 3000 `);
    });
  })
  .catch((err) => {
    console.log(err);
  });