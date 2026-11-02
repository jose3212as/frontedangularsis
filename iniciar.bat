@echo off
title Frontend Angular 22 - CursosPro
echo ========================================================
echo   Iniciando Frontend Angular 22 (frontedangularsis)
echo ========================================================

set "SRC_DIR=%~dp0"
set "TARGET_DIR=C:\dev\cursos-frontend"

echo Sincronizando codigo fuente...
powershell -NoProfile -Command "Copy-Item -Path '%SRC_DIR%src\*' -Destination '%TARGET_DIR%\src' -Recurse -Force; Copy-Item -Path '%SRC_DIR%public\*' -Destination '%TARGET_DIR%\public' -Recurse -Force; Copy-Item -Path '%SRC_DIR%angular.json' -Destination '%TARGET_DIR%\' -Force; Copy-Item -Path '%SRC_DIR%package.json' -Destination '%TARGET_DIR%\' -Force; Copy-Item -Path '%SRC_DIR%tsconfig*.json' -Destination '%TARGET_DIR%\' -Force"

cd /d "%TARGET_DIR%"
set NG_CLI_ANALYTICS=false
echo.
echo ========================================================
echo   Servidor iniciado en http://localhost:4200
echo ========================================================
call npx ng serve --open
