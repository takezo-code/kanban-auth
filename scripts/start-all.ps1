# Script PowerShell para iniciar tudo de uma vez

Write-Host "🚀 Iniciando Kanban completo (Backend + Frontend)..." -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
try {
    docker info | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando. Por favor, inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar status do backend
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

function Start-Backend {
    Write-Host "📦 Verificando Backend..." -ForegroundColor Yellow
    
    $containerStatus = Get-ContainerStatus
    
    if ($containerStatus.Running) {
        Write-Host "✅ Backend já está rodando!" -ForegroundColor Green
        Write-Host ""
        return $true
    }
    
    if ($containerStatus.Exists -and -not $containerStatus.Running) {
        Write-Host "🔄 Container existe mas está parado. Iniciando..." -ForegroundColor Yellow
        docker-compose start | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend iniciado!" -ForegroundColor Green
            Write-Host ""
            return $true
        }
    }
    
    Write-Host "📦 Subindo Backend (PostgreSQL + API)..." -ForegroundColor Yellow
    docker-compose up -d --build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao subir backend" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Backend iniciado" -ForegroundColor Green
    Write-Host ""
    return $true
}

function Wait-ForBackend {
    Write-Host "⏳ Aguardando Backend estar pronto..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0
    $ready = $false

    while ($attempt -lt $maxAttempts -and -not $ready) {
        try {
            $result = docker-compose exec -T postgres pg_isready -U kanban_user 2>&1
            if ($LASTEXITCODE -eq 0) {
                Start-Sleep -Seconds 3
                
                try {
                    $health = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
                    if ($health.StatusCode -eq 200) {
                        $content = $health.Content | ConvertFrom-Json
                        if ($content.status -eq "ok") {
                            Write-Host "✅ Backend está pronto!" -ForegroundColor Green
                            Write-Host ""
                            $ready = $true
                            break
                        }
                    }
                } catch {
                    # Continua tentando
                }
            }
        } catch {
            # Continua tentando
        }
        
        $attempt++
        Write-Host "   Tentativa $attempt/$maxAttempts..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }

    if (-not $ready) {
        Write-Host "⚠️  Backend pode não estar totalmente pronto, mas continuando..." -ForegroundColor Yellow
        Write-Host ""
    }
    
    return $true
}

function Start-Frontend {
    $frontendPath = Join-Path $PSScriptRoot "..\frontend"
    
    if (-not (Test-Path $frontendPath)) {
        Write-Host "❌ Pasta frontend não encontrada!" -ForegroundColor Red
        return $null
    }

    Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📱 Frontend estará disponível em: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Pressione Ctrl+C para parar tudo" -ForegroundColor Yellow
    Write-Host ""
    
    $process = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $frontendPath -NoNewWindow -PassThru
    
    return $process
}

# Executar tudo
try {
    if (-not (Start-Backend)) {
        exit 1
    }
    
    Wait-ForBackend
    
    $frontendProcess = Start-Frontend
    
    Write-Host ""
    Write-Host "✅ Tudo rodando!" -ForegroundColor Green
    Write-Host "   Backend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "   Swagger: http://localhost:3000/api-docs" -ForegroundColor Cyan
    Write-Host ""
    
    # Aguardar indefinidamente
    if ($frontendProcess) {
        $frontendProcess.WaitForExit()
    }
    
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    if ($frontendProcess) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    exit 1
}

