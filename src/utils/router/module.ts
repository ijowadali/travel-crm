export function sortRoutes(routes: any[]) {
  return routes
    .sort((next, pre) => Number(next.meta?.order) - Number(pre.meta?.order))
    .map((i) => {
      if (i.children) sortRoutes(i.children);
      return i;
    });
}

export function handleModuleRoutes(modules: any) {
  const routes: any[] = [];

  Object.keys(modules).forEach((key) => {
    const item = modules[key].routes;
    if (item) {
      routes.push(item);
    } else {
      window.console.error(`Routing module parsing error: key = ${key}`);
    }
  });

  return sortRoutes(routes);
}
