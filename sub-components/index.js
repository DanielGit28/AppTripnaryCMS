/**
 * The folder sub-components contains sub component of all the pages,
 * so here you will find folder names which are listed in root pages.
 */

// sub components for /pages/dashboard
import ActiveProjects from "sub-components/dashboard/ActiveProjects";
import TasksPerformance from "sub-components/dashboard/TasksPerformance";
import ListaAdmins from "sub-components/listaAdmins/ListaAdmins";

// sub components for /pages/profile
import AboutMe from "sub-components/profile/AboutMe";
import AboutMeUser from "sub-components/profile/AboutMeUser";
import ActivityFeed from "sub-components/profile/ActivityFeed";
import MyTeam from "sub-components/profile/MyTeam";
import RecuperarContrasenniaUser from "sub-components/profile/RecuperarContrasenniaUser";
import ProfileHeader from "sub-components/profile/ProfileHeader";
import ProfileHeaderUser from "sub-components/profile/ProfileHeaderUser";
import ProjectsContributions from "sub-components/profile/ProjectsContributions";
import RecentFromBlog from "sub-components/profile/RecentFromBlog";

// sub components for /pages/billing
import CurrentPlan from "sub-components/billing/CurrentPlan";
import BillingAddress from "sub-components/billing/BillingAddress";
import CambiarEstado from "sub-components/profile/CambiarEstado";
// sub components for /pages/settings
import DeleteAccount from "sub-components/settings/DeleteAccount";
import EmailSetting from "sub-components/settings/EmailSetting";
import GeneralSetting from "sub-components/settings/GeneralSetting";
import Notifications from "sub-components/settings/Notifications";
import Preferences from "sub-components/settings/Preferences";
import ListaUsuarios from "./listaUsuarios/ListaUsuarios";
import ListaReportesUsuariosRegistrados from "./listaReportes/ListaReportesUsuariosRegistrados";
import ListaPaises from "./ListaPaises";
import ListaReportesCantidadViajes from "./listaReportes/ListaReportesCantidadViajes";
import ListaReportesCantidadPorDestinoViajes from "./listaReportes/ListaReportesCantidadPorDestinoViajes";
import AboutPais from "sub-components/profile/AboutPais";
import HeaderPais from "sub-components/profile/HeaderPais";
import CambiarEstadoPais from "sub-components/profile/CambiarEstadoPais";
import ListaLugaresRecomendados from "sub-components/lugaresRecomendados/ListaLugaresRecomendados";
import PerfilHeaderLugar from "sub-components/lugaresRecomendados/PerfilHeaderLugar";
import AboutPerfilLugar from "sub-components/lugaresRecomendados/AboutPerfilLugar";
import InfoGeneralLugar from "sub-components/lugaresRecomendados/InfoGeneralLugar";
import DropdownSearch from "sub-components/lugaresRecomendados/DropdownSearch";

import AboutCiudad from "./ciudades/AboutCiudad";
import ListaCiudades from "./ciudades/ListaCiudades";
import HeaderCiudad from "./ciudades/HeaderCiudad";
import CambiarEstadoCiudad from "./ciudades/CambiarEstadoCiudad";

import ListaTiquetes from "./tiquetes/ListaTiquetes";
import CambiarEstadoTiquete from "./tiquetes/CambiarEstadoTiquete";

import ProfileUsuarioActualHeaderUser from "sub-components/profile/ProfileUsuarioActualHeaderUser";

export {
  ActiveProjects,
  TasksPerformance,
  AboutMe,
  AboutMeUser,
  ActivityFeed,
  CambiarEstado,
  MyTeam,
  RecuperarContrasenniaUser,
  ProfileHeader,
  ProfileHeaderUser,
  ProjectsContributions,
  RecentFromBlog,
  CurrentPlan,
  BillingAddress,
  DeleteAccount,
  EmailSetting,
  GeneralSetting,
  Notifications,
  Preferences,
  ListaPaises,
  ListaUsuarios,
  ListaReportesUsuariosRegistrados,
  ListaReportesCantidadViajes,
  ListaReportesCantidadPorDestinoViajes,
  ListaAdmins,
  AboutPais,
  HeaderPais,
  CambiarEstadoPais,
  ListaLugaresRecomendados,
  PerfilHeaderLugar,
  AboutPerfilLugar,
  InfoGeneralLugar,
  DropdownSearch,
  AboutCiudad,
  ListaCiudades,
  HeaderCiudad,
  CambiarEstadoCiudad,
  ListaTiquetes,
  CambiarEstadoTiquete,
  ProfileUsuarioActualHeaderUser,
};
