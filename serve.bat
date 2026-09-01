@echo off
cd /d "%~dp0"
echo Starting local server on http://localhost:8000/
echo Press Ctrl+C to stop the server
echo.

REM Try PowerShell built-in HTTP server (Windows 10+)
powershell -NoProfile -Command "cd '%cd%'; $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Write-Host 'Server running on http://localhost:8000/ - Press Ctrl+C to stop'; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $file = $request.Url.LocalPath -replace '^/', ''; if ($file -eq '') { $file = 'index.html' }; $fullPath = Join-Path '%cd%' $file; if (Test-Path $fullPath) { [byte[]]$buffer = Get-Content -Path $fullPath -Encoding Byte; $response.ContentLength64 = $buffer.Length; $response.OutputStream.Write($buffer, 0, $buffer.Length) } else { $response.StatusCode = 404 }; $response.OutputStream.Close() }"
