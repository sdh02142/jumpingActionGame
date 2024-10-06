import { getUser, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import hendlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User diisconnected: ${socket.id}`);
    console.log('Current users: ', getUser());
}

// 스테이지에 따라서 더 높은 점수 획득
export const handleConnection = (socket, uuid) => {
    console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
    console.log('Current users: ', getUser());

    createStage(uuid);

    socket.emit('connection', { uuid });
}

export const handlerEvent = (io, socket, data) => {
    if(!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: "Client version mismatch" });
        return;
    }

    const handler = hendlerMappings[data.handlerId];
    if(!handler) {
        socket.emit('response', { status: 'fail', message: "Handler not found" });
        return;
    }

    const response = handler(data.userId, data.payload);

    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }

    socket.emit('response', response);
}