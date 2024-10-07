import { IState } from "../types/IState";

export function replaceHandlebars(template: string, state: IState): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    (key && state[key]) ? state[key].toString() : match);
}
