@echo off
title App Bem Estar - Configuracao Inicial
color 0B

echo ========================================
echo    APP BEM ESTAR - SETUP INICIAL
echo    Execute isso apenas UMA VEZ
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERRO: Node.js nao esta instalado!
    echo.
    echo Baixe em: https://nodejs.org/
    echo Instale e depois execute este script novamente.
    echo.
    pause
    exit
)
echo      Node.js encontrado!
node -v
echo.

echo [2/5] Instalando dependencias...
echo      Isso pode demorar alguns minutos...
call npm install
echo.
echo      Dependencias instaladas!
echo.

echo [3/5] Gerando cliente Prisma...
call npx prisma generate
echo.

echo [4/5] Sincronizando banco de dados...
call npx prisma db push
echo.

echo [5/5] Populando banco com dados iniciais...
call npx tsx prisma/seed.ts
echo.

color 0A
echo ========================================
echo    CONFIGURACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Agora voce pode usar o arquivo:
echo    RODAR_SERVIDOR.bat
echo.
echo Para iniciar o servidor sempre que precisar.
echo.
pause
