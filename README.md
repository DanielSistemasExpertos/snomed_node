# Pasos para ejecutar el proyecto

### Instalación

```sh
$ cd nombre_nombre_proyecto
Instalar modulos necesarios en node
$ npm install
Instala para solo desarrollo, este modulo es para no tener que reiniciar el servidor en cada cambio
$ npm i nodemon -D
```

### end-point para obtener datos de la API
https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/SNOMEDCT-ES/2019-10-31/descriptions?&limit=100&term={termino_buscado}&lang=english


### Levantar servidor
```sh
$ npm run dev
```

### usar rutas
```sh
- muestra los términos relacionados, ejemplo x
$ http://localhost:3000/snomed/{termino_buscado}

- Buscar término
$ http://localhost:3000/snomed/

```

