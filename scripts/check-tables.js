const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. Never hardcode keys in source.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function checkTables() {
  const tables = ['schools', 'teachers', 'classrooms', 'people', 'managers', 'classroom_teachers', 'enrollments', 'user_schools'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`${table}: ${error ? '❌ ' + error.message : '✅ OK'}`);
  }
}

checkTables().catch(console.error);