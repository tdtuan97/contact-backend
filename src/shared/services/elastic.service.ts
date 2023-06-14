import {Inject, Injectable} from '@nestjs/common';

@Injectable()
export class ElasticService {
    constructor() {}

    public search(){
        return 'ok'
    }

}
