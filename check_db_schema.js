const sql = require('./config/db.js');

async function checkSchema() {
    try {
        const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
        console.log('Tables in DB:', tables.map(t => t.table_name));

        for (const table of tables) {
            const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = ${table.table_name}
        ORDER BY ordinal_position;
      `;
            console.log(`\n--- Schema for ${table.table_name} ---`);
            columns.forEach(col => {
                console.log(`${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
            });
        }
    } catch (err) {
        console.error('Error fetching schema:', err);
    } finally {
        process.exit();
    }
}

checkSchema();
