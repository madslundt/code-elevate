import { IState } from "../types/IState";

export function replaceHandlebars(state: IState, template?: string): string {
  if (!template) {
    return '';
  }

  return template.replace(/{(\w+)}/g, (match, key) =>
    (key && state[key]) ? state[key].toString() : match);
}
