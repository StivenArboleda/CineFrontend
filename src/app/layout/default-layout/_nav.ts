import { INavData } from '@coreui/angular';

export const navItems = (role: string): INavData[] => {
  const items: INavData[] = [

  ];

  if (role === 'ROLE_ADMIN') {
      items.push(
        {
          title: true,
          name: 'Gestión'
        },
        {
          name: 'Gestión de películas',
          url: '/movies',
          iconComponent: { name: 'cil-notes' }
        },
        {
          name: 'Gestión de clientes',
          url: '/customers',
          iconComponent: { name: 'cil-user' }
        },
        {
          name: 'Gestión de compras',
          url: '/tickets',
          iconComponent: { name: 'cil-credit-card' }
        }
      );
  }
    if (role === 'ROLE_CLIENTE') {
      items.push(
        {
          title: true,
          name: 'Películas'
        },
        {
          name: 'Explora y compra',
          url: '/shop',
          iconComponent: { name: 'cil-movie' }
        },
      );
    }
  return items;
}
