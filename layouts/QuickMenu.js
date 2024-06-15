import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Row, Col, Image, Dropdown, ListGroup } from 'react-bootstrap';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import useMounted from 'hooks/useMounted';

import signOut from '../lib/userSignOut';
import { useRouter } from 'next/navigation';
import { useAuthContext } from "../context/AuthContext";

const QuickMenu = () => {
  const { user } = useAuthContext()
  const { userInfo } = useAuthContext()
  
  const router = useRouter()

  useEffect(() => {
    if (user == null) router.push("/")
  }, [user])

  const redirect = (correo) => {
    const prop = { correo: correo };
    router.push({
      pathname: "/pages/perfilUsuarioActual",
      query: prop,
    });
  };

  const redirectToEditarPerfil = (reference) => {
    const prop = {reference: reference}
    router.push({
      pathname: "/pages/editarUsuarioActual",
      query: prop,
    });
  };

  
  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      console.log(error);
    } else {
      console.log('Deslogueado');
      router.push('/');
    }
  };

  const hasMounted = useMounted();

  const isDesktop = useMediaQuery({
    query: '(min-width: 1224px)',
  });

  const profilePicture = {
    cursor: 'pointer',
  }

  const QuickMenuDesktop = () => {
    return (
      <ListGroup
        as='ul'
        bsPrefix='navbar-nav'
        className='navbar-right-wrap ms-auto d-flex nav-top-wrap'
      >
        <Dropdown style={profilePicture} as='li' className='ms-2'>
          <Dropdown.Toggle
            as='a'
            bsPrefix=' '
            className='rounded-circle'
            id='dropdownUser'
          >
            <div className='avatar avatar-md avatar-indicators avatar-online'>
              <Image
                alt='avatar'
                src={userInfo && userInfo[0] && userInfo[0].fotoPerfil ? userInfo[0].fotoPerfil : '/images/avatar/avatar-1.jpg'}
                className='rounded-circle'
              />
              
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className='dropdown-menu dropdown-menu-end '
            align='end'
            aria-labelledby='dropdownUser'
            show
          >
            <Dropdown.Item as='div' className='px-4 pb-0 pt-2' bsPrefix=' '>
              <div className='lh-1 '>
                <h5 className='mb-1'> <h5 className='mb-1'>{userInfo && userInfo[0] && userInfo[0].nombre ? userInfo[0].nombre : 'Nombre no disponible'}</h5></h5>
                <Link href="#" onClick={() => redirect(userInfo[0].correoElectronico)} className='text-inherit fs-6'>
                  Ver mi perfil
                </Link>
              </div>
              <div className=' dropdown-divider mt-3 mb-2'></div>
            </Dropdown.Item>
            <Dropdown.Item eventKey='2'>
              <i className='fe fe-user me-2'></i> <a onClick={() => redirectToEditarPerfil(userInfo[0].reference)}>Editar Perfil</a>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              <i className='fe fe-power me-2'></i>Cerrar sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  const QuickMenuMobile = () => {
    return (
      <ListGroup
        as='ul'
        bsPrefix='navbar-nav'
        className='navbar-right-wrap ms-auto d-flex nav-top-wrap'
      >
        <Dropdown style={profilePicture} as='li' className='ms-2'>
          <Dropdown.Toggle
            as='a'
            bsPrefix=' '
            className='rounded-circle'
            id='dropdownUser'
          >
            <div className='avatar avatar-md avatar-indicators avatar-online'>
              <Image
                alt='avatar'
                src={userInfo && userInfo[0] && userInfo[0].fotoPerfil ? userInfo[0].fotoPerfil : '/images/avatar/avatar-1.jpg'}
                className='rounded-circle'
              />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className='dropdown-menu dropdown-menu-end '
            align='end'
            aria-labelledby='dropdownUser'
          >
            <Dropdown.Item as='div' className='px-4 pb-0 pt-2' bsPrefix=' '>
              <div className='lh-1 '>
              <h5 className='mb-1'>{userInfo && userInfo[0] && userInfo[0].nombre ? userInfo[0].nombre : 'Nombre no disponible'}</h5>
              <Link href="#" onClick={() => redirect(userInfo[0].correoElectronico)} className='text-inherit fs-6'>
                Ver mi perfil
              </Link>
              </div>
              <div className=' dropdown-divider mt-3 mb-2'></div>
            </Dropdown.Item>
            <Dropdown.Item eventKey='2'>
              <i className='fe fe-user me-2'></i> <a onClick={() => redirectToEditarPerfil(userInfo[0].reference)}>Editar Perfil</a>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              <i className='fe fe-power me-2'></i>Cerrar sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
    );
  };

  return (
    <Fragment>
      {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
    </Fragment>
  );
};

export default QuickMenu;
