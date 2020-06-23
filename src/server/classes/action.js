import { generatetoken } from '../helpers'

export class ActionClient {
    // JSON Du client vers le server
    constructor(token, command) {
        this.token = token
        this.command = command
    }
}

export class ActionServer {
    // JSON Du server vers le client (réponse)
    constructor(token, players) {
        this.token = token
        // array de player sans la key (token)
        this.players = players
    }
}