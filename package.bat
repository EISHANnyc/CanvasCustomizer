@echo off
setlocal
echo Packaging CanvasCustomizer for friends...
set "SRC=%~dp0"
set "ZIP=%SRC%..\CanvasCustomizer.zip"
set "DIST=%TEMP%\CanvasCustomizer_dist"

if exist "%ZIP%" del /f /q "%ZIP%"
if exist "%DIST%" rd /s /q "%DIST%"
mkdir "%DIST%"

copy /y "%SRC%manifest.json" "%DIST%\" >nul
xcopy /e /i /y "%SRC%content" "%DIST%\content" >nul
xcopy /e /i /y "%SRC%icons" "%DIST%\icons" >nul
xcopy /e /i /y "%SRC%popup" "%DIST%\popup" >nul
xcopy /e /i /y "%SRC%shared" "%DIST%\shared" >nul

powershell -NoProfile -Command "Compress-Archive -Path '%DIST%\*' -DestinationPath '%ZIP%' -Force"

rd /s /q "%DIST%"
echo.
echo [DONE] Clean package ready at: %ZIP%
pause
