const { execSync, spawn } = require('child_process');
const { existsSync } = require('fs');

console.log('🚀 Iniciando Kanban API...\n');

function execCommand(command, options = {}) {
  try {
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    return false;
  }
}

function execCommandSilent(command, options = {}) {
  try {
    execSync(command, { stdio: 'pipe', ...options });
    return true;
  } catch (error) {
    return false;
  }
}

function execCommandGetOutput(command, options = {}) {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe', ...options });
    return output.trim();
  } catch (error) {
    return '';
  }
}

function checkDocker() {
  console.log('🔍 Verificando Docker...');
  if (!execCommandSilent('docker info')) {
    console.error('❌ Docker não está rodando. Por favor, inicie o Docker primeiro.');
    process.exit(1);
  }
  console.log('✅ Docker está rodando\n');
}

function checkPort(port) {
  try {
    if (process.platform === 'win32') {
      const result = execCommandGetOutput(`netstat -ano | findstr :${port}`);
      return result.length > 0;
    } else {
      const result = execCommandGetOutput(`lsof -i :${port} || netstat -an | grep :${port}`);
      return result.length > 0;
    }
  } catch {
    return false;
  }
}

function checkContainerStatus() {
  try {
    const containerId = execCommandGetOutput('docker-compose ps -q postgres');
    if (!containerId) {
      return { exists: false, running: false };
    }
    
    const status = execCommandGetOutput(`docker ps --filter id=${containerId} --format "{{.Status}}"`);
    const isRunning = status.includes('Up');
    
    return { exists: true, running: isRunning, id: containerId };
  } catch {
    return { exists: false, running: false };
  }
}

function findProcessUsingPort(port) {
  try {
    if (process.platform === 'win32') {
      const result = execCommandGetOutput(`netstat -ano | findstr :${port}`);
      if (result) {
        const lines = result.split('\n').filter(l => l.trim());
        const pids = new Set();
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match) pids.add(match[1]);
        });
        return Array.from(pids);
      }
    } else {
      const result = execCommandGetOutput(`lsof -ti :${port}`);
      if (result) {
        return result.split('\n').filter(p => p.trim());
      }
    }
  } catch {}
  return [];
}

function startPostgres() {
  console.log('📦 Verificando PostgreSQL...');
  
  const containerStatus = checkContainerStatus();
  
  if (containerStatus.running) {
    console.log('✅ Container PostgreSQL já está rodando!\n');
    return true;
  }
  
  if (containerStatus.exists && !containerStatus.running) {
    console.log('🔄 Container existe mas está parado. Iniciando...');
    if (execCommand('docker-compose start postgres')) {
      console.log('✅ Container iniciado!\n');
      return true;
    }
  }
  
  if (checkPort(5432)) {
    console.log('⚠️  Porta 5432 já está em uso!');
    
    // Verificar se é um container Docker
    const dockerContainers = execCommandGetOutput('docker ps --format "{{.Ports}}" | findstr 5432');
    if (dockerContainers) {
      console.log('💡 Detectado container Docker na porta 5432');
      console.log('🛑 Parando containers Docker...\n');
      execCommandSilent('docker stop $(docker ps -q --filter "publish=5432")');
      execCommandSilent('docker-compose down');
      
      try {
        if (process.platform === 'win32') {
          execSync('timeout /t 3 /nobreak >nul', { stdio: 'ignore' });
        } else {
          execSync('sleep 3', { stdio: 'ignore' });
        }
      } catch {}
      
      if (!checkPort(5432)) {
        console.log('✅ Porta liberada! Continuando...\n');
      } else {
        console.log('⚠️  Porta ainda em uso. Verificando processo...\n');
      }
    }
    
    if (checkPort(5432)) {
      const pids = findProcessUsingPort(5432);
      console.log('❌ Porta 5432 está em uso por outro processo.');
      
      if (pids.length > 0) {
        console.log(`📋 Processos usando a porta: ${pids.join(', ')}`);
        if (process.platform === 'win32') {
          console.log('💡 Para ver detalhes: Get-Process -Id ' + pids[0]);
        }
      }
      
      console.log('\n💡 Soluções:');
      console.log('   1. Parar o PostgreSQL local (se instalado)');
      console.log('   2. Usar porta alternativa (5433):');
      console.log('      - Edite docker-compose.yml: mude "5432:5432" para "5433:5432"');
      console.log('      - Edite .env: POSTGRES_PORT=5433');
      console.log('   3. Verificar containers: docker ps -a | findstr postgres');
      console.log('   4. Parar tudo: docker-compose down\n');
      
      // Tentar usar porta alternativa automaticamente
      console.log('🔄 Tentando usar porta alternativa 5433...\n');
      return tryAlternativePort(5433);
    }
  }
  
  console.log('📦 Subindo PostgreSQL...');
  if (!execCommand('docker-compose up -d')) {
    console.error('❌ Erro ao subir PostgreSQL');
    return false;
  }
  console.log('✅ PostgreSQL iniciado\n');
  return true;
}

