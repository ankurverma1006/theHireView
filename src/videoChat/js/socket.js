/* global SOCKET_HOST */
import io from 'socket.io-client';
import CONSTANTS from '../../common/core/config/appConfig';
var SOCKET_HOST=CONSTANTS.socket.URL;
const socket = io(SOCKET_HOST);
export default socket;
