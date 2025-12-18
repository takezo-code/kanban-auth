# Script para ajudar a resolver conflito de porta

Write-Host "🔍 Diagnosticando porta 5432..." -ForegroundColor Cyan
Write-Host ""

# Verificar processos na porta
$connections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue

if ($connections) {
    Write-Host "📋 Processos usando a porta 5432:" -ForegroundColor Yellow
    foreach ($conn in $connections) {
        $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   PID: $($conn.OwningProcess) - $($process.ProcessName) - $($process.Path)" -ForegroundColor White
        }
    }
    Write-Host ""
    
    # Verificar se é PostgreSQL local
    $postgresProcesses = $connections | Where-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        $proc -and ($proc.ProcessName -like "*postgres*" -or $proc.Path -like "*postgres*")
    }
    
    if ($postgresProcesses) {
        Write-Host "⚠️  PostgreSQL local detectado!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 Opções:" -ForegroundColor Cyan
        Write-Host "   1. Parar serviço PostgreSQL local:"
        Write-Host "      Stop-Service postgresql-x64-*" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   2. Usar porta alternativa (5433):"
        Write-Host "      - Edite docker-compose.yml"
        Write-Host "      - Mude '5432:5432' para '5433:5432'"
        Write-Host "      - Edite .env: POSTGRES_PORT=5433"
        Write-Host ""
    }
} else {
    Write-Host "✅ Porta 5432 está livre!" -ForegroundColor Green
}

# Verificar containers Docker
Write-Host "🐳 Verificando containers Docker..." -ForegroundColor Cyan
$containers = docker ps -a --filter "name=postgres" --format "{{.Names}} - {{.Status}}" 2>&1

if ($containers -and -not ($containers -match "error")) {
    Write-Host "📦 Containers encontrados:" -ForegroundColor Yellow
    $containers | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
    Write-Host ""
    Write-Host "💡 Para parar todos: docker-compose down" -ForegroundColor Cyan
} else {
    Write-Host "✅ Nenhum container PostgreSQL encontrado" -ForegroundColor Green
}

Write-Host ""

