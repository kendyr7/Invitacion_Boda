# 📧 Configuración de EmailJS para Notificaciones

## 🚀 Pasos para Configurar EmailJS

### 1. Crear Cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar Servicio de Email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"** (recomendado)
4. Conecta tu cuenta de Gmail (kendyr7@gmail.com)
5. Copia el **Service ID** que se genera

### 3. Crear Template de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa este template:

**Asunto del Email:**
```
🎉 Nueva Confirmación de Asistencia - Boda
```

**Configuración del Template:**
- **To Email:** {{to_email}}
- **From Name:** Sistema de Invitaciones
- **From Email:** (usa tu email de Gmail configurado en el servicio)
- **Reply To:** kendyr7@gmail.com
- **Bcc:** (dejar vacío)
- **Cc:** (dejar vacío)

**Contenido del Template (copia esto en el Code Editor de EmailJS):**
```
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px">
  <h2 style="color: #d4af37; margin-bottom: 20px">🎉 Nueva Confirmación de Asistencia</h2>
  <p style="padding-top: 16px; border-top: 1px solid #eaeaea">¡Hola!</p>
  <p>
    Tienes una nueva confirmación de asistencia para la boda:
  </p>
  <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0">
    <p><strong>👤 Nombre del Invitado:</strong> {{guest_name}}</p>
    <p><strong>👥 Número de Invitados:</strong> {{number_of_guests}}</p>
    <p><strong>📅 Fecha de Confirmación:</strong> {{confirmation_date}}</p>
    <p><strong>💌 Mensaje Especial:</strong> {{special_message}}</p>
  </div>
  <p style="padding-top: 16px; border-top: 1px solid #eaeaea">
    ¡Saludos!<br />Sistema de Invitaciones de Boda
  </p>
</div>
```

4. Copia el **Template ID** que se genera

### 4. Obtener Public Key
1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key**

### 5. Configurar Variables de Entorno
Crea o actualiza el archivo `.env.local` en la raíz del proyecto:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id_aqui
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
```

### 6. Reiniciar el Servidor
```bash
npm run dev -- -p 3001
```

## ✅ Verificar Funcionamiento

1. Ve a la página de confirmación: `http://localhost:3001/confirmation`
2. Confirma una asistencia de prueba
3. Revisa tu email (kendyr7@gmail.com) para ver si llegó la notificación

## 🔧 Solución de Problemas

### Si no llegan los emails:
1. Verifica que las variables de entorno estén correctas
2. Revisa la consola del navegador para errores
3. Asegúrate de que Gmail esté conectado correctamente en EmailJS
4. Revisa la carpeta de spam

### Límites del Plan Gratuito:
- **200 emails por mes**
- Si necesitas más, considera upgradearlo

## 📱 Próximos Pasos (Opcional)

Si quieres agregar WhatsApp más adelante:
1. Crear cuenta en Twilio
2. Configurar WhatsApp Business API
3. Integrar con el sistema actual

---

**¡Listo!** Ahora recibirás un email cada vez que alguien confirme su asistencia. 🎉