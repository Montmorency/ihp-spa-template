declare module 'ihp-datasync' {
    type TableName = "users" | "todos";
    type IHPRecord<table> = table extends "users" ? User : (table extends "todos" ? Todo : (never));
    
    interface User {
        id: UUID;
        email: string;
        passwordHash: string;
        lockedAt: string | null;
        failedLoginAttempts: number;
    }
    interface Todo {
        id: UUID;
        name: string;
        createdAt: string;
        updatedAt: string;
        userId: UUID;
    }
    /**
     * A User object not yet inserted into the `users` table
     */
    interface NewUser {
        id?: UUID;
        email: string;
        passwordHash: string;
        lockedAt?: string | null;
        failedLoginAttempts?: number;
    }
    /**
     * A Todo object not yet inserted into the `todos` table
     */
    interface NewTodo {
        id?: UUID;
        name: string;
        createdAt?: string;
        updatedAt?: string;
        userId: UUID;
    }
    type NewRecord<Type> = Type extends User ? NewUser : (Type extends Todo ? NewTodo : (never));

    type UUID = string;

    class ConditionBuildable<table extends TableName, T extends ConditionBuildable<table, T>> {
        conditionBuildableType: table;

        where<column extends keyof IHPRecord<table>>(column: column, value: IHPRecord<table>[column]): T;
        where(conditionBuilder: ConditionBuilder<table>): T;
        where(filterRecord: Partial<IHPRecord<table>>): T;
        filterWhere<column extends keyof IHPRecord<table>>(column: column, value: IHPRecord<table>[column]): T;
        whereNot<column extends keyof IHPRecord<table>>(column: column, value: IHPRecord<table>[column]): T;
        whereLessThan<column extends keyof IHPRecord<table>>(column: column, value: IHPRecord<table>[column]): T;
        whereLessThanOrEqual<column extends keyof IHPRecord<table>>(column: column, value: IHPRecord<table>[column]): T;
        whereGreaterThan<column extends keyof IHPRecord<table>>(column: column, value: IHPRecord<table>[column]): T;
        whereGreaterThanOrEqual<column extends keyof IHPRecord<table>>(column: column, value: IHPRecord<table>[column]): T;

        or (...conditionBuilder: ConditionBuilder<table>[]): T;
        and(...conditionBuilder: ConditionBuilder<table>[]): T;

        whereIn<column extends keyof IHPRecord<table>>(column: column, value: Array<IHPRecord<table>[column]>): T;
    }

    class ConditionBuilder<table extends TableName> extends ConditionBuildable<table, ConditionBuilder<table>> {}

    function or <table extends TableName>(   conditions: ConditionBuilder<table>[]): ConditionBuilder<table>;
    function or <table extends TableName>(...conditions: ConditionBuilder<table>[]): ConditionBuilder<table>;
    function and<table extends TableName>(   conditions: ConditionBuilder<table>[]): ConditionBuilder<table>;
    function and<table extends TableName>(...conditions: ConditionBuilder<table>[]): ConditionBuilder<table>;

    class QueryBuilder<table extends TableName, result extends {}> extends ConditionBuildable<table, QueryBuilder<table, result>> {
        query: Query;

        select<column extends keyof IHPRecord<table>>(columns: column[]): QueryBuilder<table, (result extends IHPRecord<table> ? {} : result) & Pick<IHPRecord<table>, column>>;
        select<column extends keyof IHPRecord<table>>(...columns: column[]): QueryBuilder<table, (result extends IHPRecord<table> ? {} : result) & Pick<IHPRecord<table>, column>>;

        whereTextSearchStartsWith<column extends keyof IHPRecord<table>, value extends IHPRecord<table>[column] & string>(column: column, value: value): QueryBuilder<table, result>;

        orderBy(column: keyof IHPRecord<table>): QueryBuilder<table, result>;
        orderByAsc(column: keyof IHPRecord<table>): QueryBuilder<table, result>;
        orderByDesc(column: keyof IHPRecord<table>): QueryBuilder<table, result>;
        limit(limit: number): QueryBuilder<table, result>;
        offset(limit: number): QueryBuilder<table, result>;

        fetch(): Promise<Array<result>>;
        fetchOne(): Promise<result>;
        subscribe(subscribe: (value: Array<result>) => void): (() => void);
    }
 
    function where(conditionBuilder: ConditionBuilder<'users'>): ConditionBuilder<'users'>;
    function where(filterRecord: Partial<User>)                : ConditionBuilder<'users'>;
    function where             <column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function filterWhere       <column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function eq                <column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function notEq             <column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function lessThan          <column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function lessThanOrEqual   <column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function greaterThan       <column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function greaterThanOrEqual<column extends keyof User>(column: column, value: User[column]): ConditionBuilder<'users'>;
    function where(conditionBuilder: ConditionBuilder<'todos'>): ConditionBuilder<'todos'>;
    function where(filterRecord: Partial<Todo>)                : ConditionBuilder<'todos'>;
    function where             <column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;
    function filterWhere       <column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;
    function eq                <column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;
    function notEq             <column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;
    function lessThan          <column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;
    function lessThanOrEqual   <column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;
    function greaterThan       <column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;
    function greaterThanOrEqual<column extends keyof Todo>(column: column, value: Todo[column]): ConditionBuilder<'todos'>;

    interface Query<table extends TableName, result> {
        table: table;
    }
    
    /**
     * Returns a new database query builder.
     * 
     * @example
     * const tasks = await query('tasks')
     *     .orderBy('createdAt')
     *     .limit(10)
     *     .fetch();
     * 
     * @param {string} table The name of one of your project's table.
     */
    function query<table extends TableName>(table: table): QueryBuilder<table, IHPRecord<table>>;
    function query<table extends TableName, column extends keyof IHPRecord<table>>(table: table, columns: column[]): QueryBuilder<table, Pick<IHPRecord<table>, column>>;

    class DataSubscription<table extends TableName, record> {
        isClosed: boolean;
        isConnected: boolean;

        constructor(query: Query<table, record>);
        createOnServer(): Promise<void>;
        close(): Promise<void>;
        closeIfNotUsed(): Promise<void>;
        getRecords(): Array<object>;
        subscribe(subscribe: (value: Array<record>) => void): (() => void);
    }

    function initThinBackend(options: { host: string | undefined; }): void;

    /**
     * Creates a row inside a database table. Returns a promise of the newly created object.
     * 
     * @example
     * const task = await createRecord('tasks', {
     *     title: 'Hello World',
     *     userId: getCurrentUserId()
     * })
     * @param {string} tableName The name of one of your project's table.
     * @param {object} record An object representing the row to be inserted. Columns with a database-side default value don't need to be specified.
     * @see {@link createRecords} You can use `createRecords` to batch insert multiple records in an efficient way
     */
    function createRecord<table extends TableName>(tableName: table, record: NewRecord<IHPRecord<table>>): Promise<IHPRecord<table>>;

    /**
     * Updates a row inside a database table. Returns a promise of the updated row.
     * 
     * @example
     * updateRecord('tasks', task.id, {
     *     isCompleted: true
     * })
     * @param {string} tableName The name of one of your project's table
     * @param {UUID} id The id of the row to be updated
     * @param {object} patch An patch object representing the changed values.
     */
    function updateRecord<table extends TableName>(tableName: table, id: UUID, patch: Partial<NewRecord<IHPRecord<table>>>): Promise<IHPRecord<table>>;

    /**
     * Updates multiple rows inside a database table. Returns a promise of the updated rows.
     * 
     * @example
     * const taskIds = tasks.map(taks => task.id);
     * updateRecords('tasks', taskIds, {
     *     isCompleted: true
     * })
     * @param {string} tableName The name of one of your project's table
     * @param {Array<UUID>} ids The ids of the rows to be updated
     * @param {object} patch An patch object representing the changed values.
     */
    function updateRecords<table extends TableName>(tableName: table, ids: Array<UUID>, patch: Partial<NewRecord<IHPRecord<table>>>): Promise<Array<IHPRecord<table>>>;

    /**
     * Deletes a row inside a database table.
     * 
     * @example
     * deleteRecord('tasks', task.id)
     * @param {string} tableName The name of one of your project's table
     * @param {UUID} id The id of the row to be deleted
     */
    function deleteRecord<table extends TableName>(tableName: table, id: UUID): Promise<void>;

    /**
     * Deletes multiple rows inside a database table.
     * 
     * @example
     * const taskIds = tasks.map(task => task.id)
     * deleteRecords('tasks', taskIds)
     * @param {string} tableName The name of one of your project's table
     * @param {Array<UUID>} ids The ids of the rows to be deleted
     */
    function deleteRecords<table extends TableName>(tableName: table, ids: Array<UUID>): Promise<void>;

    /**
     * Creates multiple rows inside a database table in a single INSERT query. Returns a promise of the newly created objects.
     * 
     * @example
     * const tasksToCreate = [];
     * 
     * // Make 10 task objects, but don't insert them to the DB yet
     * for (let i = 0; i < 10; i++) {
     *     tasksToCreate.push({
     *         title: `Task ${i}`,
     *         userId: getCurrentUserId()
     *     });
     * }
     * 
     * // Insert the 10 tasks
     * const tasks = await createRecords('tasks', tasksToCreate)
     * @param {string} tableName The name of one of your project's table.
     * @param {object} records An array representing the rows to be inserted.
     */
    function createRecords<table extends TableName>(tableName: table, records: Array<NewRecord<IHPRecord<table>>>): Promise<Array<IHPRecord<table>>>;

    function getCurrentUserId(): string;
    function getCurrentUser(): Promise<User | null>;

    interface LogoutOptions {
        redirect?: string;
    }

    function logout(options?: LogoutOptions): Promise<void>;
    
    /**
     * Useful to implement a login button. Redirects the user to the login page.
     *
     * The returned promise never resolves, as the browser is redirected to a different page.
     * 
     * @example
     * import { loginWithRedirect } from 'ihp-datasync';
     * function LoginButton() {
     *      const isLoading = useState(false);
     *
     *      const doLogin = async () => {
     *          setLoading(true);
     *          await loginWithRedirect();
     *          setLoading(false);
     *      }
     *
     *      return <button onClick={doLogin} disabled={isLoading}>Login</button>
     * }
     */    
    function loginWithRedirect(): Promise<void>;
    function ensureIsUser(): Promise<void>;
    function initAuth(): Promise<void>;

    class Transaction {
        public transactionId: UUID | null;

        start(): Promise<void>;
        commit(): Promise<void>;
        rollback(): Promise<void>;
    
        query<table extends TableName>(table: table): QueryBuilder<table, IHPRecord<table>>;
        query<table extends TableName, column extends keyof IHPRecord<table>>(table: table, columns: column[]): QueryBuilder<table, Pick<IHPRecord<table>, column>>;
    
        createRecord<table extends TableName>(tableName: table, record: NewRecord<IHPRecord<table>>): Promise<IHPRecord<table>>;
        createRecords<table extends TableName>(tableName: table, records: Array<NewRecord<IHPRecord<table>>>): Promise<Array<IHPRecord<table>>>;
        updateRecord<table extends TableName>(tableName: table, id: UUID, patch: Partial<NewRecord<IHPRecord<table>>>): Promise<IHPRecord<table>>;
        updateRecords<table extends TableName>(tableName: table, ids: Array<UUID>, patch: Partial<NewRecord<IHPRecord<table>>>): Promise<Array<IHPRecord<table>>>;
        deleteRecord<table extends TableName>(tableName: table, id: UUID): Promise<void>;
        deleteRecords<table extends TableName>(tableName: table, ids: Array<UUID>): Promise<void>;
    }

    function withTransaction<returnValue>(callback: ((transaction: Transaction) => Promise<returnValue>) ): Promise<returnValue>;

    const enum NewRecordBehaviour {
        APPEND_NEW_RECORD = 0,
        PREPEND_NEW_RECORD = 1
    }
    interface DataSubscriptionOptions {
        /** When you add a new record, you might want the new record to be always displayed at the start of the list for UX reasons, ignoring any sort behaviour specified in the order by of the database query. */
        newRecordBehaviour: NewRecordBehaviour; 
    }
}

