import { constants } from "./constants.js";

export default class EventManager {

    #allUsers = new Map();

    constructor({componentEmitter, socketClient}) {
        this.componentEmitter = componentEmitter;
        this.socketClient = socketClient;
    }

    joinRoomAndWaitForMessages(data) {
        this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data);

        this.componentEmitter.on(constants.events.app.MESSAGE_SENT, msg => {
            this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg);
        });
    }

    #emitComponentUpdate(event, message) {
        this.componentEmitter.emit(
            event,
            message
        );
    }

    #updateActivityLogComponent(message) {
        this.#emitComponentUpdate(
            constants.events.app.ACTIVITY_LOG_UPDATED,
            message
        );
    }

    updateUsers(users) {
        const connectedUsers = users;
        connectedUsers.forEach(({id, username}) => this.#allUsers.set(id, username));
        this.#updateUsersComponent();
    }

    #updateUsersComponent() {
        this.#emitComponentUpdate(
            constants.events.app.STATUS_UPDATED,
            Array.from(this.#allUsers.values())
        );
    }

    newUserConnected(message) {
        const user = message;
        this.#allUsers.set(user.id, user.username);
        this.#updateUsersComponent();
        this.#updateActivityLogComponent(`${user.username} joined!`);
    }

    getEvents() {
        const functions = Reflect.ownKeys(EventManager.prototype)
            .filter(fn => fn !== 'constructor')
            .map(name => [name, this[name].bind(this)]);

        return new Map(functions);
    }
}