$node = "C:\Users\earth\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if (-not (Test-Path $node)) {
  $node = "node"
}

$env:HOST = "0.0.0.0"
if (-not $env:PORT) {
  foreach ($candidate in @(3010, 3017, 3020, 3021, 3022, 3023, 3024, 3025)) {
    $inUse = netstat -ano | Select-String -Pattern ":$candidate\s+.*LISTENING"
    if (-not $inUse) {
      $env:PORT = "$candidate"
      break
    }
  }
  if (-not $env:PORT) {
    $env:PORT = "3030"
  }
}

Start-Process "http://localhost:$env:PORT/phone"
& $node server.js
