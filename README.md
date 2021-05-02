
# Chat app

Aplicacion web con chat en tiempo real

## Tech Stack

**Cliente:** React, Apollo-client, bootstrap

**Servidor:** Nodejs, Apollo-server, Sequelize, Mysql, jwt

## Screenshot

![Preview](https://github.com/kioshiokamoto/merng-chat-web/blob/main/preview/screenshot.png?raw=true)

<hr/>
## Ejecutar localmente

Clonar el proyecto

```bash
  git clone https://github.com/kioshiokamoto/merng-chat-web
```

Ir a la ruta de proyecto

```bash
  cd merng-chat-web
```


Instalar dependencias

```bash
  npm install && cd client && npm install
```

**OBS: Se debe agregar datos de mysql en config.json** 

Crear tablas en base de datos
```
  cd src && sequelize db:migrate
```

Inicializar servidor

```bash
  npm run server
```

Inicializar cliente

```bash
  cd client && npm start
```

<hr/>

**Referencia de proyecto:**

[Classed](https://www.youtube.com/channel/UC2-slOJImuSc20Drbf88qvg)
