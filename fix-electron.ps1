$ErrorActionPreference = 'Stop'

Write-Host 'Removing broken Electron package...'
Remove-Item -Recurse -Force '.\node_modules\electron' -ErrorAction SilentlyContinue

Write-Host 'Clearing Electron download cache...'
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\electron\Cache" -ErrorAction SilentlyContinue

Write-Host 'Reinstalling dependencies...'
npm install

Write-Host 'Verifying Electron...'
node -e "console.log(require('electron'))"

Write-Host 'Starting Quasar Electron...'
quasar dev -m electron
