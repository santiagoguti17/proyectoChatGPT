# ChatGPT Mobile App  

Este proyecto es una aplicación móvil desarrollada con **React Native** y **Expo**, que utiliza Firebase para la autenticación y almacenamiento de datos. La aplicación permite a los usuarios interactuar con un chatbot basado en inteligencia artificial, gestionar conversaciones y explorar funcionalidades como registro, inicio de sesión y manejo de chats.  

## Características  

- **Autenticación de usuarios**: Registro, inicio de sesión y cierre de sesión utilizando Firebase Authentication.  
- **Gestión de chats**: Crear, actualizar, eliminar y listar chats almacenados en Firebase Firestore.  
- **Interacción con IA**: Enviar mensajes al chatbot y recibir respuestas generadas por un modelo de lenguaje.  
- **Interfaz intuitiva**: Diseño moderno y responsivo con navegación fluida.  
- **Markdown**: Soporte para mostrar respuestas del chatbot en formato Markdown.  

## Tecnologías utilizadas  

- **React Native**: Framework para el desarrollo de aplicaciones móviles multiplataforma.  
- **Expo**: Herramienta para simplificar el desarrollo y despliegue de aplicaciones React Native.  
- **Firebase**:  
    - **Authentication**: Manejo de usuarios.  
    - **Firestore**: Almacenamiento de chats y mensajes.  
- **React Context API**: Gestión del estado global para autenticación y datos de chats.  
- **TypeScript**: Tipado estático para un desarrollo más robusto.  
- **React Native Markdown Display**: Renderizado de respuestas en formato Markdown.  

## Estructura del proyecto  

```plaintext  
proyectoChatGPT/  
├── app/  
│   ├── _layout.tsx       # Configuración de navegación  
│   ├── chat.tsx          # Pantalla principal del chat  
│   ├── home.tsx          # Pantalla de inicio de sesión  
│   ├── index.tsx         # Pantalla inicial  
│   ├── register.tsx      # Pantalla de registro  
│   ├── welcome.tsx       # Pantalla de bienvenida  
├── context/  
│   ├── AuthContext.tsx   # Contexto para autenticación  
│   ├── DataContext.tsx   # Contexto para gestión de datos  
├── interfaces/  
│   ├── AppInterfaces.ts  # Interfaces para tipado de datos  
│   ├── Responses.ts      # Interfaces para respuestas de la IA  
├── utils/  
│   ├── firebaseconfig.ts # Configuración de Firebase  
├── assets/  
│   ├── fonts/            # Fuentes personalizadas  
│   ├── images/           # Imágenes del proyecto  
├── package.json          # Dependencias y scripts del proyecto  
├── tsconfig.json         # Configuración de TypeScript  
├── README.md             # Documentación del proyecto  
```  

## Instalación y configuración  

### Prerrequisitos  

- Node.js (v16 o superior)  
- Expo CLI (`npm install -g expo-cli`)  
- Cuenta de Firebase configurada  

### Pasos  

1. Clona este repositorio:  
     ```bash  
     git clone <URL_DEL_REPOSITORIO>  
     cd proyectoChatGPT  
     ```  

2. Instala las dependencias:  
     ```bash  
     npm install  
     ```  

3. Configura Firebase:  
     - Crea un proyecto en Firebase.  
     - Habilita **Authentication** (correo y contraseña) y **Firestore**.  
     - Copia las credenciales de configuración en `utils/firebaseconfig.ts`.  

4. Inicia la aplicación:  
     ```bash  
     npm start  
     ```  

## Scripts disponibles  

- `npm start`: Inicia el servidor de desarrollo.  
- `npm run android`: Compila y ejecuta la app en un emulador Android.  
- `npm run ios`: Compila y ejecuta la app en un emulador iOS.  
- `npm run web`: Ejecuta la app en el navegador.  
- `npm run lint`: Analiza el código para detectar errores de estilo.  

## Contribución  

1. Haz un fork del repositorio.  
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).  
3. Realiza tus cambios y haz commit (`git commit -m "Añadir nueva funcionalidad"`).  
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).  
5. Abre un Pull Request.  

## Licencia  

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.  

## Contacto  

Si tienes preguntas o sugerencias, no dudes en contactarme a través de [tu correo electrónico o redes sociales].  
