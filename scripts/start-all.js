const { execSync, spawn } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('🚀 Iniciando Kanban completo (Backend + Frontend)...\n');

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

function startBackend() {
  console.log('📦 Verificando Backend...');
  
  const containerStatus = checkContainerStatus();
  
  if (containerStatus.running) {
    console.log('✅ Backend já está rodando!\n');
    return true;
  }
  
  if (containerStatus.exists && !containerStatus.running) {
    console.log('🔄 Container existe mas está parado. Iniciando...');
    if (execCommand('docker-compose start')) {
      console.log('✅ Backend iniciado!\n');
      return true;
    }
  }
  
  console.log('📦 Subindo Backend (PostgreSQL + API)...');
  if (!execCommand('docker-compose up -d --build')) {
    console.error('❌ Erro ao subir backend');
    return false;
  }
  console.log('✅ Backend iniciado\n');
  return true;
}

async function waitForBackend() {
  console.log('⏳ Aguardando Backend estar pronto...');
  const maxAttempts = 30;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      execSync('docker-compose exec -T postgres pg_isready -U kanban_user', {
        stdio: 'ignore',
      });
      
      // Aguardar um pouco para API iniciar
      try {
        if (process.platform === 'win32') {
          execSync('timeout /t 3 /nobreak >nul', { stdio: 'ignore' });
        } else {
          execSync('sleep 3', { stdio: 'ignore' });
        }
      } catch {}
      
      // Testar API usando http module do Node
      try {
        const http = require('http');
        const testHealth = () => {
          return new Promise((resolve) => {
            const req = http.get('http://localhost:3000/health', (res) => {
              let data = '';
              res.on('data', (chunk) => { data += chunk; });
              res.on('end', () => {
                try {
                  const json = JSON.parse(data);
                  resolve(json.status === 'ok');
                } catch {
                  resolve(false);
                }
              });
            });
            req.on('error', () => resolve(false));
            req.setTimeout(2000, () => {
              req.destroy();
              resolve(false);
            });
          });
        };
        
        const isReady = await testHealth();
        if (isReady) {
          console.log('✅ Backend está pronto!\n');
          return true;
        }
      } catch {}
    } catch {
      // Continua tentando
    }
    
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

  console.log('\n⚠️  Backend pode não estar totalmente pronto, mas continuando...\n');
  return true;
}

function startFrontend() {
  const frontendPath = path.join(process.cwd(), 'frontend');
  
  if (!existsSync(frontendPath)) {
    console.error('❌ Pasta frontend não encontrada!');
    return false;
  }

  console.log('🎨 Iniciando Frontend...\n');
  console.log('📱 Frontend estará disponível em: http://localhost:5173\n');
  console.log('💡 Pressione Ctrl+C para parar tudo\n');
  
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: frontendPath,
    stdio: 'inherit',
    shell: true,
  });

  frontend.on('close', (code) => {
    console.log(`\n🛑 Frontend encerrado com código ${code}`);
  });

  return frontend;
}

function handleShutdown(processes) {
  const shutdown = () => {
    console.log('\n\n🛑 Encerrando tudo...');
    processes.forEach(proc => {
      if (proc && !proc.killed) {
        proc.kill();
      }
    });
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function main() {
  const processes = [];
  
  try {
    checkDocker();
    
    if (!startBackend()) {
      process.exit(1);
    }
    
    await waitForBackend();
    
    const frontend = startFrontend();
    if (frontend) {
      processes.push(frontend);
    }
    
    handleShutdown(processes);
    
    console.log('\n✅ Tudo rodando!');
    console.log('   Backend: http://localhost:3000');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Swagger: http://localhost:3000/api-docs\n');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    processes.forEach(proc => proc?.kill());
    process.exit(1);
  }
}

main();

