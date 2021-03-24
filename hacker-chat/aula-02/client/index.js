/* cd hacker-chat/aula-02/client
    node index.js \
        ---username erick wendel \
        --room sala01 \
        --hostUri localhost
*/

import CliConfig from './src/cliConfig.js';
import Events from 'events';
import TerminalController from './src/terminalController.js';

const [nodePath, filePath, ...comands] = process.argv;

const config = CliConfig.parseArguments(comands);

console.log('config', config);

const componentEmitter = new Events();

const controller = new TerminalController();

// await controller.initializeTable(componentEmitter);