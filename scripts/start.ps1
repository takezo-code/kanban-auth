# Script PowerShell para iniciar tudo de uma vez

Write-Host "🚀 Iniciando Kanban API..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está rodando
try {
    docker info | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando. Por favor, inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar status do container
function Get-ContainerStatus {
    try {
        $containerId = docker-compose ps -q postgres 2>&1
        if (-not $containerId -or $containerId -match "Error") {
            return @{ Exists = $false; Running = $false }
        }
        
        $status = docker ps --filter "id=$containerId" --format "{{.Status}}" 2>&1
        $isRunning = $status -match "Up"
        
        return @{ Exists = $true; Running = $isRunning; Id = $containerId }
    } catch {
        return @{ Exists = $false; Running = $false }
    }
}

function Test-Port {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $null -ne $connection
    } catch {
        return $false
    }
}

function Start-Postgres {
    Write-Host "📦 Verificando PostgreSQL..." -ForegroundColor Yellow
    
    $containerStatus = Get-ContainerStatus
    
    if ($containerStatus.Running) {
        Write-Host "✅ Container PostgreSQL já está rodando!" -ForegroundColor Green
        Write-Host ""
        return $true
    }
    
    if ($containerStatus.Exists -and -not $containerStatus.Running) {
        Write-Host "🔄 Container existe mas está parado. Iniciando..." -ForegroundColor Yellow
        docker-compose start postgres
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Container iniciado!" -ForegroundColor Green
            Write-Host ""
            return $true
        }
    }
    
    if (Test-Port -Port 5432) {
        Write-Host "⚠️  Porta 5432 já está em uso!" -ForegroundColor Yellow
        Write-Host "💡 Verificando se é nosso container..." -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "🛑 Parando containers antigos..." -ForegroundColor Yellow
        docker-compose down | Out-Null
        Start-Sleep -Seconds 2
        
        if (-not (Test-Port -Port 5432)) {
            Write-Host "✅ Porta liberada! Subindo PostgreSQL..." -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "❌ Porta ainda está em uso por outro processo." -ForegroundColor Red
            Write-Host "💡 Opções:" -ForegroundColor Cyan
            Write-Host "   1. Parar o serviço que está usando a porta 5432"
            Write-Host "   2. Usar outra porta (edite docker-compose.yml e .env)"
            Write-Host "   3. Verificar: docker ps -a | Select-String postgres"
            Write-Host ""
            return $false
        }
    }
    
    Write-Host "📦 Subindo PostgreSQL..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao subir PostgreSQL" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ PostgreSQL iniciado" -ForegroundColor Green
    Write-Host ""
    return $true
}

function Wait-ForPostgres {
    Write-Host "⏳ Aguardando PostgreSQL estar pronto..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0
    $ready = $false

    while ($attempt -lt $maxAttempts -and -not $ready) {
        try {
            $result = docker-compose exec -T postgres pg_isready -U kanban_user 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ PostgreSQL está pronto!" -ForegroundColor Green
                Write-Host ""
                $ready = $true
                break
            }
        } catch {
            # Continua tentando
        }
        
        $attempt++
        Write-Host "   Tentativa $attempt/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }

    if (-not $ready) {
        Write-Host "❌ PostgreSQL não ficou pronto a tempo" -ForegroundColor Red
        return $false
    }
    
    return $true
}

function Start-Migrations {
    Write-Host "🗄️  Rodando migrations..." -ForegroundColor Yellow
    npm run db:migrate

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao rodar migrations" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Migrations concluídas!" -ForegroundColor Green
    Write-Host ""
}

function Start-Server {
    Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
    Write-Host ""
    
    npm run dev
}

# Executar tudo
try {
    if (-not (Start-Postgres)) {
        exit 1
    }
    
    if (-not (Wait-ForPostgres)) {
        exit 1
    }
    
    Start-Migrations
    Start-Server
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    exit 1
}
