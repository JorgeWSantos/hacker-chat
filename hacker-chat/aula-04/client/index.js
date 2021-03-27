/* cd hacker-chat/aula-02/client
    node index.js \
        ---username erick wendel \
        --room sala01 \
        --hostUri localhost
*/

import CliConfig from './src/cliConfig.js';
import Events from 'events';
import TerminalController from './src/terminalController.js';
import SocketClient from './src/socket.js';
import EventManager from './src/eventManager.js';

const [nodePath, filePath, ...comands] = process.argv;

const config = CliConfig.parseArguments(comands);

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
await socketClient.initialize();

const eventManager = new EventManager({ componentEmitter, socketClient});
const events = eventManager.getEvents();
socketClient.attachEvents(events);

const data = {
    roomId: config.room,
    username: config.username,
};

eventManager.joinRoomAndWaitForMessages(data);

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
