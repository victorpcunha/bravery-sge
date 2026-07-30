const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wfxmmwmxmantgzydusnw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  const tables = ['schools', 'teachers', 'classrooms', 'people', 'managers', 'classroom_teachers', 'enrollments', 'user_schools'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`${table}: ${error ? '❌ ' + error.message : '✅ OK'}`);
  }
}

checkTables().catch(console.error);