function tryAlternativePort(port) {
  console.log(`📦 Tentando subir PostgreSQL na porta ${port}...`);
  console.log('⚠️  ATENÇÃO: Você precisa atualizar o .env com POSTGRES_PORT=' + port);
  console.log('⚠️  E atualizar docker-compose.yml para mapear a porta ' + port + '\n');
  
  // Verificar se a porta alternativa está livre
  if (checkPort(port)) {
    console.log(`❌ Porta ${port} também está em uso.\n`);
    return false;
  }
  
  console.log(`✅ Porta ${port} está livre, mas você precisa configurar manualmente.\n`);
  return false;
}

function waitForPostgres() {
  console.log('⏳ Aguardando PostgreSQL estar pronto...');
  const maxAttempts = 30;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      execSync('docker-compose exec -T postgres pg_isready -U kanban_user', {
        stdio: 'ignore',
      });
      console.log('✅ PostgreSQL está pronto!\n');
      
      // Aguardar mais um pouco para garantir que está totalmente pronto
      try {
        if (process.platform === 'win32') {
          execSync('timeout /t 2 /nobreak >nul', { stdio: 'ignore' });
        } else {
          execSync('sleep 2', { stdio: 'ignore' });
        }
      } catch {}
      
      return true;
    } catch {
      attempt++;
      process.stdout.write(`   Tentativa ${attempt}/${maxAttempts}...\r`);
      try {
        if (process.platform === 'win32') {
          execSync('timeout /t 2 /nobreak >nul', { stdio: 'ignore' });
        } else {
          execSync('sleep 2', { stdio: 'ignore' });
        }
      } catch {}
    }
  }

  console.error('\n❌ PostgreSQL não ficou pronto a tempo');
  console.error('💡 Verifique o container: docker-compose logs postgres');
  return false;
}

function checkEnvFile() {
  if (!existsSync('.env')) {
    console.log('⚠️  Arquivo .env não encontrado!');
    console.log('💡 Criando .env a partir do .env.example...\n');
    
    if (existsSync('.env.example')) {
      try {
        const fs = require('fs');
        fs.copyFileSync('.env.example', '.env');
        console.log('✅ Arquivo .env criado!\n');
      } catch (error) {
        console.error('❌ Erro ao criar .env:', error.message);
        console.log('💡 Copie manualmente: copy .env.example .env\n');
      }
    } else {
      console.log('❌ .env.example não encontrado');
      console.log('💡 Crie um arquivo .env com as variáveis do PostgreSQL\n');
    }
  }
}

function runMigrations() {
  console.log('🗄️  Rodando migrations...');
  if (!execCommand('npm run db:migrate')) {
    console.error('❌ Erro ao rodar migrations');
    console.error('💡 Verifique se o PostgreSQL está acessível');
    process.exit(1);
  }
  console.log('✅ Migrations concluídas!\n');
}

function startServer() {
  console.log('🚀 Iniciando servidor...\n');
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
  });

  server.on('close', (code) => {
    console.log(`\n🛑 Servidor encerrado com código ${code}`);
    process.exit(code);
  });

  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando...');
    server.kill();
    process.exit(0);
  });
}

// Executar tudo
async function main() {
  checkDocker();
  checkEnvFile();
  
  if (!startPostgres()) {
    console.log('\n💡 Dica: Se você tem PostgreSQL instalado localmente,');
    console.log('   pare o serviço ou use uma porta alternativa.\n');
    process.exit(1);
  }
  
  if (!waitForPostgres()) {
    process.exit(1);
  }
  
  runMigrations();
  startServer();
}

main();
