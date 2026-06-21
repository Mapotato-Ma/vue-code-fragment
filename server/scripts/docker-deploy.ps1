# UTF-8 BOM: 避免 Windows PowerShell 5.1 下中文与引号解析异常
$ErrorActionPreference = 'Stop'
$serverRoot = Split-Path -Parent $PSScriptRoot
Set-Location $serverRoot

$envFile = Join-Path $serverRoot '.env.docker.deploy'
if (-not (Test-Path $envFile)) {
  Write-Error "Missing $envFile - copy .env.docker.deploy.example to .env.docker.deploy"
}

Get-Content -LiteralPath $envFile -Encoding utf8 | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith('#')) { return }
  $i = $line.IndexOf('=')
  if ($i -lt 1) { return }
  $key = $line.Substring(0, $i).Trim()
  $val = $line.Substring($i + 1).Trim()
  [Environment]::SetEnvironmentVariable($key, $val, 'Process')
}

$deployHost = $env:DEPLOY_HOST
$deployUser = $env:DEPLOY_USER
$remoteDir = $env:REMOTE_DIR
$containerName = if ($env:CONTAINER_NAME) { $env:CONTAINER_NAME } else { 'mapotato-api' }
$hostPort = if ($env:HOST_PORT) { $env:HOST_PORT } else { '3638' }
$dataVol = if ($env:DATA_VOLUME_HOST) { $env:DATA_VOLUME_HOST.Trim() } else { '' }

if (-not $deployHost) { Write-Error 'Set DEPLOY_HOST in .env.docker.deploy' }
if (-not $remoteDir) { Write-Error 'Set REMOTE_DIR in .env.docker.deploy' }

$remote = if ($deployUser) { "${deployUser}@${deployHost}" } else { $deployHost }
$tarName = 'mapotato-api.tar'
$tarLocal = Join-Path $serverRoot $tarName
$remoteSh = '/tmp/mapotato-docker-deploy-{0}.sh' -f [Guid]::NewGuid().ToString('N')

Write-Host '>>> docker version ...'
docker version | Out-Null

Write-Host '>>> docker build mapotato-api:local ...'
docker build -t mapotato-api:local .

Write-Host '>>> docker save ->' $tarLocal
if (Test-Path $tarLocal) { Remove-Item -Force $tarLocal }
docker save mapotato-api:local -o $tarName

Write-Host ('>>> ssh mkdir {0}' -f $remoteDir)
ssh $remote ('mkdir -p ''{0}''' -f $remoteDir)

Write-Host '>>> scp tar ...'
scp $tarLocal ('{0}:{1}/' -f $remote, $remoteDir)

$runCmd = 'docker run -d --name ''{0}'' --restart unless-stopped -p {1}:3638' -f $containerName, $hostPort
$logsDir = '{0}/logs' -f $remoteDir.TrimEnd('/')
if ($dataVol) {
  $runCmd += (' -v ''{0}'':/app/data:ro' -f $dataVol)
}
$runCmd += (' -v ''{0}'':/app/logs' -f $logsDir)
$runCmd += ' mapotato-api:local'

$loadPath = '{0}/{1}' -f $remoteDir.TrimEnd('/'), $tarName
$shLines = @(
  '#!/bin/bash',
  'set -euo pipefail',
  ('mkdir -p ''{0}''' -f $remoteDir),
  ('mkdir -p ''{0}''' -f $logsDir),
  ('chown 1000:1000 ''{0}''' -f $logsDir),
  ('cd ''{0}''' -f $remoteDir),
  ('docker load -i ''{0}''' -f $loadPath),
  ('docker stop ''{0}'' 2>/dev/null || true' -f $containerName),
  ('docker rm ''{0}'' 2>/dev/null || true' -f $containerName),
  $runCmd
)
$shContent = ($shLines -join "`n") + "`n"
$shLocal = Join-Path $env:TEMP 'mapotato-docker-deploy.sh'
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($shLocal, $shContent, $utf8NoBom)

Write-Host '>>> scp remote script + run ...'
scp $shLocal ('{0}:{1}' -f $remote, $remoteSh)
$remoteExec = 'chmod +x ''{0}'' && bash ''{0}'' && rm -f ''{0}''' -f $remoteSh
ssh $remote $remoteExec
Remove-Item -Force $shLocal

if ($env:KEEP_LOCAL_TAR -eq '1') {
  Write-Host ('>>> kept local tar (KEEP_LOCAL_TAR=1): {0}' -f $tarLocal)
} else {
  if (Test-Path $tarLocal) {
    Remove-Item -Force $tarLocal
    Write-Host ('>>> removed local {0}' -f $tarName)
  }
}

Write-Host ('>>> done. curl -s http://{0}:{1}/health' -f $deployHost, $hostPort)
