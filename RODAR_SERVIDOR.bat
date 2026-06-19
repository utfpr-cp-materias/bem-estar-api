@echo off
title App Bem Estar - Backend
color 0A

echo ========================================
echo    APP BEM ESTAR - INICIANDO SERVIDOR
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERRO: Node.js nao esta instalado!
    echo Baixe em: https://nodejs.org/
    pause
    exit
)
echo      Node.js OK!
echo.

echo [2/4] Verificando dependencias...
if not exist "node_modules" (
    echo      Instalando dependencias...
    npm install
)
echo      Dependencias OK!
echo.

echo [3/4] Gerando cliente Prisma...
call npx prisma generate >nul 2>&1
echo      Prisma OK!
echo.

echo [4/4] Iniciando servidor...
echo.
echo ========================================
echo    SERVIDOR INICIANDO...
echo    Acesse: http://localhost:3000
echo    Para parar: Ctrl + C
echo ========================================
echo.

npm run dev
