import { WebSocketServer } from 'ws';
import axios, { Axios } from 'axios';

const port:any = 19002;
const wss = new WebSocketServer(({port: port}));

wss.on('connection', (ws) => {
    console.log(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + ' - Connection!');

    
    ws.on('message', (data) => 
    {
        var jsonData = JSON.parse(data.toString());
        console.log(jsonData);
        switch(jsonData.type)
        {
            default:
                break;
        }
    });

    ws.on('close', () => {
        console.log(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " - A connection was closed");
    });

    ws.send('Connected');
});

console.log('Listening on port', port);

export function sendToAllClients(data:any)
{
    wss.clients.forEach(client => client.send(data));
}
