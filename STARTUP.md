# Guía de Inicio Rápido - Morchis Nómina

## Pasos para ejecutar el sistema completo

### 1. Verificar requisitos
- ✅ Node.js 18+ instalado
- ✅ MongoDB ejecutándose en localhost:27017

### 2. Instalar dependencias
```bash
# En la raíz del proyecto
npm install
npm run backend:install
```

### 3. Configurar variables de entorno
```bash
# El archivo server/.env ya está configurado con valores por defecto
# Edítalo si necesitas cambiar la configuración de MongoDB o JWT
```

### 4. Inicializar base de datos
```bash
npm run backend:seed
```

### 5. Ejecutar en modo desarrollo
```bash
# Opción 1: Ejecutar ambos servidores
npm run dev:all

# Opción 2: Por separado
# Terminal 1
npm run dev

# Terminal 2 
npm run backend:dev
```

### 6. Acceder al sistema
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

### 7. Credenciales de prueba
- **Super Admin**: admin@morchis.com / admin123
- **Usuario**: usuario@morchis.com / usuario123

## Comandos útiles

```bash
# Verificar estado del backend
curl http://localhost:3001/health

# Probar login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@morchis.com","password":"admin123"}'

# Rebuilds
npm run backend:build
npm run build

# Linting
npm run backend:lint
```

## Estructura de permisos implementada

### Módulos:
- USUARIOS, ROLES, PERMISOS, DASHBOARD, REPORTES, CONFIGURACION, AUDITORIA, NOMINA

### Acciones:
- CREATE, READ, UPDATE, DELETE, MANAGE

### Roles por defecto:
1. **Super Administrador**: Todos los permisos
2. **Administrador**: Gestión básica de usuarios y operaciones
3. **Usuario**: Solo lectura 
4. **Recursos Humanos**: Gestión de nómina y usuarios

¡Sistema listo para usar! 🚀
