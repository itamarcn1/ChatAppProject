
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const connectDb = require('./config/connectDb');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

require('dotenv').config({ path: path.resolve(__dirname, './.env') });


const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5000"],
  credentials: true,
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });
const uploadSingle = upload.single('pic');




connectDb();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 5000;
const server = app.listen(PORT, console.log(`Server started at Port ${PORT}`.yellow.bold));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  maxHttpBufferSize: 1e8,
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log('Connected to Socket.io');

  socket.on('setup', (userId) => {
    socket.join(userId)
    socket.emit('connected')
    socket.on('clear', () => {
      console.log('Disconnected from Socket.io');
      socket.leave(userId)
    })

  })

  socket.on('join chat', (room) => {
    socket.join(room._id)
    console.log("user joined ROOM: " + room);
  })


  socket.on('new message', (newMessage, senderId) => {
    let chat = newMessage

    if (!chat.users) {
      return console.log("chat.users is empty");
    }
    chat.users.forEach(user => {
      if (user._id == senderId){
        socket.emit('message recieved', chat)
        console.log('arrived self bloker');
        socket.in(user._id).emit('message recieved', chat)
      }
      else {
        console.log("arrived here: " + user._id);
        socket.in(user._id).emit('message recieved', chat)

      }
    })
  })
})
