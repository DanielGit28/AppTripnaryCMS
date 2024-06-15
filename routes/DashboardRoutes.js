import { v4 as uuid } from "uuid";
/**
 *  All Dashboard Routes
 *
 *  Understanding name/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon name.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	id 			: Number - You can use uuid() as value to generate unique ID using uuid library, you can also assign constant unique ID for react dynamic objects.
 *  title 		: String - If menu contains childern use title to provide main menu name.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  name 		: String - If it's menu item in which you are specifiying link, use name ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */

export const DashboardMenu = [
  {
    id: uuid(),
    title: "Dashboard",
    icon: "home",
    link: "/",
  },
  {
    id: uuid(),
    title: "Mi Perfil",
    icon: "layers",
    children: [
      {
        id: uuid(),
        link: "/pages/perfilUsuarioActual?",
        name: "Ver mi perfil",
      },
      {
        id: uuid(),
        link: "/pages/editarUsuarioActual?",
        name: "Editar mi perfil",
      },
    ],
  },
  {
    id: uuid(),
    title: "Administración",
    icon: "layers",
    children: [
      { id: uuid(), link: "/pages/administradores", name: "Administradores" },
      {
        id: uuid(),
        link: "/pages/registrarAdmin",
        name: "Crear Administrador",
      },
    ],
  },
  {
    id: uuid(),
    title: "Usuarios",
    icon: "users",
    children: [{ id: uuid(), link: "/pages/usuarios", name: "Usuarios" }],
  },
  {
    id: uuid(),
    title: "Continentes",
    icon: "compass",
    children: [
      { id: uuid(), link: "/pages/continentes", name: "Continentes" },
      {
        id: uuid(),
        link: "/pages/registrarContinente",
        name: "Crear Continente",
      },
    ],
  },
  {
    id: uuid(),
    title: "Paises",
    icon: "compass",
    children: [
      { id: uuid(), link: "/pages/paises", name: "Paises" },
      { id: uuid(), link: "/pages/registrarPais", name: "Crear País" },
    ],
  },
  {
    id: uuid(),
    title: "Ciudades",
    icon: "compass",
    children: [
      { id: uuid(), link: "/pages/ciudades", name: "Ciudades" },
      { id: uuid(), link: "/pages/registrarCiudad", name: "Crear Ciudad" },
    ],
  },
  {
    id: uuid(),
    title: "Lugares",
    icon: "compass",
    children: [
      { id: uuid(), link: "/pages/lugares", name: "Lugares" },
      { id: uuid(), link: "/pages/registrarLugar", name: "Crear Lugar" },
    ],
  },
  {
    id: uuid(),
    title: "Prompts",
    icon: "code",
    children: [
      { id: uuid(), link: "/pages/prompts/prompts", name: "Prompts" },
      {
        id: uuid(),
        link: "/pages/prompts/registrarPrompt",
        name: "Crear Prompt",
      },
    ],
  },
  {
    id: uuid(),
    title: "Tiquetes",
    icon: "compass",
    link: "/pages/tiquetes",
  },
  {
    id: uuid(),
    title: "Reportes",
    icon: "monitor",
    link: "/pages/reportes",
  },
];

export default DashboardMenu;
