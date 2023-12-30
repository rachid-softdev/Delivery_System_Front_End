import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Gestion des livreurs',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Livreurs',
          route: '/drivers',
          children: [{ label: 'Liste des livreurs', route: '/dashboard/drivers' }],
        },
        /*
        {
          icon: 'assets/icons/heroicons/outline/icons.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Inscription', route: '/auth/sign-up' },
            { label: 'Connexion in', route: '/auth/sign-in' },
            { label: 'Mot de passe oublié', route: '/auth/forgot-password' },
            { label: 'Nouveau mot de passe', route: '/auth/new-password' },
          ],
        },
        */
      ],
    },
    {
      group: 'Gestion des tournées',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Tournées',
          route: '/rounds',
          children: [{ label: 'Liste des tournées', route: '/dashboard/rounds' }],
        },
        /*
        {
          icon: 'assets/icons/heroicons/outline/icons.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Inscription', route: '/auth/sign-up' },
            { label: 'Connexion in', route: '/auth/sign-in' },
            { label: 'Mot de passe oublié', route: '/auth/forgot-password' },
            { label: 'Nouveau mot de passe', route: '/auth/new-password' },
          ],
        },
        */
      ],
    },
    {
      group: 'Gestion des livraisons',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Livraisons',
          route: '/deliveries',
          children: [{ label: 'Liste des livraisons', route: '/dashboard/deliveries' }],
        },
        /*
        {
          icon: 'assets/icons/heroicons/outline/icons.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Inscription', route: '/auth/sign-up' },
            { label: 'Connexion in', route: '/auth/sign-in' },
            { label: 'Mot de passe oublié', route: '/auth/forgot-password' },
            { label: 'Nouveau mot de passe', route: '/auth/new-password' },
          ],
        },
        */
      ],
    },
    /*
    {
      group: 'Groupe 2',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/item_1.svg',
          label: 'Item 1',
          route: '/item_1',
        },
        {
          icon: 'assets/icons/heroicons/outline/item_2.svg',
          label: 'Item 2',
          route: '/item_2',
        },
      ],
    },
    */
    /*
    {
      group: 'Configuration',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/settings.svg',
          label: 'Paramètres',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/notifs.svg',
          label: 'Notifications',
          route: '/notifications',
        },
      ],
    },
    */
  ];
}
