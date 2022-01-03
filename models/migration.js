const { Client } = require('pg');

const client = new Client({
    host: '127.0.0.1',
    user: 'postgres',
    database: 'demo',
    password: '1',
    port: 5432,
});

const execute = async (query) => {
    try {
        await client.connect();     // gets connection
        await client.query(query);  // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end();         // closes connection
    }
};

const text = `
    CREATE TABLE IF NOT EXISTS "users" (
	    id                      SERIAL PRIMARY KEY,
	    name                    VARCHAR(255) NOT NULL,
	    email                   VARCHAR(255) NOT NULL,    
        password                TEXT NULL,
        created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		modified_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "social_networks" (
	    id                      SERIAL PRIMARY KEY,
	    user_id                 INTEGER NOT NULL REFERENCES users (id),
	    type                    VARCHAR(50) NOT NULL,    
        social_id               VARCHAR(255) NOT NULL,
        created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		modified_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    CREATE TABLE IF NOT EXISTS "notification_settings" (
        id                          SERIAL PRIMARY KEY,
        user_id                     INTEGER NOT NULL REFERENCES users (id),
	    is_enable                   BOOLEAN DEFAULT FALSE NOT NULL,
	    token                       VARCHAR(255) NOT NULL,
	    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		modified_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "products" (
	    id                      SERIAL PRIMARY KEY,
	    name                    VARCHAR(255) NOT NULL,
	    details                 TEXT NOT NULL,    
        delivery_fee            FLOAT NOT NULL,
        created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		modified_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS "user_product" (
        user_id                 INTEGER NOT NULL REFERENCES users (id),
	    product_id              INTEGER NOT NULL REFERENCES products (id),
        number                  INTEGER NOT NULL,
        status                  VARCHAR(50) NOT NULL,
	    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		modified_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
`;

execute(text).then(result => {
    if (result) {
        console.log('Table created');
    }
});