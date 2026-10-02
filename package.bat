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
copy /y "%ZIP%" "%SRC%CanvasCustomizer.zip" >nul

robocopy "%SRC%." "%SRC%..\CanvasCustomizer (1)1" /E /XD .git screenshots server /XF CanvasCustomizer.zip >nul
robocopy "%SRC%." "%SRC%..\CanvasCustomizer1" /E /XD .git screenshots server /XF CanvasCustomizer.zip >nul
echo [SYNC] Updated unpacked extension folders ready to reload in Chrome

rd /s /q "%DIST%"
echo.
echo [DONE] Clean package ready at: %ZIP% and %SRC%CanvasCustomizer.zip
