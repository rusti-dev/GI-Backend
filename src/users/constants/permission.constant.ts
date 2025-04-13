export const PERMISSION_KEY = 'permissions';

export enum PERMISSION {
  // user
  USER = 'Usuario',
  USER_SHOW = 'Mostrar usuarios',
  ROLE = 'Rol',
  ROLE_SHOW = 'Mostrar roles',
  PERMISSION = 'Permiso',
  PERMISSION_SHOW = 'Mostrar permisos',

  // realstate
  REALSTATE = 'Inmobiliaria',
  REALSTATE_SHOW = 'Mostrar inmobiliarias',
  REALSTATE_CREATE = 'Crear inmobiliarias',
  REALSTATE_UPDATE = 'Actualizar inmobiliarias',
  REALSTATE_DELETE = 'Eliminar inmobiliarias',
  REALSTATE_PROPERTY = 'Propiedad',
  REALSTATE_PROPERTY_SHOW = 'Mostrar propiedades',
  REALSTATE_PROPERTY_CREATE = 'Crear propiedades',
  REALSTATE_PROPERTY_UPDATE = 'Actualizar propiedades',
  REALSTATE_PROPERTY_DELETE = 'Eliminar propiedades',
}
