# Verifica se uma mensagem de commit foi fornecida
param (
    [string]$commitMessage = "Atualização automática do código"
)

# Adiciona todas as mudanças ao staging
git add .

# Faz o commit com a mensagem fornecida
git commit -m $commitMessage

# Executa o build
npm run build

# Verifica se o build foi bem-sucedido
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build falhou. Push cancelado."
    exit 1
}

# Faz o push para o repositório remoto
git push origin main
