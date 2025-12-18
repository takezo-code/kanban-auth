import { AuthRepository } from '../src/repositories/auth.repository';
import { HashUtil } from '../src/utils/hash.util';
import { USER_ROLES } from '../src/constants/roles.constants';
import { initDatabase, closeDatabase } from '../src/shared/database/connection';

async function createAdmin() {
  try {
    await initDatabase();
    console.log('✅ Banco de dados conectado\n');

    const args = process.argv.slice(2);
    
    if (args.length < 3) {
      console.log('📝 Uso: npm run create:admin <nome> <email> <senha>');
      console.log('\nExemplo:');
      console.log('  npm run create:admin "Admin User" admin@test.com senha123\n');
      process.exit(1);
    }

    const [name, email, password] = args;

    if (password.length < 6) {
      console.error('❌ Erro: Senha deve ter no mínimo 6 caracteres');
      process.exit(1);
    }

    const authRepository = new AuthRepository();
    
    // Verificar se já existe
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      console.error(`❌ Erro: Email ${email} já está cadastrado`);
      process.exit(1);
    }

    // Criar admin
    const passwordHash = await HashUtil.hash(password);
    const user = await authRepository.createUser(
      name,
      email,
      passwordHash,
      USER_ROLES.ADMIN
    );

    console.log('✅ Admin criado com sucesso!\n');
    console.log('📋 Detalhes:');
    console.log(`   Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user.id}\n`);
    console.log('🔐 Você pode fazer login com essas credenciais\n');

    await closeDatabase();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao criar admin:', error.message);
    await closeDatabase();
    process.exit(1);
  }
}

createAdmin();

