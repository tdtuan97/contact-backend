export abstract class BaseCommonEntity {
    public static tableName: string = '';

    /**
     * Scope query find by user id
     */
    public static queryFindByUserId(userId: number) {
        return {
            user_id: userId,
        };
    }

    /**
     * Scope query find by user id
     */
    public static queryStringByUserId(userId: number) {
        return `${this.tableName}.user_id = ${userId}`;
    }
}
