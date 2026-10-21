#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando instalação do AutoComix...\n');

let hasErrors = false;

// Check Node.js version
console.log('📦 Verificando Node.js...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const major = parseInt(nodeVersion.split('.')[0].substring(1));
  if (major >= 16) {
    console.log(`   ✅ Node.js ${nodeVersion}`);
  } else {
    console.log(`   ❌ Node.js ${nodeVersion} (requer 16+)`);
    hasErrors = true;
  }
} catch (error) {
  console.log('   ❌ Node.js não encontrado');
  hasErrors = true;
}

// Check npm
console.log('\n📦 Verificando npm...');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`   ✅ npm ${npmVersion}`);
} catch (error) {
  console.log('   ❌ npm não encontrado');
  hasErrors = true;
}

// Check node_modules
console.log('\n📦 Verificando dependências...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules encontrado');
  
  // Check critical packages
  const criticalPackages = ['electron', 'react', 'react-dom', 'adm-zip'];
  criticalPackages.forEach(pkg => {
    const pkgPath = path.join('node_modules', pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`   ✅ ${pkg} instalado`);
    } else {
      console.log(`   ❌ ${pkg} não encontrado`);
      hasErrors = true;
    }
  });
} else {
  console.log('   ❌ node_modules não encontrado');
  console.log('   💡 Execute: npm install');
  hasErrors = true;
}

// Check Electron
console.log('\n🖥️  Verificando Electron...');
try {
  const electronPath = require.resolve('electron');
  console.log('   ✅ Electron instalado');
} catch (error) {
  console.log('   ❌ Electron não encontrado');
  console.log('   💡 Execute: npm install');
  hasErrors = true;
}

// Check build scripts
console.log('\n📜 Verificando scripts...');
const scripts = ['dev-electron.js', 'start-electron.js', 'build-electron.js'];
scripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`   ✅ ${script}`);
  } else {
    console.log(`   ❌ ${script} não encontrado`);
    hasErrors = true;
  }
});

// Check Electron files
console.log('\n📁 Verificando arquivos do Electron...');
const electronFiles = ['electron/main.js', 'electron/preload.js', 'electron/fileHandler.js'];
electronFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} não encontrado`);
    hasErrors = true;
  }
});

// Check optional dependencies
console.log('\n🔧 Verificando dependências opcionais...');

// Check unrar
try {
  execSync('unrar', { stdio: 'ignore' });
  console.log('   ✅ unrar instalado (suporte a CBR)');
} catch (error) {
  console.log('   ⚠️  unrar não encontrado (CBR não será suportado)');
  console.log('   💡 Instale: brew install unrar (macOS) ou apt-get install unrar (Linux)');
}

// Check 7z
try {
  execSync('7z', { stdio: 'ignore' });
  console.log('   ✅ 7-Zip instalado (suporte a CB7)');
} catch (error) {
  console.log('   ⚠️  7-Zip não encontrado (CB7 não será suportado)');
  console.log('   💡 Instale: brew install p7zip (macOS) ou apt-get install p7zip-full (Linux)');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Verificação concluída com erros!');
  console.log('\n💡 Para corrigir:');
  console.log('   npm install');
  process.exit(1);
} else {
  console.log('✅ Verificação concluída com sucesso!');
  console.log('\n🚀 Comandos disponíveis:');
  console.log('   • node dev-electron.js     - Modo desenvolvimento');
  console.log('   • node start-electron.js   - Modo produção');
  console.log('   • node build-electron.js   - Criar instalador');
  console.log('   • npm run dev              - Servidor web');
  process.exit(0);
}
