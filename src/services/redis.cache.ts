import { createClient, RedisClientType } from 'redis';

class RedisCache {
    public client: RedisClientType

    constructor() {
        this.client = createClient()

        this.client.on('error', err => console.log('Redis Client Error', err))
        this.client.connect();
    }


}


export default RedisCache