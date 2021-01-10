class Transaction_record {
    constructor (v1, v2, count, timestamp) {
        this.transaction_record = {
            v1: v1,
            v2: (v2 === undefined ? v1 : v2),
            count: (count === undefined ? 1 : count),
            timestamp: (timestamp === undefined ? get_time_stamp() : timestamp),
            guid: uuidv4()
        }
    }

    get_transaction_record(){
        return this.transaction_record;
    }

    gget_score() {
        //TODO do it!!
        return {score_c: 0, score_v: 0};
    }

}