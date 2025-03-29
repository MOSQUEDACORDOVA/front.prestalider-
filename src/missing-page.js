export class MissingPage {
  static parameters = ['id'];
  missingComponent;

  load(parameters) {
    this.missingComponent = parameters.id;
  }
}
