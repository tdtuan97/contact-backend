import {Injectable} from '@nestjs/common';
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {PostSearchResult} from "@/shared/elastic/elastic.interface";

@Injectable()
export class ElasticService {
    constructor(private elasticsearchService: ElasticsearchService) {}

    public async search() {
        let test = await this.elasticsearchService.search<PostSearchResult>({
            index: 'kibana_sample_data_ecommerce',
            body: {
                query: {
                    multi_match: {
                        query: '',
                        //fields: []
                    }
                }
            }
        })

        return test
    }
}