declare module 'ihp-datasync/react' {
    import { TableName, QueryBuilder, User, DataSubscriptionOptions } from 'ihp-datasync';

    /**
     * React hook for querying the database and streaming results in real-time
     * 
     * @example
     * function TasksList() {
     *      const tasks = useQuery(query('tasks').orderBy('createdAt'))
     *      
     *      return <div>
     *          {tasks.map(task => <div>{task.title}</div>)}
     *      </div>
     * }
     * 
     * @param {QueryBuilder<table, result>} queryBuilder A database query
     */
    function useQuery<table extends TableName, result>(queryBuilder: QueryBuilder<table, result>, options?: DataSubscriptionOptions): Array<result> | null;

    function useCount<table extends TableName>(queryBuilder: QueryBuilder<table, any>): number | null;

    /**
     * A version of `useQuery` when you only want to fetch a single record.
     * 
     * Automatically adds a `.limit(1)` to the query and returns the single result instead of a list.
     * 
     * @example
     * const message = useQuerySingleresult(query('messages').filterWhere('id', '1f290b39-c6d1-4dff-8404-0581f470253c'));
     */
    function useQuerySingleResult<table extends TableName, result>(queryBuilder: QueryBuilder<table, result>): result | null;

    function useCurrentUser(): User | null;
    
    /**
     * Returns true if there's a user logged in. Returns false if there's no logged in user. Returns null if loading.
     * 
     * @example
     * const isLoggedIn = useIsLoggedIn();
     */
    function useIsLoggedIn(): boolean | null;

    /**
     * Returns true if the frontend is online and connected to the server. Returns false if the internet connection is offline and not connected to the server.
     * 
     * @example
     * const isConnected = useIsConnected();
     */
    function useIsConnected(): boolean;

    interface ThinBackendProps {
        requireLogin?: boolean;
        children: JSX.Element[] | JSX.Element;
    }
    function ThinBackend(props: ThinBackendProps): JSX.Element;
}