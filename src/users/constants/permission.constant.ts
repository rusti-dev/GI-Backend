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
  PROPERTY = 'Propiedad',
  PROPERTY_SHOW = 'Mostrar propiedades',
  PROPERTY_CREATE = 'Crear propiedades',
  PROPERTY_UPDATE = 'Actualizar propiedades',
  PROPERTY_DELETE = 'Eliminar propiedades',

  // Sectores
  SECTOR = 'Sector',
  SECTOR_SHOW = 'Mostrar sectores',
  SECTOR_CREATE = 'Crear sectores',
  SECTOR_UPDATE = 'Actualizar sectores',
  SECTOR_DELETE = 'Eliminar sectores',


  //permisos para owners
  OWNER = 'Propietario',
  OWNER_SHOW = 'Mostrar propietarios',
  OWNER_CREATE = 'Crear propietarios',
  OWNER_UPDATE = 'Actualizar propietarios',
  OWNER_DELETE = 'Eliminar propietarios',

  // Permiso para categorias
  CATEGORY = 'Categoría',
  CATEGORY_SHOW = 'Mostrar categorías',
  CATEGORY_CREATE = 'Crear categorías',
  CATEGORY_UPDATE = 'Actualizar categorías',
  CATEGORY_DELETE = 'Eliminar categorías',

  //Permiso para modalidad
  MODALITY = 'Modalidad',
  MODALITY_SHOW = 'Mostrar modalidades',
  MODALITY_CREATE = 'Crear modalidades',
  MODALITY_UPDATE = 'Actualizar modalidades',
  MODALITY_DELETE = 'Eliminar modalidades',

  //permiso para Bitacora
  LOG = 'Bitacora',
  LOG_SHOW = 'Mostrar bitacora',

}
