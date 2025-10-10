export default function (plop) {
  plop.setGenerator('service', {
    description: 'Gera um novo service com boilerplate Axios',
    prompts: [{ type: 'input', name: 'name', message: 'Nome do service:' }],
    actions: [
      {
        type: 'add',
        path: 'src/api/services/{{camelCase name}}Service.ts',
        templateFile: 'plop-templates/service.hbs',
      },
    ],
  });
}
