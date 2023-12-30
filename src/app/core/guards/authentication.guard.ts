import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const authGuard = (
  keycloak: KeycloakService,
  routerState: RouterStateSnapshot,
  route: ActivatedRouteSnapshot
): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    const authenticated = await keycloak.isLoggedIn();
    // Force the user to log in if currently unauthenticated.
    if (!authenticated) {
      await keycloak.login({
        redirectUri: window.location.origin + routerState.url
      });
    }
    // Get the roles required from the route.
    const requiredRoles = route.data.roles;
    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      resolve(true);
    }
    // Check if all the required roles are present.
    const roles = await keycloak.getUserRoles();
    const hasRequiredRoles = requiredRoles.every((role) => roles.includes(role));

    if (hasRequiredRoles) {
      resolve(true);
    } else {
      reject(false);
    }
  });
};
