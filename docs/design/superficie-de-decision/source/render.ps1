param([string]$name,[int]$w,[int]$h,[double]$scale=1.5)
$edge="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$dir=$PSScriptRoot
$src="file:///"+($dir -replace '\\','/')+"/$name.html"
$out=Join-Path $dir "$name.png"
if(Test-Path $out){Remove-Item $out -Force}
& $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=$scale --window-size="$w,$h" --virtual-time-budget=12000 --screenshot="$out" $src | Out-Null
Start-Sleep -Milliseconds 500
if(Test-Path $out){"OK $out $((Get-Item $out).Length)"}else{"FAILED"}
